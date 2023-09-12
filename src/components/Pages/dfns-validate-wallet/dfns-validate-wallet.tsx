import { BlockchainNetwork, Wallet } from "@dfns/sdk/codegen/datamodel/Wallets";
import { Component, Event, EventEmitter, Prop, State, h } from "@stencil/core";
import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";
import { waitForWalletActive } from "../../../utils/dfns";
import { EButtonSize, EButtonVariant } from "../../../utils/enums/buttons-enums";
import { ITypo, ITypoColor } from "../../../utils/enums/typography-enums";
import { createWallet } from "../../../utils/helper";

@Component({
	tag: "dfns-validate-wallet",
	styleUrl: "dfns-validate-wallet.scss",
	shadow: true,
})
export class DfnsValidateWallet {
	@Prop() network: BlockchainNetwork;
	@Prop() shouldShowWalletValidation: boolean;
	@Event() walletValidated: EventEmitter<Wallet>;
	@State() isLoading: boolean = false;

	async validateWallet() {
		try {
			this.isLoading = true;
			let wallet = await createWallet(
				dfnsStore.state.dfnsHost,
				dfnsStore.state.appId,
				dfnsStore.state.rpId,
				dfnsStore.state.dfnsUserToken,
				this.network,
			);
			if (!this.shouldShowWalletValidation) {
				wallet = await waitForWalletActive(
					dfnsStore.state.dfnsHost,
					dfnsStore.state.appId,
					dfnsStore.state.dfnsUserToken,
					wallet.id,
				);
			}
			this.isLoading = false;
			this.walletValidated.emit(wallet);
			return wallet;
		} catch (err) {
			this.isLoading = false;
		}
	}

	async closeBtn() {
		this.walletValidated.emit(null);
	}

	render() {
		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.create_wallet}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<dfns-stepper
						steps={[
							langState.values.pages.identification.title,
							langState.values.pages.create_account.title,
							langState.values.pages.validate_wallet.title,
						]}
						activeIndices={[0, 1]}
					/>
					<div class="contentContainer">
						<div class="title">
							<dfns-typography typo={ITypo.TEXTE_LG_SEMIBOLD}>
								{langState.values.pages.validate_wallet.description}
							</dfns-typography>
						</div>
						{/* <div class="content">
								<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
								{langState.values.pages.validate_wallet.description}
								</dfns-typography>
							</div> */}
					</div>
				</div>
				<div slot="bottomSection">
					<dfns-button
						content={langState.values.pages.validate_wallet.button_validate}
						variant={EButtonVariant.PRIMARY}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						iconposition="left"
						onClick={this.validateWallet.bind(this)}
						isloading={this.isLoading}
					/>
				</div>
			</dfns-layout>
		);
	}
}
