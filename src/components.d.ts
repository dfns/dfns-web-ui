/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { EAlertVariant } from "./utils/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "./utils/enums/buttons-enums";
import { JSX } from "@stencil/core";
import { RegisterCompleteResponse } from "./services/api/Register";
import { CreatePasskeyAction, SettingsAction, WalletOverviewAction } from "./utils/enums/actions-enum";
import { BlockchainNetwork, Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
import { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";
import { ITypo, ITypoColor } from "./utils/enums/typography-enums";
export { EAlertVariant } from "./utils/enums/alerts-enums";
export { EButtonSize, EButtonVariant } from "./utils/enums/buttons-enums";
export { JSX } from "@stencil/core";
export { RegisterCompleteResponse } from "./services/api/Register";
export { CreatePasskeyAction, SettingsAction, WalletOverviewAction } from "./utils/enums/actions-enum";
export { BlockchainNetwork, Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
export { GetSignatureResponse } from "@dfns/sdk/codegen/Wallets";
export { ITypo, ITypoColor } from "./utils/enums/typography-enums";
export namespace Components {
    interface DfnsAlert {
        "classCss"?: string;
        "errorIconSrc": string;
        "hasTitle": boolean;
        "infoIconSrc": string;
        "variant": EAlertVariant;
        "warningIconSrc": string;
    }
    interface DfnsButton {
        "classCss"?: string;
        "content": string;
        "disabled": boolean;
        "fullwidth": boolean;
        "icon"?: JSX.Element;
        "iconposition": "left" | "right";
        "iconstyle"?: any;
        "isloading": boolean;
        "onClick": () => any;
        "sizing": EButtonSize;
        "type": "button" | "submit";
        "variant": EButtonVariant;
    }
    interface DfnsCreateAccount {
        "authenticatorAttachment": AuthenticatorAttachment;
    }
    interface DfnsCreatePasskey {
        "visible": string;
    }
    interface DfnsInputField {
        "disableErrors": boolean;
        "errors": string[];
        "fullWidth": boolean;
        "isReadOnly": boolean;
        "label": string;
        "leftElement": any;
        "onChange": (input: string) => void;
        "placeholder": string;
        "rightElement": any;
        "type": string;
        "value": string;
    }
    interface DfnsLayout {
        "bloomLogoSrc": string;
        "closeBtn"?: boolean;
        "crossIconSrc": string;
        "onClickCloseBtn": () => void;
    }
    interface DfnsLoader {
        "LoaderIconSrc": string;
        "classCss"?: string;
    }
    interface DfnsLogin {
        "authenticatorAttachment": AuthenticatorAttachment;
    }
    interface DfnsMain {
        "messageToSign": string;
        "network": BlockchainNetwork;
        "userCreationAuthenticatorAttachment": AuthenticatorAttachment;
    }
    interface DfnsRecoverySetup {
        "visible": string;
    }
    interface DfnsSettings {
        "confirmationImgSrc": string;
    }
    interface DfnsSignMessage {
        "appId": string;
        "dfnsHost": string;
        "dfnsUserToken": string;
        "message": string;
        "rpId": string;
        "visible": string;
        "walletId": string;
    }
    interface DfnsStepper {
        "activeIndices": number[];
        "classCss"?: string;
        "icon"?: string;
        "iconstyle"?: string;
        "steps": string[];
    }
    interface DfnsTypography {
        "classCss"?: string;
        "color"?: ITypoColor;
        "typo": ITypo;
    }
    interface DfnsValidateWallet {
        "network": BlockchainNetwork;
        "shouldShowWalletValidation": boolean;
    }
    interface DfnsWalletOverview {
    }
    interface DfnsWalletValidation {
        "confirmationImgSrc": string;
    }
    interface DropDown {
        "closeAction"?: (close: () => void) => void;
        "onOpen"?: (open: boolean) => void;
    }
    interface DropDownContainer {
        "dropdownContent": { children: JSX.Element; title: string; content: JSX.Element }[];
    }
    interface ToggleSwitch {
        "checked": boolean;
        "label": string;
    }
}
export interface DfnsButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsButtonElement;
}
export interface DfnsCreateAccountCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsCreateAccountElement;
}
export interface DfnsCreatePasskeyCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsCreatePasskeyElement;
}
export interface DfnsInputFieldCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsInputFieldElement;
}
export interface DfnsLoginCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsLoginElement;
}
export interface DfnsRecoverySetupCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsRecoverySetupElement;
}
export interface DfnsSettingsCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsSettingsElement;
}
export interface DfnsSignMessageCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsSignMessageElement;
}
export interface DfnsValidateWalletCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsValidateWalletElement;
}
export interface DfnsWalletOverviewCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsWalletOverviewElement;
}
export interface DfnsWalletValidationCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLDfnsWalletValidationElement;
}
declare global {
    interface HTMLDfnsAlertElement extends Components.DfnsAlert, HTMLStencilElement {
    }
    var HTMLDfnsAlertElement: {
        prototype: HTMLDfnsAlertElement;
        new (): HTMLDfnsAlertElement;
    };
    interface HTMLDfnsButtonElement extends Components.DfnsButton, HTMLStencilElement {
    }
    var HTMLDfnsButtonElement: {
        prototype: HTMLDfnsButtonElement;
        new (): HTMLDfnsButtonElement;
    };
    interface HTMLDfnsCreateAccountElement extends Components.DfnsCreateAccount, HTMLStencilElement {
    }
    var HTMLDfnsCreateAccountElement: {
        prototype: HTMLDfnsCreateAccountElement;
        new (): HTMLDfnsCreateAccountElement;
    };
    interface HTMLDfnsCreatePasskeyElement extends Components.DfnsCreatePasskey, HTMLStencilElement {
    }
    var HTMLDfnsCreatePasskeyElement: {
        prototype: HTMLDfnsCreatePasskeyElement;
        new (): HTMLDfnsCreatePasskeyElement;
    };
    interface HTMLDfnsInputFieldElement extends Components.DfnsInputField, HTMLStencilElement {
    }
    var HTMLDfnsInputFieldElement: {
        prototype: HTMLDfnsInputFieldElement;
        new (): HTMLDfnsInputFieldElement;
    };
    interface HTMLDfnsLayoutElement extends Components.DfnsLayout, HTMLStencilElement {
    }
    var HTMLDfnsLayoutElement: {
        prototype: HTMLDfnsLayoutElement;
        new (): HTMLDfnsLayoutElement;
    };
    interface HTMLDfnsLoaderElement extends Components.DfnsLoader, HTMLStencilElement {
    }
    var HTMLDfnsLoaderElement: {
        prototype: HTMLDfnsLoaderElement;
        new (): HTMLDfnsLoaderElement;
    };
    interface HTMLDfnsLoginElement extends Components.DfnsLogin, HTMLStencilElement {
    }
    var HTMLDfnsLoginElement: {
        prototype: HTMLDfnsLoginElement;
        new (): HTMLDfnsLoginElement;
    };
    interface HTMLDfnsMainElement extends Components.DfnsMain, HTMLStencilElement {
    }
    var HTMLDfnsMainElement: {
        prototype: HTMLDfnsMainElement;
        new (): HTMLDfnsMainElement;
    };
    interface HTMLDfnsRecoverySetupElement extends Components.DfnsRecoverySetup, HTMLStencilElement {
    }
    var HTMLDfnsRecoverySetupElement: {
        prototype: HTMLDfnsRecoverySetupElement;
        new (): HTMLDfnsRecoverySetupElement;
    };
    interface HTMLDfnsSettingsElement extends Components.DfnsSettings, HTMLStencilElement {
    }
    var HTMLDfnsSettingsElement: {
        prototype: HTMLDfnsSettingsElement;
        new (): HTMLDfnsSettingsElement;
    };
    interface HTMLDfnsSignMessageElement extends Components.DfnsSignMessage, HTMLStencilElement {
    }
    var HTMLDfnsSignMessageElement: {
        prototype: HTMLDfnsSignMessageElement;
        new (): HTMLDfnsSignMessageElement;
    };
    interface HTMLDfnsStepperElement extends Components.DfnsStepper, HTMLStencilElement {
    }
    var HTMLDfnsStepperElement: {
        prototype: HTMLDfnsStepperElement;
        new (): HTMLDfnsStepperElement;
    };
    interface HTMLDfnsTypographyElement extends Components.DfnsTypography, HTMLStencilElement {
    }
    var HTMLDfnsTypographyElement: {
        prototype: HTMLDfnsTypographyElement;
        new (): HTMLDfnsTypographyElement;
    };
    interface HTMLDfnsValidateWalletElement extends Components.DfnsValidateWallet, HTMLStencilElement {
    }
    var HTMLDfnsValidateWalletElement: {
        prototype: HTMLDfnsValidateWalletElement;
        new (): HTMLDfnsValidateWalletElement;
    };
    interface HTMLDfnsWalletOverviewElement extends Components.DfnsWalletOverview, HTMLStencilElement {
    }
    var HTMLDfnsWalletOverviewElement: {
        prototype: HTMLDfnsWalletOverviewElement;
        new (): HTMLDfnsWalletOverviewElement;
    };
    interface HTMLDfnsWalletValidationElement extends Components.DfnsWalletValidation, HTMLStencilElement {
    }
    var HTMLDfnsWalletValidationElement: {
        prototype: HTMLDfnsWalletValidationElement;
        new (): HTMLDfnsWalletValidationElement;
    };
    interface HTMLDropDownElement extends Components.DropDown, HTMLStencilElement {
    }
    var HTMLDropDownElement: {
        prototype: HTMLDropDownElement;
        new (): HTMLDropDownElement;
    };
    interface HTMLDropDownContainerElement extends Components.DropDownContainer, HTMLStencilElement {
    }
    var HTMLDropDownContainerElement: {
        prototype: HTMLDropDownContainerElement;
        new (): HTMLDropDownContainerElement;
    };
    interface HTMLToggleSwitchElement extends Components.ToggleSwitch, HTMLStencilElement {
    }
    var HTMLToggleSwitchElement: {
        prototype: HTMLToggleSwitchElement;
        new (): HTMLToggleSwitchElement;
    };
    interface HTMLElementTagNameMap {
        "dfns-alert": HTMLDfnsAlertElement;
        "dfns-button": HTMLDfnsButtonElement;
        "dfns-create-account": HTMLDfnsCreateAccountElement;
        "dfns-create-passkey": HTMLDfnsCreatePasskeyElement;
        "dfns-input-field": HTMLDfnsInputFieldElement;
        "dfns-layout": HTMLDfnsLayoutElement;
        "dfns-loader": HTMLDfnsLoaderElement;
        "dfns-login": HTMLDfnsLoginElement;
        "dfns-main": HTMLDfnsMainElement;
        "dfns-recovery-setup": HTMLDfnsRecoverySetupElement;
        "dfns-settings": HTMLDfnsSettingsElement;
        "dfns-sign-message": HTMLDfnsSignMessageElement;
        "dfns-stepper": HTMLDfnsStepperElement;
        "dfns-typography": HTMLDfnsTypographyElement;
        "dfns-validate-wallet": HTMLDfnsValidateWalletElement;
        "dfns-wallet-overview": HTMLDfnsWalletOverviewElement;
        "dfns-wallet-validation": HTMLDfnsWalletValidationElement;
        "drop-down": HTMLDropDownElement;
        "drop-down-container": HTMLDropDownContainerElement;
        "toggle-switch": HTMLToggleSwitchElement;
    }
}
declare namespace LocalJSX {
    interface DfnsAlert {
        "classCss"?: string;
        "errorIconSrc"?: string;
        "hasTitle"?: boolean;
        "infoIconSrc"?: string;
        "variant"?: EAlertVariant;
        "warningIconSrc"?: string;
    }
    interface DfnsButton {
        "classCss"?: string;
        "content"?: string;
        "disabled"?: boolean;
        "fullwidth"?: boolean;
        "icon"?: JSX.Element;
        "iconposition"?: "left" | "right";
        "iconstyle"?: any;
        "isloading"?: boolean;
        "onButtonClick"?: (event: DfnsButtonCustomEvent<void>) => void;
        "onClick"?: () => any;
        "sizing"?: EButtonSize;
        "type"?: "button" | "submit";
        "variant"?: EButtonVariant;
    }
    interface DfnsCreateAccount {
        "authenticatorAttachment"?: AuthenticatorAttachment;
        "onPasskeyCreated"?: (event: DfnsCreateAccountCustomEvent<RegisterCompleteResponse>) => void;
    }
    interface DfnsCreatePasskey {
        "onAction"?: (event: DfnsCreatePasskeyCustomEvent<CreatePasskeyAction>) => void;
        "visible"?: string;
    }
    interface DfnsInputField {
        "disableErrors"?: boolean;
        "errors"?: string[];
        "fullWidth"?: boolean;
        "isReadOnly"?: boolean;
        "label"?: string;
        "leftElement"?: any;
        "onChange"?: (input: string) => void;
        "onInputChange"?: (event: DfnsInputFieldCustomEvent<string>) => void;
        "placeholder"?: string;
        "rightElement"?: any;
        "type"?: string;
        "value"?: string;
    }
    interface DfnsLayout {
        "bloomLogoSrc"?: string;
        "closeBtn"?: boolean;
        "crossIconSrc"?: string;
        "onClickCloseBtn"?: () => void;
    }
    interface DfnsLoader {
        "LoaderIconSrc"?: string;
        "classCss"?: string;
    }
    interface DfnsLogin {
        "authenticatorAttachment"?: AuthenticatorAttachment;
        "onPasskeyCreated"?: (event: DfnsLoginCustomEvent<RegisterCompleteResponse>) => void;
    }
    interface DfnsMain {
        "messageToSign"?: string;
        "network"?: BlockchainNetwork;
        "userCreationAuthenticatorAttachment"?: AuthenticatorAttachment;
    }
    interface DfnsRecoverySetup {
        "onAction"?: (event: DfnsRecoverySetupCustomEvent<CreatePasskeyAction>) => void;
        "visible"?: string;
    }
    interface DfnsSettings {
        "confirmationImgSrc"?: string;
        "onAction"?: (event: DfnsSettingsCustomEvent<SettingsAction>) => void;
    }
    interface DfnsSignMessage {
        "appId"?: string;
        "dfnsHost"?: string;
        "dfnsUserToken"?: string;
        "message"?: string;
        "onSignedMessage"?: (event: DfnsSignMessageCustomEvent<GetSignatureResponse>) => void;
        "rpId"?: string;
        "visible"?: string;
        "walletId"?: string;
    }
    interface DfnsStepper {
        "activeIndices"?: number[];
        "classCss"?: string;
        "icon"?: string;
        "iconstyle"?: string;
        "steps"?: string[];
    }
    interface DfnsTypography {
        "classCss"?: string;
        "color"?: ITypoColor;
        "typo"?: ITypo;
    }
    interface DfnsValidateWallet {
        "network"?: BlockchainNetwork;
        "onWalletValidated"?: (event: DfnsValidateWalletCustomEvent<Wallet>) => void;
        "shouldShowWalletValidation"?: boolean;
    }
    interface DfnsWalletOverview {
        "onAction"?: (event: DfnsWalletOverviewCustomEvent<WalletOverviewAction>) => void;
    }
    interface DfnsWalletValidation {
        "confirmationImgSrc"?: string;
        "onWalletValidated"?: (event: DfnsWalletValidationCustomEvent<Wallet>) => void;
    }
    interface DropDown {
        "closeAction"?: (close: () => void) => void;
        "onOpen"?: (open: boolean) => void;
    }
    interface DropDownContainer {
        "dropdownContent"?: { children: JSX.Element; title: string; content: JSX.Element }[];
    }
    interface ToggleSwitch {
        "checked"?: boolean;
        "label"?: string;
    }
    interface IntrinsicElements {
        "dfns-alert": DfnsAlert;
        "dfns-button": DfnsButton;
        "dfns-create-account": DfnsCreateAccount;
        "dfns-create-passkey": DfnsCreatePasskey;
        "dfns-input-field": DfnsInputField;
        "dfns-layout": DfnsLayout;
        "dfns-loader": DfnsLoader;
        "dfns-login": DfnsLogin;
        "dfns-main": DfnsMain;
        "dfns-recovery-setup": DfnsRecoverySetup;
        "dfns-settings": DfnsSettings;
        "dfns-sign-message": DfnsSignMessage;
        "dfns-stepper": DfnsStepper;
        "dfns-typography": DfnsTypography;
        "dfns-validate-wallet": DfnsValidateWallet;
        "dfns-wallet-overview": DfnsWalletOverview;
        "dfns-wallet-validation": DfnsWalletValidation;
        "drop-down": DropDown;
        "drop-down-container": DropDownContainer;
        "toggle-switch": ToggleSwitch;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "dfns-alert": LocalJSX.DfnsAlert & JSXBase.HTMLAttributes<HTMLDfnsAlertElement>;
            "dfns-button": LocalJSX.DfnsButton & JSXBase.HTMLAttributes<HTMLDfnsButtonElement>;
            "dfns-create-account": LocalJSX.DfnsCreateAccount & JSXBase.HTMLAttributes<HTMLDfnsCreateAccountElement>;
            "dfns-create-passkey": LocalJSX.DfnsCreatePasskey & JSXBase.HTMLAttributes<HTMLDfnsCreatePasskeyElement>;
            "dfns-input-field": LocalJSX.DfnsInputField & JSXBase.HTMLAttributes<HTMLDfnsInputFieldElement>;
            "dfns-layout": LocalJSX.DfnsLayout & JSXBase.HTMLAttributes<HTMLDfnsLayoutElement>;
            "dfns-loader": LocalJSX.DfnsLoader & JSXBase.HTMLAttributes<HTMLDfnsLoaderElement>;
            "dfns-login": LocalJSX.DfnsLogin & JSXBase.HTMLAttributes<HTMLDfnsLoginElement>;
            "dfns-main": LocalJSX.DfnsMain & JSXBase.HTMLAttributes<HTMLDfnsMainElement>;
            "dfns-recovery-setup": LocalJSX.DfnsRecoverySetup & JSXBase.HTMLAttributes<HTMLDfnsRecoverySetupElement>;
            "dfns-settings": LocalJSX.DfnsSettings & JSXBase.HTMLAttributes<HTMLDfnsSettingsElement>;
            "dfns-sign-message": LocalJSX.DfnsSignMessage & JSXBase.HTMLAttributes<HTMLDfnsSignMessageElement>;
            "dfns-stepper": LocalJSX.DfnsStepper & JSXBase.HTMLAttributes<HTMLDfnsStepperElement>;
            "dfns-typography": LocalJSX.DfnsTypography & JSXBase.HTMLAttributes<HTMLDfnsTypographyElement>;
            "dfns-validate-wallet": LocalJSX.DfnsValidateWallet & JSXBase.HTMLAttributes<HTMLDfnsValidateWalletElement>;
            "dfns-wallet-overview": LocalJSX.DfnsWalletOverview & JSXBase.HTMLAttributes<HTMLDfnsWalletOverviewElement>;
            "dfns-wallet-validation": LocalJSX.DfnsWalletValidation & JSXBase.HTMLAttributes<HTMLDfnsWalletValidationElement>;
            "drop-down": LocalJSX.DropDown & JSXBase.HTMLAttributes<HTMLDropDownElement>;
            "drop-down-container": LocalJSX.DropDownContainer & JSXBase.HTMLAttributes<HTMLDropDownContainerElement>;
            "toggle-switch": LocalJSX.ToggleSwitch & JSXBase.HTMLAttributes<HTMLToggleSwitchElement>;
        }
    }
}
