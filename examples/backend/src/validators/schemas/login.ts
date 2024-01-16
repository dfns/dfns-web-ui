import { FirstFactorAttestation } from "@dfns/sdk";
import * as yup from "yup";

export const loginInitSchema = yup
	.object()
	.shape({
		oAuthToken: yup.string().required(),
	})
	.noUnknown();

export const loginDelegatedSchema = yup
	.object()
	.shape({
		oAuthToken: yup.string().required(),
	})
	.noUnknown();

export const loginCompleteSchema = yup
	.object()
	.shape({
		challengeIdentifier: yup.string().required(),
		firstFactor: yup.mixed((input): input is FirstFactorAttestation => input).defined().required(),
	})
	.noUnknown();
