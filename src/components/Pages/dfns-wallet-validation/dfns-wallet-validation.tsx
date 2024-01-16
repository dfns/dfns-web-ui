
import { Component, Event, EventEmitter, JSX, Prop, State, h } from "@stencil/core";
import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import { waitForWalletActive } from "../../../utils/dfns";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";
import { WalletDisconnectedError, isTokenExpiredError } from "../../../utils/errors";
import { disconnectWallet } from "../../../utils/helper";
import router, { RouteType } from "../../../stores/RouterStore";
import { Wallet } from "../../../services/LocalStorageService";

@Component({
	tag: "dfns-wallet-validation",
	styleUrl: "dfns-wallet-validation.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsWalletValidation {
	@Event() walletValidated: EventEmitter<Wallet>;
	@Prop() confirmationImgSrc = "https://storage.googleapis.com/dfns-frame-stg/assets/icons/confirmation.svg";
	@State() isLoading = true;

	async componentDidLoad() {
		try {
			this.isLoading = true;
			dfnsStore.setValue(
				"wallet",
				await waitForWalletActive(
					dfnsStore.state.apiUrl,
					dfnsStore.state.dfnsHost,
					dfnsStore.state.appId,
					dfnsStore.state.dfnsUserToken,
					dfnsStore.state.wallet ? dfnsStore.state.wallet.id : null,
				),
			);
			this.isLoading = false;
		} catch (error) {
			this.isLoading = false;

			if (isTokenExpiredError(error)) {
				disconnectWallet();
				throw new WalletDisconnectedError();
			}
			this.walletValidated.emit(dfnsStore.state.wallet);
			throw error;
		}
	}

	async validateWallet() {
		this.walletValidated.emit(dfnsStore.state.wallet);
		setTimeout(() => {
			if (dfnsStore.state.showRecoverySetupAtWalletCreation) {
				router.navigate(RouteType.RECOVERY_SETUP);
			}
		}, 500);
	}

	async closeBtn() {
		this.walletValidated.emit(null);
	}

	render() {
		const confirmationImgSrc: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M4.5 24C4.5 13.2304 13.2304 4.5 24 4.5C34.7696 4.5 43.5 13.2304 43.5 24C43.5 34.7696 34.7696 43.5 24 43.5C13.2304 43.5 4.5 34.7696 4.5 24ZM31.2206 20.3719C31.7021 19.6977 31.546 18.7609 30.8719 18.2794C30.1977 17.7979 29.2609 17.954 28.7794 18.6281L22.3086 27.6873L19.0607 24.4393C18.4749 23.8536 17.5251 23.8536 16.9393 24.4393C16.3536 25.0251 16.3536 25.9749 16.9393 26.5607L21.4393 31.0607C21.7511 31.3724 22.1843 31.5313 22.6237 31.4949C23.0631 31.4585 23.4643 31.2307 23.7206 30.8719L31.2206 20.3719Z"
					fill={dfnsStore.state.colors.primary_500}
				/>
			</svg>
		);

		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.create_wallet}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="contentContainer">
						{confirmationImgSrc}
						<div class="title">
							<dfns-typography typo={ITypo.H6_TITLE} color={ITypoColor.PRIMARY}>
								{langState.values.pages.validation_success.title}
							</dfns-typography>
						</div>
						<div class="content">
							<dfns-typography typo={ITypo.TEXTE_MD_REGULAR} color={ITypoColor.SECONDARY}>
								{langState.values.pages.validation_success.description}
							</dfns-typography>
						</div>
						{this.isLoading ? (
							<div class="loading-wallet">
								<dfns-loader size="small" />
								<dfns-typography typo={ITypo.TEXTE_XS_REGULAR} color={ITypoColor.SECONDARY}>
									{langState.values.pages.validation_success.loading_message}
								</dfns-typography>
							</div>
						) : (
							<div class="wallet">
								<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
									{langState.values.pages.validation_success.wallet_address}
								</dfns-typography>
								<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM} color={ITypoColor.PRIMARY}>
									{dfnsStore.state.wallet?.address}
								</dfns-typography>
							</div>
						)}
					</div>
				</div>
				<div slot="bottomSection">
					<dfns-button
						content={langState.values.buttons.done}
						variant={EButtonVariant.PRIMARY}
						sizing={EButtonSize.MEDIUM}
						disabled={dfnsStore.state.wallet?.status !== "Active"}
						fullwidth
						iconposition="left"
						onClick={this.validateWallet.bind(this)}
					/>
				</div>
			</dfns-layout>
		);
	}
}
