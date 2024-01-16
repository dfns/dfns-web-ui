import * as yup from "yup";


export const recoveryDelegatedSchema = yup
	.object()
	.shape({
		oAuthToken: yup.string().required(),
		credentialId: yup.string().required()
	})
	.noUnknown();


