import { Component, JSX, h } from "@stencil/core";
import { ITypo, ITypoColor } from "../../utils/enums/typography-enums";
import { EAlertVariant } from "../../utils/enums/alerts-enums";
import { EButtonSize, EButtonVariant } from "../../utils/enums/buttons-enums";
import { EThemeModeType } from "../../utils/enums/themes-enums";
import { ThemeMode } from "../../utils/theme-modes";

@Component({
	tag: "my-component",
	styleUrl: "my-component.scss",
	shadow: true,
})
export class MyComponent {
	private themeMode = ThemeMode.getInstance();

	componentWillLoad() {
		// Manually set the theme mode to DARK or LIGHT as desired
		this.themeMode.switch(EThemeModeType.ACCOR); // Replace EThemeModeType.DARK with EThemeModeType.LIGHT if you want to set it to light mode
	}

	render() {
		const icon: JSX.Element = (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
				<path
					fill-rule="evenodd"
					d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
					clip-rule="evenodd"
				/>
			</svg>
		);
		return (
			<div>
				<dfns-layout closeBtn>
					<div slot="topSection">
						<dfns-typography typo={ITypo.H6_TITLE} color={ITypoColor.PRIMARY} class="custom-class">
							Top Section Content
						</dfns-typography>
					</div>
					<div slot="contentSection">
						<dfns-stepper steps={["Identification", "Create passkey", "Validate wallet"]} activeIndices={[0]}></dfns-stepper>
						<dfns-alert variant={EAlertVariant.ERROR} icon="!" iconstyle={{ color: "red" }}>
							generate text with lorem ipsum generator. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
							ullamcorper, odio sed aliquam ultrices, diam diam ultricies lorem, eget ultricies diam diam ut nisl. Sed
							consectetur, nisl eget aliquam ultrices, diam diam ultricies lorem, eget ultricies diam diam ut nisl. Sed
						</dfns-alert>
					</div>
					<div slot="bottomSection">
						<dfns-button
							content="Validate wallet"
							variant={EButtonVariant.PRIMARY}
							sizing={EButtonSize.LARGE}
							fullwidth
							icon={icon}
							iconposition="left"
						/>
					</div>
				</dfns-layout>
			</div>
		);
	}
}
