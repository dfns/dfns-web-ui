import { CredentialInfo } from "@dfns/sdk/codegen/datamodel/Auth";
import { GetWalletAssetsResponse, ListWalletsResponse } from "@dfns/sdk/generated/wallets";

export const DFNS_END_USER_TOKEN = 'dfnsEndUserToken'
export const DFNS_ACTIVE_WALLET = 'dfnsActiveWallet'
export const OAUTH_ACCESS_TOKEN = 'oauthAccessToken'
export const DFNS_CREDENTIALS = 'dfnsCredentials'
export const CACHED_WALLET_PROVIDER = 'cachedWalletProvider'


export type Wallet = ListWalletsResponse['items'][0]
export type WalletAsset = GetWalletAssetsResponse['assets'][0]

export enum WalletProvider {
	DFNS = 'dfns',
	WALLET_CONNECT = 'walletConnect'
}
export default class LocalStorageService {
	private static instance: LocalStorageService;

	private constructor() {
		LocalStorageService.instance = this;
	}

	public static getInstance(reset?: boolean) {
		if (!LocalStorageService.instance || reset) return new this();
		return LocalStorageService.instance;
	}

	public items = {
		[DFNS_END_USER_TOKEN]: {
			get: () => this.getValue<string>(DFNS_END_USER_TOKEN),
			set: (item: string) => this.setValue(DFNS_END_USER_TOKEN, item),
			delete: () => this.delete(DFNS_END_USER_TOKEN),
		},
		[DFNS_ACTIVE_WALLET]: {
			get: () => this.getValue<Wallet>(DFNS_ACTIVE_WALLET),
			set: (item: Wallet) => this.setValue(DFNS_ACTIVE_WALLET, item),
			delete: () => this.delete(DFNS_ACTIVE_WALLET),
		},
		[OAUTH_ACCESS_TOKEN]: {
			get: () => this.getValue<string>(OAUTH_ACCESS_TOKEN),
			set: (item: string) => this.setValue(OAUTH_ACCESS_TOKEN, item),
			delete: () => this.delete(OAUTH_ACCESS_TOKEN),
		},
		[DFNS_CREDENTIALS]: {
			get: () => this.getValue<CredentialInfo[]>(DFNS_CREDENTIALS),
			set: (item: CredentialInfo[]) => this.setValue(DFNS_CREDENTIALS, item),
			delete: () => this.delete(DFNS_CREDENTIALS),
		},
		[CACHED_WALLET_PROVIDER]: {
			get: () => this.getValue<WalletProvider>(CACHED_WALLET_PROVIDER),
			set: (item: WalletProvider) => this.setValue(CACHED_WALLET_PROVIDER, item),
			delete: () => this.delete(CACHED_WALLET_PROVIDER),
		}
	};

	private getValue<T>(key: keyof typeof this.items): T | null {
		const item = localStorage.getItem(key);
		if (!item) {
			return null;
		}

		const isArrayOrObject = item.match(/[{[]/);

		return (isArrayOrObject ? JSON.parse(item) : item) as T;
	}

	private setValue<T>(key: keyof typeof this.items, item: T) {
		localStorage.setItem(key, typeof item === "string" ? item : JSON.stringify(item));
		const event = new Event('localStorageChanged');
		window.dispatchEvent(event)
	}

	private delete(key: keyof typeof this.items) {
		localStorage.removeItem(key);
	}
}
