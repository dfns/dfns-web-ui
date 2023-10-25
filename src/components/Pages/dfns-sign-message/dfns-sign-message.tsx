import { Component, Event, EventEmitter, JSX, Prop, State, h } from "@stencil/core";

import dfnsStore from "../../../stores/DfnsStore";
import langState from "../../../stores/LanguageStore";

import { signMessage } from "../../../utils/dfns";
import { ITypo, ITypoColor } from "../../../common/enums/typography-enums";
import { EButtonSize, EButtonVariant } from "../../../common/enums/buttons-enums";
import { EAlertVariant } from "../../../common/enums/alerts-enums";
import { WalletDisconnectedError, isTokenExpiredError } from "../../../utils/errors";
import { disconnectWallet } from "../../../utils/helper";

@Component({
	tag: "dfns-sign-message",
	styleUrl: "dfns-sign-message.scss",
	assetsDirs: ["assets"],
	shadow: true,
})
export class DfnsSignMessage {
	@Prop() message: string;
	@Event() signedMessage: EventEmitter<string>;
	@State() hasErrors: boolean = false;
	@State() errorMessage: string = "";
	@State() isLoading: boolean = false;

	async signMessage() {
		try {
			this.isLoading = true;
			const signedMessage = await signMessage(
				dfnsStore.state.apiUrl,
				dfnsStore.state.dfnsHost,
				dfnsStore.state.appId,
				dfnsStore.state.rpId,
				dfnsStore.state.dfnsUserToken,
				dfnsStore.state.wallet.id,
				this.message,
			);
			this.isLoading = false;

			if (signedMessage.status !== "Signed") {
				this.handleError(signedMessage.reason);
				return;
			}

			this.hasErrors = false;
			this.errorMessage = "";
			this.signedMessage.emit(signedMessage.signature.encoded);
		} catch (error) {
			this.handleError(error);
		}
	}

	private handleError(error: any) {
		this.isLoading = false;
		this.hasErrors = true;

		if (isTokenExpiredError(error)) {
			disconnectWallet();
			this.signedMessage.emit(null);
			throw new WalletDisconnectedError();
		}

		if (typeof error === "string") {
			this.errorMessage = error;
		} else if (error instanceof Error) {
			this.errorMessage = error.message;
		} else {
			this.errorMessage = "An unknown error occurred.";
		}
	}

	async closeBtn() {
		this.signedMessage.emit(null);
	}

	render() {
		const iconRety: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M15.3125 11.4236C14.5263 14.3576 11.5104 16.0988 8.57636 15.3127C7.60734 15.053 6.7703 14.5514 6.11058 13.8904L5.79904 13.5789L8.23227 13.5785C8.64649 13.5784 8.98221 13.2425 8.98214 12.8283C8.98206 12.4141 8.64622 12.0784 8.232 12.0785L3.98857 12.0792C3.78965 12.0792 3.5989 12.1583 3.45827 12.299C3.31764 12.4397 3.23866 12.6305 3.23871 12.8294L3.2396 17.0712C3.23968 17.4854 3.57554 17.8211 3.98975 17.821C4.40397 17.821 4.73968 17.4851 4.7396 17.0709L4.73909 14.6403L5.04894 14.9501C5.88997 15.7926 6.95765 16.4318 8.18814 16.7615C11.9224 17.7621 15.7608 15.5461 16.7613 11.8118C16.8686 11.4117 16.6311 11.0005 16.231 10.8932C15.8309 10.786 15.4197 11.0235 15.3125 11.4236ZM16.5414 7.70119C16.682 7.56051 16.761 7.36971 16.761 7.17078L16.7603 2.92883C16.7602 2.51462 16.4244 2.17889 16.0102 2.17896C15.596 2.17902 15.2602 2.51487 15.2603 2.92908L15.2607 5.35995L14.9509 5.05013C14.1099 4.20771 13.042 3.56827 11.8116 3.23859C8.07734 2.238 4.23898 4.45407 3.23839 8.18834C3.13118 8.58844 3.36862 8.99969 3.76872 9.1069C4.16882 9.2141 4.58007 8.97667 4.68728 8.57657C5.47346 5.6425 8.48931 3.9013 11.4234 4.68748C12.3924 4.94714 13.2295 5.44881 13.8892 6.10979L14.2003 6.4209L11.7684 6.4209C11.3542 6.4209 11.0184 6.75669 11.0184 7.1709C11.0184 7.58512 11.3542 7.9209 11.7684 7.9209H16.011C16.2099 7.9209 16.4007 7.84187 16.5414 7.70119Z"
					fill="#FAFAFA"
				/>
			</svg>
		);

		return (
			<dfns-layout closeBtn onClickCloseBtn={this.closeBtn.bind(this)}>
				<div slot="topSection">
					<dfns-typography typo={ITypo.H5_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
						Signature request
					</dfns-typography>
				</div>
				<div slot="contentSection">
					<div class="contentContainer">
						<div class="title">
							{/* <dfns-button
								content={document.location.hostname}
								variant={EButtonVariant.SECONDARY}
								sizing={EButtonSize.SMALL}
								fullwidth
								iconUrl={dfnsStore.state.appLogoUrl}
								iconposition="left"
							/> */}
						</div>
						<div class="content">
							<dfns-typography typo={ITypo.TEXTE_SM_SEMIBOLD} color={ITypoColor.PRIMARY}>
								{langState.values.pages.signature_request.title}
							</dfns-typography>
							<div class="textarea">
								<div class="sub-container">
									<dfns-typography typo={ITypo.TEXTE_SM_REGULAR} color={ITypoColor.PRIMARY} class="custom-class">
										{this.message}
									</dfns-typography>
								</div>
							</div>

							<dfns-alert variant={EAlertVariant.WARNING}>
								<div slot="content">{langState.values.pages.signature_request.warning_content}</div>
							</dfns-alert>
							{this.hasErrors && (
								<dfns-alert variant={EAlertVariant.ERROR} hasTitle={true}>
									<div slot="title">{langState.values.pages.signature_request.error_title}</div>
									<div slot="content">{this.errorMessage}</div>
								</dfns-alert>
							)}
						</div>
					</div>
				</div>
				<div slot="bottomSection">
					<dfns-button
						content={
							this.hasErrors
								? langState.values.pages.signature_request.button_retry
								: langState.values.pages.signature_request.button_signing
						}
						variant={EButtonVariant.PRIMARY}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						icon={this.hasErrors ? iconRety : undefined}
						iconposition="left"
						onClick={this.signMessage.bind(this)}
						isloading={this.isLoading}
					/>
					<dfns-button
						content={langState.values.pages.signature_request.button_reject}
						variant={EButtonVariant.SECONDARY}
						sizing={EButtonSize.MEDIUM}
						fullwidth
						onClick={this.closeBtn.bind(this)}
					/>
				</div>
			</dfns-layout>
		);
	}
}
