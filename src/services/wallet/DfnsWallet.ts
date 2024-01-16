import jwt_decode, { JwtPayload } from "jwt-decode";
import dfnsStore from "../../stores/DfnsStore";
import router, { RouteType } from "../../stores/RouterStore";
import { getDfnsDelegatedClient, loginWithOAuth, recoverAccount } from "../../utils/dfns";
import { isHexPrefixed, msgHexToText, networkMapping, waitForEvent } from "../../utils/helper";
import { EventEmitter } from "../EventEmitter";
import LocalStorageService, {
	CACHED_WALLET_PROVIDER,
	DFNS_ACTIVE_WALLET,
	DFNS_CREDENTIALS,
	DFNS_END_USER_TOKEN,
	OAUTH_ACCESS_TOKEN,
	Wallet,
	WalletProvider,
} from "../LocalStorageService";
import { RegisterCompleteResponse } from "../api/Register";
import IWalletInterface, { WalletEvent } from "./IWalletInterface";
import { DfnsWalletProvider } from "../provider/DfnsWalletProvider";
import { BigNumber } from "ethers";
import { isDfnsError } from "../../utils/errors";
import { UserRecoveryChallenge } from "@dfns/sdk/codegen/datamodel/Auth";


class DfnsWallet implements IWalletInterface {
	private static ctx: DfnsWallet;

	private removeOnRouteChanged = () => {};

	private events: EventEmitter<any> = new EventEmitter();
	private constructor() {
		this.removeOnRouteChanged = this.onRouteChanged();

		DfnsWallet.ctx = this;
	}

	public static getInstance(): DfnsWallet {
		if (!DfnsWallet.ctx) {
			DfnsWallet.ctx = new DfnsWallet();
		}
		return DfnsWallet.ctx;
	}

	public connect(): Promise<any> {
		throw new Error("Method not implemented.");
	}

	public getAddress(): string | null {
		return dfnsStore.state.wallet?.address ?? null;
	}

	public async connectWithOAuthToken(oauthToken: string): Promise<string> {
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
				if (dfnsStore.state.showWalletValidation) {
					wallet = await this.waitForWalletValidation();
				}
			}
		} catch (error) {
			if (isDfnsError(error) && error.httpStatus === 401) {
				try {
					const response = await this.createAccount();
					dfnsStore.setValue("dfnsUserToken", response.userAuthToken);
					wallet = await this.validateWallet();
					if (dfnsStore.state.showWalletValidation) {
						wallet = await this.waitForWalletValidation();
					}
				} catch (err) {
					throw error;
				}
			} else {
				throw error;
			}
		}

		dfnsStore.setValue("wallet", wallet);
		this.events.emit(WalletEvent.CONNECTED, dfnsStore.state.wallet.address);
		this.getDfnsElement().dispatchEvent(new CustomEvent("walletConnected", { detail: wallet.address }));
		LocalStorageService.getInstance().items[CACHED_WALLET_PROVIDER].set(WalletProvider.DFNS);
		dfnsStore.setValue("walletService", this);
		return wallet.address;
	}

	public async recoverAccount(
		apiUrl: string,
		dfnsHost: string,
		appId: string,
		oauthAccessToken: string,
		challenge: UserRecoveryChallenge,
		recoveryCode: string,
		recoveryCredId: string,
	) {
		const userAuthToken = await recoverAccount(apiUrl, dfnsHost, appId, oauthAccessToken, challenge, recoveryCode, recoveryCredId);
		dfnsStore.setValue("oauthAccessToken", oauthAccessToken);
		dfnsStore.setValue("dfnsUserToken", userAuthToken);
		const dfnsDelegated = getDfnsDelegatedClient(dfnsStore.state.dfnsHost, dfnsStore.state.appId, userAuthToken);
		const wallets = await dfnsDelegated.wallets.listWallets({});
		let wallet: Wallet | null = null;
		wallet = wallets.items[0];
		if (!wallet) {
			wallet = await this.validateWallet();
			if (dfnsStore.state.showWalletValidation) {
				wallet = await this.waitForWalletValidation();
			}
		}
		dfnsStore.setValue("wallet", wallet);
		this.events.emit(WalletEvent.CONNECTED, dfnsStore.state.wallet.address);
		this.getDfnsElement().dispatchEvent(new CustomEvent("walletConnected", { detail: wallet.address }));
		LocalStorageService.getInstance().items[CACHED_WALLET_PROVIDER].set(WalletProvider.DFNS);
		dfnsStore.setValue("walletService", this);
		return wallet.address;
	}

	public async signMessage(message: string): Promise<string> {
		const sanitizedMesssage = isHexPrefixed(message) ? msgHexToText(message) : message;
		router.navigate(RouteType.SIGN_MESSAGE);

		this.getDfnsElement().setAttribute("message-to-sign", sanitizedMesssage);
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
		this.getDfnsElement().setAttribute("transaction-value", BigNumber.from(value).toString());
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

	public async isConnected() {
		const dfnsUserToken = LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].get();
		let wallet = LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].get();
		const oauthToken = LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get();

		if (!dfnsUserToken || !oauthToken || !wallet) {
			return false;
		}

		const decodedToken = jwt_decode(dfnsUserToken) as JwtPayload;

		const expiresAt = new Date(decodedToken?.exp! * 1000);
		const now = new Date();

		if (now < expiresAt) {
			return true;
		}
		return false;
	}

	public async getProvider(): Promise<any> {
		return new DfnsWalletProvider(this);
	}

	public close() {
		router.close();
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
		return response;
	}

	private async validateWallet(): Promise<Wallet> {
		router.navigate(RouteType.VALIDATE_WALLET);
		const response = await waitForEvent<Wallet>(this.getDfnsElement(), "walletCreated");
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

	private getDfnsElement() {
		return document.getElementsByTagName("dfns-main")[0] as HTMLDfnsMainElement;
	}
}

export default DfnsWallet;
