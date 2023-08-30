import { Component, Event, EventEmitter, Prop, State, h } from "@stencil/core";

import { EButtonSize, EButtonVariant } from "../../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../../utils/enums/themes-enums";
import { ITypo, ITypoColor } from "../../../utils/enums/typography-enums";
import { registerWithOAuth } from "../../../utils/helper";
import { ThemeMode } from "../../../utils/theme-modes";
import { RegisterCompleteResponse } from "../../../services/api/Register";
import langState from "../../../services/store/language-store";

@Component({
	tag: "dfns-create-account",
	styleUrl: "dfns-create-account.scss",
	shadow: true,
})
export class DfnsCreateAccount {
	private themeMode = ThemeMode.getInstance();

	@Prop() apiUrl: string;
	@Prop() appId: string;
	@Prop() authenticatorAttachment: AuthenticatorAttachment;
	@Prop() oauthAccessToken: string;
	@Prop() visible: string;
	@Event() passkeyCreated: EventEmitter<RegisterCompleteResponse>;
	@State() isLoading: boolean = false;

	componentWillLoad() {
		this.themeMode.switch(EThemeModeType.ACCOR);
	}

	async createPasskey() {
		try {
			this.isLoading = true;
			const response = await registerWithOAuth(this.apiUrl, this.appId, this.oauthAccessToken, this.authenticatorAttachment);
			this.isLoading = false;
			this.passkeyCreated.emit(response);
			return response;
		} catch (error) {
			this.isLoading = false;
		}
	}

	async closeBtn() {
		this.passkeyCreated.emit(null);
	}

	render() {
		return (
			<div class={this.visible ? "container visible" : "container"}>
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
							activeIndices={[0]}
						/>
						<div class="contentContainer">
							<div class="title">
								<dfns-typography typo={ITypo.TEXTE_LG_SEMIBOLD}>
									{langState.values.pages.create_account.description}
								</dfns-typography>
							</div>
							{/* <div class="content">
									<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
										{langState.values.pages.create_account.description}
									</dfns-typography>
								</div> */}
						</div>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content={langState.values.pages.create_account.button_create}
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.MEDIUM}
							fullwidth
							iconposition="left"
							onClick={this.createPasskey.bind(this)}
							isloading={this.isLoading}
						/>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
