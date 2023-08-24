import { CredentialStore, Fido2Attestation, UserRegistrationChallenge } from "@dfns/sdk/store";
import { AllowCredential, CredentialSigner, Fido2Assertion } from "@dfns/sdk/signer";
import { fromBase64Url, toBase64Url } from "@dfns/sdk/utils/base64";
import { Buffer } from "buffer";

export const DEFAULT_WAIT_TIMEOUT = 60000;

export class WebAuthn implements CredentialSigner<Fido2Assertion>, CredentialStore<Fido2Attestation> {
	constructor(
		private options: {
			rpId: string;
			timeout?: number;
		},
	) {}

	async sign(challenge: string, allowCredentials: { key: AllowCredential[]; webauthn: AllowCredential[] }): Promise<Fido2Assertion> {
		const credential = (await navigator.credentials.get({
			mediation: "required",
			publicKey: {
				challenge: Buffer.from(challenge),
				allowCredentials: allowCredentials.webauthn.map(({ id, type, transports }) => ({
					id: fromBase64Url(id),
					type,
					transports: transports ?? [],
				})),
				rpId: this.options.rpId,
				userVerification: "required",
				timeout: this.options.timeout ?? DEFAULT_WAIT_TIMEOUT,
			},
		})) as PublicKeyCredential | null;

		if (!credential) {
			throw new Error("Failed to sign with WebAuthn credential");
		}

		const assertion = <AuthenticatorAssertionResponse>credential.response;

		return {
			kind: "Fido2",
			credentialAssertion: {
				credId: credential.id,
				clientData: toBase64Url(Buffer.from(assertion.clientDataJSON)),
				authenticatorData: toBase64Url(Buffer.from(assertion.authenticatorData)),
				signature: toBase64Url(Buffer.from(assertion.signature)),
				userHandle: assertion.userHandle ? toBase64Url(Buffer.from(assertion.userHandle)) : "",
			},
		};
	}

	async create(challenge: UserRegistrationChallenge): Promise<Fido2Attestation> {
		const options: CredentialCreationOptions = {
			publicKey: {
				challenge: Buffer.from(challenge.challenge),
				pubKeyCredParams: challenge.pubKeyCredParams,
				rp: challenge.rp,
				user: {
					displayName: challenge.user.displayName,
					id: Buffer.from(challenge.user.id),
					name: challenge.user.name,
				},
				attestation: challenge.attestation,
				excludeCredentials: challenge.excludeCredentials.map((cred) => ({
					id: fromBase64Url(cred.id),
					type: cred.type,
				})),
				authenticatorSelection: { ...challenge.authenticatorSelection, authenticatorAttachment: "platform" },
				timeout: this.options.timeout ?? DEFAULT_WAIT_TIMEOUT,
			},
		};

		const response = await navigator.credentials.create(options);

		if (response === null) {
			throw Error(`Failed to create and sign with WebAuthn credential`);
		}

		const credential = response as PublicKeyCredential;
		const attestation = <AuthenticatorAttestationResponse>credential.response;

		return {
			credentialKind: "Fido2",
			credentialInfo: {
				credId: credential.id,
				attestationData: toBase64Url(Buffer.from(attestation.attestationObject)),
				clientData: toBase64Url(Buffer.from(attestation.clientDataJSON)),
			},
		};
	}
}
