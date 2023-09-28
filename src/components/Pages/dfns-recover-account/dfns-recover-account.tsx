import { Component, Fragment, JSX, State, h, Event, EventEmitter } from "@stencil/core";
import { CreatePasskeyAction } from "../../../common/enums/actions-enum";
import router from "../../../stores/RouterStore";
import dfnsStore from "../../../stores/DfnsStore";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import langState from "../../../stores/LanguageStore";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";
import { CopyClipboard } from "../../Elements/CopyClipboard";


@Component({
	tag: "dfns-recover-account",
	styleUrl: "dfns-recover-account.scss",
	shadow: true,
})
export class DfnsRecoverAccount {
	@State() isLoading: boolean = false;
	@State() step = 4;
	@State() passkeyName?: string;
	@Event() action: EventEmitter<CreatePasskeyAction>;

	handleBackClick() {
		router.goBack();
	}

	render() {
		const iconCopy: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
				<path
					d="M7 3.5C7 2.67157 7.67157 2 8.5 2H12.3787C12.7765 2 13.158 2.15804 13.4393 2.43934L16.5607 5.56066C16.842 5.84197 17 6.2235 17 6.62132V12.5C17 13.3284 16.3284 14 15.5 14H14.5V10.6213C14.5 9.82567 14.1839 9.06261 13.6213 8.5L10.5 5.37868C9.93739 4.81607 9.17433 4.5 8.37868 4.5H7V3.5Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
				<path
					d="M4.5 6C3.67157 6 3 6.67157 3 7.5V16.5C3 17.3284 3.67157 18 4.5 18H11.5C12.3284 18 13 17.3284 13 16.5V10.6213C13 10.2235 12.842 9.84197 12.5607 9.56066L9.43934 6.43934C9.15804 6.15804 8.7765 6 8.37868 6H4.5Z"
					fill={dfnsStore.state.theme.includes("dark") ? "#D1D5DB" : "#50565E"}
				/>
			</svg>
		);
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
			<dfns-layout closeBtn onClickCloseBtn={() => this.action.emit(CreatePasskeyAction.CLOSE)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						{langState.values.header.recover_account}
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="content-container">
						{this.step === 1 && (
							<Fragment>
								<div class="title">
									<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
										{langState.values.pages.recover_account.title}
									</dfns-typography>
								</div>
								<div class="container">
									<dfns-button
										content={langState.values.buttons.next}
										variant={EButtonVariant.PRIMARY}
										sizing={EButtonSize.MEDIUM}
										fullwidth
										onClick={() => {}}
									/>
									<dfns-button
										content={langState.values.buttons.back}
										variant={EButtonVariant.NEUTRAL}
										sizing={EButtonSize.MEDIUM}
										fullwidth
										iconposition="left"
										onClick={() => this.handleBackClick()}
									/>
								</div>
							</Fragment>
						)}

						{this.step === 2 && (
							<Fragment>
								<div class="container">
									<div class="title">
										<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
											{langState.values.pages.recover_account.title_step_2}
										</dfns-typography>
									</div>
									<div class="description">
										<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
											{langState.values.pages.recover_account.description_step_2}
										</dfns-typography>
									</div>
								</div>
								<div class="container-textfields">
									<div class="wrapper-input">
										<div class="input-field">
											<dfns-input-field
												placeholder={"D1-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX"}
												onChange={(value) => {}}
												isPasswordVisible={false}>
												<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM} color={ITypoColor.PRIMARY}>
													{langState.values.pages.recovery_setup.recovery_code}
												</dfns-typography>
											</dfns-input-field>
										</div>
										<div class="copy-icon">
											<CopyClipboard value={""} openToaster={true}>
												{iconCopy}
											</CopyClipboard>
										</div>
									</div>
									<div class="wrapper-input">
										<div class="input-field">
											<dfns-input-field
												placeholder={"234-738-293"}
												onChange={(value) => {}}
												errors={[]}
												isPasswordVisible={false}>
												<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM} color={ITypoColor.PRIMARY}>
													{langState.values.pages.recovery_setup.recovery_key}
												</dfns-typography>
											</dfns-input-field>
										</div>
										<div class="copy-icon">
											<CopyClipboard value={""} openToaster={true}>
												{iconCopy}
											</CopyClipboard>
										</div>
									</div>
								</div>
							</Fragment>
						)}
						{this.step === 3 && (
							<Fragment>
								<div class="container">
									<div class="title">
										<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
											{langState.values.pages.recover_account.title_step_3}
										</dfns-typography>
									</div>
									<div class="description">
										<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.SECONDARY}>
											{langState.values.pages.recover_account.description_step_3}
										</dfns-typography>
									</div>
								</div>
							</Fragment>
						)}
						{this.step === 4 && (
							<Fragment>
								<div class="container-confirmation">
									{confirmationImgSrc}
									<div class="title">
										<dfns-typography typo={ITypo.H6_TITLE} color={ITypoColor.PRIMARY}>
											{langState.values.pages.recover_account.title_step_4}
										</dfns-typography>
									</div>
									<div class="content">
										<dfns-typography typo={ITypo.TEXTE_MD_REGULAR} color={ITypoColor.SECONDARY}>
											{langState.values.pages.recover_account.description_step_4}
										</dfns-typography>
									</div>
								</div>
							</Fragment>
						)}
					</div>
				</div>
				<div slot="bottomSection">
					{this.step === 2 && (
						<Fragment>
							<dfns-button
								content={langState.values.buttons.verify}
								variant={EButtonVariant.PRIMARY}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								onClick={() => {}}
							/>
							<dfns-button
								content={langState.values.buttons.back}
								variant={EButtonVariant.NEUTRAL}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								iconposition="left"
								onClick={() => this.handleBackClick()}
							/>
						</Fragment>
					)}
					{this.step === 3 && (
						<Fragment>
							<dfns-button
								content={langState.values.pages.recover_account.button_create_passkey}
								variant={EButtonVariant.PRIMARY}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								onClick={() => {}}
							/>
							<dfns-button
								content={langState.values.buttons.back}
								variant={EButtonVariant.NEUTRAL}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								iconposition="left"
								onClick={() => this.handleBackClick()}
							/>
						</Fragment>
					)}
					{this.step === 4 && (
						<Fragment>
							<dfns-button
								content={langState.values.buttons.next}
								variant={EButtonVariant.PRIMARY}
								sizing={EButtonSize.MEDIUM}
								fullwidth
								onClick={() => {}}
							/>
						</Fragment>
					)}
				</div>
			</dfns-layout>
		);
	}
}
