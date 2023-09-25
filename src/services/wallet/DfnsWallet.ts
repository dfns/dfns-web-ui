import { Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
import jwt_decode, { JwtPayload } from "jwt-decode";
import dfnsStore from "../../stores/DfnsStore";
import router, { RouteType } from "../../stores/RouterStore";
import { getDfnsDelegatedClient, isDfnsError } from "../../utils/dfns";
import { loginWithOAuth, networkMapping, waitForEvent } from "../../utils/helper";
import { EventEmitter } from "../EventEmitter";
import LocalStorageService, { DFNS_ACTIVE_WALLET, DFNS_CREDENTIALS, DFNS_END_USER_TOKEN, OAUTH_ACCESS_TOKEN } from "../LocalStorageService";
import { RegisterCompleteResponse } from "../api/Register";
import IWalletInterface, { WalletEvent } from "./IWalletInterface";

class DfnsWallet implements IWalletInterface {
	private static ctx: DfnsWallet;

	private removeOnRouteChanged = () => {};

	private events: EventEmitter<any> = new EventEmitter();
	private constructor(private shouldShowWalletValidation: boolean) {
		this.removeOnRouteChanged = this.onRouteChanged();
		// this.onStateChanged();

		DfnsWallet.ctx = this;
	}

	public static getInstance(shouldShowWalletValidation: boolean): DfnsWallet {
		if (!DfnsWallet.ctx) {
			DfnsWallet.ctx = new DfnsWallet(shouldShowWalletValidation);
		}
		if (DfnsWallet.ctx.shouldShowWalletValidation !== shouldShowWalletValidation) {
			DfnsWallet.ctx.removeOnRouteChanged();
			DfnsWallet.ctx = new DfnsWallet(shouldShowWalletValidation);
		}
		return DfnsWallet.ctx;
	}

	public connect(): Promise<any> {
		throw new Error("Method not implemented.");
	}

	public getAddress(): string | null {
		return dfnsStore.state.wallet?.address ?? null;
	}

	public async connectWithOAuthToken(oauthToken: string): Promise<Wallet> {
		let wallet: Wallet | null = null;
		try {
			dfnsStore.setValue("oauthAccessToken", oauthToken);
			const response = await loginWithOAuth(dfnsStore.state.apiUrl, dfnsStore.state.appId, dfnsStore.state.rpId, oauthToken);
			dfnsStore.setValue("dfnsUserToken", response.userAuthToken);
			const dfnsDelegated = getDfnsDelegatedClient(dfnsStore.state.dfnsHost, dfnsStore.state.appId, response.userAuthToken);
			const wallets = await dfnsDelegated.wallets.listWallets({});
			wallet = wallets.items[0];
			if (!wallet) {
				wallet = await this.validateWallet();
				if (this.shouldShowWalletValidation) {
					wallet = await this.waitForWalletValidation();
				}
			}
		} catch (error) {
			if (isDfnsError(error) && error.httpStatus === 401) {
				await this.createAccount();
				wallet = await this.validateWallet();
				if (this.shouldShowWalletValidation) {
					wallet = await this.waitForWalletValidation();
				}
			} else {
				throw error;
			}
		}
		dfnsStore.setValue("wallet", wallet);
		this.events.emit(WalletEvent.CONNECTED, dfnsStore.state.wallet.address);
		return wallet;
	}

	public async signMessage(message: string): Promise<string> {
		router.navigate(RouteType.SIGN_MESSAGE);
		this.getDfnsElement().setAttribute("message-to-sign", message);
		const response = await waitForEvent<string>(this.getDfnsElement(), "signedMessage");
		router.close();
		if (!response) throw new Error("User cancelled signature");
		return response;
	}

	public async transferTokens() {
		router.navigate(RouteType.TRANSFER_TOKENS);
		const response = await waitForEvent<string>(this.getDfnsElement(), "transferRequest");
		router.close();
		if (!response) throw new Error("User cancelled transfer");
		return response;
	}

	public async showWalletOverview() {
		router.navigate(RouteType.WALLET_OVERVIEW);
	}

	public async showSettings() {
		router.navigate(RouteType.SETTINGS);
	}

	public async showCreatePasskey() {
		router.navigate(RouteType.CREATE_PASSKEY);
	}

	public async showRecoverySetup() {
		router.navigate(RouteType.RECOVERY_SETUP);
	}

	public async disconnect(): Promise<void> {
		dfnsStore.setValue("dfnsUserToken", null);
		dfnsStore.setValue("oauthAccessToken", null);
		dfnsStore.setValue("wallet", null);
		dfnsStore.setValue("credentials", []);
		LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].delete();
		LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].delete();
		LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].delete();
		LocalStorageService.getInstance().items[DFNS_CREDENTIALS].delete();
		this.events.emit(WalletEvent.DISCONNECTED, null);
	}

	public async sendTransaction(to: string, value: string, data: string, txNonce?: number): Promise<string> {
		this.getDfnsElement().setAttribute("transaction-to", to);
		this.getDfnsElement().setAttribute("transaction-value", value);
		this.getDfnsElement().setAttribute(
			"transaction-decimals",
			networkMapping[dfnsStore.state.network].nativeCurrency.decimals.toString(),
		);
		this.getDfnsElement().setAttribute("transaction-token-symbol", networkMapping[dfnsStore.state.network].nativeCurrency.symbol);
		this.getDfnsElement().setAttribute("transaction-data", data);
		this.getDfnsElement().setAttribute("transaction-nonce", txNonce?.toString());
		router.navigate(RouteType.CONFIRM_TRANSACTION);

		const response = await waitForEvent<string>(this.getDfnsElement(), "transactionSent");

		router.close();
		if (!response) throw new Error("User cancelled signature");
		return response;
	}

	public async autoConnect(): Promise<boolean> {
		const oauthToken = LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get();
		const now = new Date();

		const isConnected = this.isConnected();
		if (isConnected) {
			this.events.emit(WalletEvent.CONNECTED, dfnsStore.state.wallet.address);
			return true;
		}
		if (!oauthToken) {
			return false;
		}

		const decodedOAuthToken = jwt_decode(oauthToken) as JwtPayload;

		const oauthIssuedAt = new Date(decodedOAuthToken?.iat! * 1000);
		const oauthExpiresAt = new Date(decodedOAuthToken?.exp! * 1000);

		if (oauthIssuedAt < now && now < oauthExpiresAt) {
			try {
				await this.connectWithOAuthToken(oauthToken);
			} catch (error) {
				return false;
			}
		}

		return false;
	}

	public onChange(event: WalletEvent, callback: (data: any) => void): () => void {
		this.events.on(event, callback);
		return () => {
			this.events.off(event, callback);
		};
	}

	private onRouteChanged() {
		const callback = (route: RouteType) => {
			this.events.emit(WalletEvent.ROUTE_CHANGED, route);
		};
		router.routerEvent.on("changed", callback);
		return () => {
			router.routerEvent.off("changed", callback);
		};
	}

	private async createAccount() {
		router.navigate(RouteType.CREATE_ACCOUNT);
		const response = await waitForEvent<RegisterCompleteResponse>(this.getDfnsElement(), "passkeyCreated");
		router.close();
		if (!response) throw new Error("User cancelled connection");
		dfnsStore.setValue("dfnsUserToken", response.userAuthToken);
		return response;
	}

	private async validateWallet(): Promise<Wallet> {
		router.navigate(RouteType.VALIDATE_WALLET);
		this.getDfnsElement().setAttribute("should-show-wallet-validation", this.shouldShowWalletValidation ? "true" : undefined);
		const response = await waitForEvent<Wallet>(this.getDfnsElement(), "walletValidated");
		router.close();
		if (!response) throw new Error("User cancelled connection");
		dfnsStore.setValue("wallet", response);
		return response;
	}

	private async waitForWalletValidation(): Promise<any> {
		router.navigate(RouteType.WALLET_VALIDATION);
		const response = await waitForEvent(this.getDfnsElement(), "walletValidated");
		router.close();
		if (!response) throw new Error("User cancelled connection");
		return response;
	}

	public async isConnected() {
		const dfnsUserToken = LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get();
		let wallet = LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get();
		const oauthToken = LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get();

		if (!dfnsUserToken || !oauthToken || !wallet) {
			return false;
		}

		const decodedToken = jwt_decode(dfnsUserToken) as JwtPayload;

		const issuedAt = new Date(decodedToken?.iat! * 1000);
		const expiresAt = new Date(decodedToken?.exp! * 1000);
		const now = new Date();

		if (issuedAt < now && now < expiresAt) {
			return true;
		}
		return false;
	}

	private getDfnsElement() {
		return document.getElementsByTagName("dfns-main")[0] as HTMLDfnsMainElement;
	}
}

export default DfnsWallet;
