import { Component, EventEmitter, Event, JSX, Prop, h, Fragment } from "@stencil/core";
import classNames from "classnames";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { ITypo } from "../../utils/enums/typography-enums";

@Component({
	tag: "dfns-button",
	styleUrl: "dfns-button.scss",
})
export class DfnsButton {
	@Prop({ mutable: true }) variant: EButtonVariant = EButtonVariant.PRIMARY;
	@Prop({ mutable: true }) sizing: EButtonSize = EButtonSize.LARGE;
  @Prop({ mutable: true }) content: string;
	@Prop() disabled = false;
	@Prop() type: "button" | "submit" = "button";
	@Prop() isloading = false;
	@Prop() fullwidth = false;
	@Prop() iconposition: "left" | "right" = "right";
	@Prop() icon?: JSX.Element;
	@Prop() iconstyle?: any;
	@Prop() classCss?: string;

	@Event() buttonClick: EventEmitter<void>;

	private get fullwidthattr(): string {
		return this.fullwidth.toString();
	}

	componentWillLoad() {
		if (!this.variant) {
			this.variant = EButtonVariant.PRIMARY; // Set default variant value if not provided
		}

		if (!this.sizing) {
			this.sizing = EButtonSize.LARGE; // Set default sizing value if not provided
		}
	}

	private handleClick = () => {
		if (!this.disabled && !this.isloading) {
			this.buttonClick.emit(); // Emit the custom event when the button is clicked
		}
	};

	private formatWithTypo(): JSX.Element | null {
		switch (this.sizing) {
			case EButtonSize.SMALL:
				return (
					<dfns-typography typo={ITypo.TEXTE_SM_MEDIUM}>
						{this.content}
					</dfns-typography>
				);
			case EButtonSize.MEDIUM:
				return (
					<dfns-typography typo={ITypo.TEXTE_MD_MEDIUM}>
						{this.content}
					</dfns-typography>
				);
			case EButtonSize.LARGE:
				return (
					<dfns-typography typo={ITypo.TEXTE_LG_MEDIUM}>
						{this.content}
					</dfns-typography>
				);
			default:
				return null;
		}
	}

	render() {
    const attributes = {
      variant: this.variant,
      sizing: this.sizing,
      disabled: this.disabled,
      type: this.type,
      fullwidthattr: this.fullwidthattr,
      class: classNames("root", this.classCss),
    };
  
    return (
      <button onClick={this.handleClick.bind(this)} {...attributes} class={classNames("root", this.classCss)} type={this.type}>
        <Fragment>
          {this.isloading ? <dfns-loader /> : null}
          {!this.isloading && this.icon && this.iconposition === "left" ? <div class="icon">{this.icon}</div> : null}
          {!this.isloading ? this.formatWithTypo() : null}
          {!this.isloading && this.icon && this.iconposition === "right" ? <div class="icon">{this.icon}</div> : null}
        </Fragment>
      </button>
    );
  }
}
