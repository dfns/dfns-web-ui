import { CredentialInfo } from "@dfns/sdk/codegen/datamodel/Auth";
import { createStore } from "@stencil/store";

import LocalStorageService, {
	DFNS_ACTIVE_WALLET,
	DFNS_CREDENTIALS,
	DFNS_END_USER_TOKEN,
	OAUTH_ACCESS_TOKEN,
	Wallet,
	WalletAsset,
} from "../services/LocalStorageService";
import { EventEmitter } from "../services/EventEmitter";
import IWalletInterface from "../services/wallet/IWalletInterface";
import { BlockchainNetwork } from "@dfns/sdk/codegen/datamodel/Wallets";
import { IColors } from "../common/interfaces/IColors";
import { EThemeModeType } from "../common/enums/themes-enums";



interface DfnsState {
	appName: string | null;
	apiUrl: string | null;
	dfnsHost: string | null;
	appId: string | null;
	rpId: string | null;
	network: BlockchainNetwork | null;
	dfnsUserToken: string | null;
	wallet: Wallet | null;
	oauthAccessToken: string | null;
	appLogoUrl: string | null;
	credentials: CredentialInfo[];
	defaultDevice: "mobile" | "desktop" | null;
	assets: WalletAsset[];
	googleEnabled: boolean;
	googleClientId: string;
	customButtonEnabled: boolean;
	customButtonText: string;
	customButtonIcon: string | null;
	customButtonCallback: () => any | null;
	primaryColor: string | null;
	theme: EThemeModeType;
	lang: string;
	walletService: IWalletInterface | null;
	walletConnectEnabled: boolean;
	walletConnectProjectId: string;
	colors: IColors;
	showWalletValidation: boolean;
	disableLogoutUI: boolean;
	activateRecovery: boolean;
	showRecoverySetupAtWalletCreation: boolean;
	showRecoverySetupAfterRecoverAccount: boolean;
}

const dfnsStoreEvent = new EventEmitter<DfnsState>();

const { state } = createStore<DfnsState>({
	appName: null,
	apiUrl: null,
	dfnsHost: null,
	appId: null,
	rpId: null,
	dfnsUserToken: null,
	wallet: null,
	appLogoUrl: null,
	oauthAccessToken: null,
	credentials: [],
	assets: [],
	googleClientId: "",
	googleEnabled: false,
	customButtonEnabled: false,
	customButtonText: "",
	customButtonIcon: null,
	customButtonCallback: null,
	primaryColor: null,
	theme: EThemeModeType.LIGHT,
	lang: "en",
	walletService: null,
	network: null,
	walletConnectEnabled: false,
	walletConnectProjectId: "",
	defaultDevice: null,
	colors: null,
	showWalletValidation: false,
	disableLogoutUI: false,
	activateRecovery: false,
	showRecoverySetupAtWalletCreation: false,
	showRecoverySetupAfterRecoverAccount: false,
});

function setValue<T extends keyof DfnsState>(key: T, value: DfnsState[T]) {
	switch (key) {
		case "dfnsUserToken":
			if (!value) {
				LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].delete();
				break;
			}
			LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(value as string);
			break;
		case "oauthAccessToken":
			if (!value) {
				LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].delete();
				break;
			}
			LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].set(value as string);
			break;
		case "wallet":
			if (!value) {
				LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].delete();
				break;
			}
			LocalStorageService.getInstance().items[DFNS_ACTIVE_WALLET].set(value as Wallet);
			break;
		case "credentials":
			if (!value) {
				LocalStorageService.getInstance().items[DFNS_CREDENTIALS].delete();
				break;
			}
			LocalStorageService.getInstance().items[DFNS_CREDENTIALS].set(value as CredentialInfo[]);
			break;
	}
	state[key] = value;
	dfnsStoreEvent.emit("changed", state);
}

const dfnsStore: {
	state: Readonly<DfnsState>;
	setValue: <T extends keyof DfnsState>(key: T, value: DfnsState[T]) => void;
	dfnsStoreEvent: EventEmitter<DfnsState>;
} = {
	state,
	setValue,
	dfnsStoreEvent,
};

export default dfnsStore;
