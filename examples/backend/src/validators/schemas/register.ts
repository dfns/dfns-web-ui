import { FirstFactorAttestation } from "@dfns/sdk";
import * as yup from "yup";

export const registerInitSchema = yup
	.object()
	.shape({
		oAuthToken: yup.string().required(),
	})
	.noUnknown();

export const registerCompleteSchema = yup
	.object()
	.shape({
		tempAuthToken: yup.string().required(),
		signedChallenge: yup
			.object()
			.shape({
				firstFactorCredential: yup.mixed((input): input is FirstFactorAttestation => input).required(),
				secondFactorCredential: yup.mixed(),
				recoveryCredential: yup.mixed(),
			})
			.required(),
	})
	.noUnknown();
