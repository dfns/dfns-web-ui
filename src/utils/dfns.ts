import { DfnsApiClient, DfnsDelegatedApiClient, Fido2Attestation, UserActionChallengeResponse, UserRegistrationChallenge } from "@dfns/sdk";
import { DeactivateCredentialRequest, ListUserCredentialsResponse } from "@dfns/sdk/codegen/Auth";
import {
	CredentialInfo,
	CredentialKind,
	Fido2Options,
	PublicKeyOptions,
	RecoverUserInput,
	RegistrationConfirmationFido2,
	UserRecoveryChallenge,
} from "@dfns/sdk/codegen/datamodel/Auth";
import {
	BlockchainNetwork,
	SignatureKind,
	SignatureStatus,
	TransactionStatus,
	TransferKind,
	TransferStatus,
	WalletStatus,
} from "@dfns/sdk/codegen/datamodel/Wallets";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { ITokenInfo } from "../common/interfaces/ITokenInfo";
import LocalStorageService, { DFNS_END_USER_TOKEN, OAUTH_ACCESS_TOKEN, Wallet, WalletAsset } from "../services/LocalStorageService";
import Login from "../services/api/Login";
import Recover from "../services/api/Recover";
import Register from "../services/api/Register";
import dfnsStore from "../stores/DfnsStore";
import { arrayBufferToBase64UrlString, base64url } from "./base64url";
import { DfnsError, DfnsHttpError, TokenExpiredError, isDfnsError } from "./errors";
import { generateRecoveryKeyCredential, generateSignature, getDefaultTransports, getDfnsUsernameFromUserToken } from "./helper";
import { create, sign } from "./webauthn";
import { BroadcastTransactionRequest, CreateWalletRequest, GenerateSignatureRequest, GetSignatureResponse, TransferAssetRequest } from "@dfns/sdk/generated/wallets";

export function isDfnsHttpError(err: unknown): err is DfnsHttpError {
	if (hasErrorProperty(err)) {
		if (typeof err.error === "object") {
			if (
				"name" in err.error &&
				"errorName" in err.error &&
				"serviceName" in err.error &&
				"message" in err.error &&
				"causes" in err.error &&
				"shouldTriggerInvestigation" in err.error
			) {
				return true;
			}
			if ("id" in err.error) {
				return true;
			}
		}
	}
	return false;
}

function hasErrorProperty(err: unknown): err is { error: unknown } {
	return typeof err === "object" && "error" in err;
}

export const getDfnsDelegatedClient = (dfnsHost: string, appId: string, dnfsUserToken: string) =>
	new DfnsDelegatedApiClient({
		appId: appId,
		baseUrl: dfnsHost,
		authToken: dnfsUserToken,
	});

export function timeout(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loginWithOAuth(apiUrl: string, appId: string, rpId: string, oauthAccessToken: string) {
	try {
		let challenge: UserActionChallengeResponse;
		challenge = await Login.getInstance(apiUrl, appId).init(oauthAccessToken);
		const defaultTransports = getDefaultTransports();

		const assertion = await sign(rpId, challenge!.challenge, challenge!.allowCredentials, defaultTransports);

		return Login.getInstance(apiUrl, appId).complete({
			challengeIdentifier: challenge!.challengeIdentifier,
			firstFactor: assertion,
		});
	} catch (err: any) {
		throw isDfnsError(err) ? new DfnsError(err.httpStatus, err.context) : err;
	}
}

export async function registerWithOAuth(apiUrl: string, appId: string, oauthAccessToken: string, device?: "desktop" | "mobile") {
	let challenge: UserRegistrationChallenge;
	try {
		challenge = await Register.getInstance(apiUrl, appId).init(oauthAccessToken);
	} catch (error) {
		if (error.httpStatus === 401 && error.context?.message === "User already exists.") {
			challenge = await Register.getInstance(apiUrl, appId).restart(oauthAccessToken);
		} else {
			throw isDfnsError(error) ? new DfnsError(error.httpStatus, error.context) : error;
		}
	}
	try {
		const isMobile = navigator?.userAgent.indexOf("Mobile") !== -1;

		let authenticatorAttachment;

		if (device === "mobile") {
			authenticatorAttachment = isMobile ? "platform" : "cross-platform";
		}

		if (device === "desktop") {
			authenticatorAttachment = !isMobile ? "platform" : "cross-platform";
		}

		const attestation = await create(challenge, authenticatorAttachment as AuthenticatorAttachment);
		return Register.getInstance(apiUrl, appId).complete(challenge.temporaryAuthenticationToken, {
			firstFactorCredential: attestation,
		});
	} catch (error: unknown) {
		throw isDfnsError(error) ? new DfnsError(error.httpStatus, error.context) : error;
	}
}

export async function waitForWalletActive(apiUrl: string, dfnsHost: string, appId: string, dnfsUserToken: string, walletId: string) {
	try {
		let wallet;
		const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dnfsUserToken);
		do {
			await timeout(1000);
			wallet = await dfnsDelegated.wallets.getWallet({ walletId: walletId });
		} while (wallet.status !== WalletStatus.Active);
		return wallet;
	} catch (error: unknown) {
		handleError(apiUrl, appId, error)
			.then(() => waitForWalletActive(apiUrl, dfnsHost, appId, dnfsUserToken, walletId))
			.catch((err) => Promise.reject(err));
	}
}

export async function waitSignatureSigned(
	apiUrl: string,
	dfnsHost: string,
	appId: string,
	dnfsUserToken: string,
	walletId: string,
	signatureId: string,
): Promise<GetSignatureResponse> {
	try {
		let signature;
		const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dnfsUserToken);
		do {
			await timeout(1000);
			signature = await dfnsDelegated.wallets.getSignature({ walletId, signatureId });
		} while (signature.status !== SignatureStatus.Signed);
		return signature;
	} catch (error: unknown) {
		handleError(apiUrl, appId, error)
			.then(() => waitSignatureSigned(apiUrl, dfnsHost, appId, dnfsUserToken, walletId, signatureId))
			.catch((err) => Promise.reject(err));
	}
}

export async function createWallet(
	apiUrl: string,
	dfnsHost: string,
	appId: string,
	rpId: string,
	dfnsUserToken: string,
	network: BlockchainNetwork,
) {
	return new Promise<Wallet>(async (resolve, reject) => {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			const createWalletRequest: CreateWalletRequest = {
				body: { network },
			};

			const challenge = await dfnsDelegated.wallets.createWalletInit(createWalletRequest);

			const defaultTransports = getDefaultTransports();

			const assertion = await sign(rpId, challenge.challenge, challenge.allowCredentials, defaultTransports);

			const wallet = await dfnsDelegated.wallets.createWalletComplete(createWalletRequest, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: assertion,
			});

			resolve(wallet);
		} catch (error: unknown) {
			handleError(apiUrl, appId, error)
				.then((token) => createWallet(apiUrl, dfnsHost, appId, rpId, token, network).then((wallet) => resolve(wallet)))
				.catch((err) => reject(err));
		}
	});
}

export async function signMessage(
	apiUrl: string,
	dfnsHost: string,
	appId: string,
	rpId: string,
	dfnsUserToken: string,
	walletId: string,
	message: string,
	defaultDevice?: "mobile" | "desktop",
) {
	return new Promise<GetSignatureResponse>(async (resolve, reject) => {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			const hexMessage = ethers.utils.hashMessage(message);
			const request: GenerateSignatureRequest = {
				walletId: walletId,
				body: { kind: SignatureKind.Hash, hash: hexMessage },
			};

			const challenge = await dfnsDelegated.wallets.generateSignatureInit(request);

			const defaultTransports = getDefaultTransports(defaultDevice);

			const assertion = await sign(rpId, challenge.challenge, challenge.allowCredentials, defaultTransports);

			const signatureInit = await dfnsDelegated.wallets.generateSignatureComplete(request, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: assertion,
			});

			const signature = await waitSignatureSigned(apiUrl, dfnsHost, appId, dfnsUserToken, walletId, signatureInit.id);

			resolve(signature);
		} catch (err) {
			handleError(apiUrl, appId, err)
				.then((token) =>
					signMessage(apiUrl, dfnsHost, appId, rpId, token, walletId, message, defaultDevice).then((signature) =>
						resolve(signature),
					),
				)
				.catch((err) => reject(err));
		}
	});
}

export function fetchAssets(apiUrl: string, dfnsHost: string, appId: string, dfnsUserToken: string, walletId: string) {
	return new Promise<WalletAsset[]>(async (resolve, reject) => {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			const assets = (await dfnsDelegated.wallets.getWalletAssets({ walletId })).assets;

			resolve(assets);
		} catch (err) {
			handleError(apiUrl, appId, err)
				.then((token) => fetchAssets(apiUrl, dfnsHost, appId, token, walletId).then((assets) => resolve(assets)))
				.catch((err) => reject(err));
		}
	});
}

export async function fetchCredentials(apiUrl: string, dfnsHost: string, appId: string, dfnsUserToken: string) {
	return new Promise<ListUserCredentialsResponse>(async (resolve, reject) => {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			const credentials = await dfnsDelegated.auth.listUserCredentials();
			resolve(credentials);
		} catch (error: unknown) {
			handleError(apiUrl, appId, error)
				.then((token) => fetchCredentials(apiUrl, dfnsHost, appId, token).then((credentials) => resolve(credentials)))
				.catch((err) => reject(err));
		}
	});
}

export async function transferTokens(
	dfnsTransferSelectedToken: ITokenInfo,
	apiUrl: string,
	dfnsHost: string,
	appId: string,
	rpId: string,
	dfnsUserToken: string,
	wallet: Wallet,
	to: string,
	value: string,
) {
	return new Promise<string>(async (resolve, reject) => {
		try {
			const kind = dfnsTransferSelectedToken.contract ? TransferKind.Erc20 : TransferKind.Native;
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			let request: TransferAssetRequest;

			if (kind === TransferKind.Erc20) {
				request = {
					walletId: wallet.id,
					body: {
						kind: TransferKind.Erc20,
						to: to,
						amount: value,
						contract: dfnsTransferSelectedToken.contract,
					},
				};
			}

			if (kind === TransferKind.Native) {
				request = {
					walletId: wallet.id,
					body: {
						kind: TransferKind.Native,
						to: to,
						amount: value,
					},
				};
			}

			const challenge = await dfnsDelegated.wallets.transferAssetInit(request);

			const defaultTransports = getDefaultTransports();

			const assertion = await sign(rpId, challenge.challenge, challenge.allowCredentials, defaultTransports);

			let transfer = await dfnsDelegated.wallets.transferAssetComplete(request, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: assertion,
			});

			do {
				await timeout(1000);
				transfer = await dfnsDelegated.wallets.getTransfer({
					walletId: wallet.id,
					transferId: transfer.id,
				});
			} while (
				transfer.status === TransferStatus.Pending ||
				//@ts-ignore
				transfer.status === "Executing"
			);
			if (transfer.status === TransferStatus.Failed || transfer.status === TransferStatus.Rejected) {
				throw new Error(transfer.reason);
			}
			const txHash = transfer.txHash;

			resolve(txHash);
		} catch (error: unknown) {
			handleError(apiUrl, appId, error)
				.then((token) =>
					transferTokens(dfnsTransferSelectedToken, apiUrl, dfnsHost, appId, rpId, token, wallet, to, value).then((txHash) =>
						resolve(txHash),
					),
				)
				.catch((err) => reject(err));
		}
	});
}

export async function sendTransaction(
	apiUrl: string,
	dfnsHost: string,
	appId: string,
	rpId: string,
	dfnsUserToken: string,
	wallet: Wallet,
	to: string,
	value: string,
	data?: string,
	txNonce?: number,
) {
	const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
	return new Promise<string>(async (resolve, reject) => {
		try {
			const request: BroadcastTransactionRequest = {
				walletId: wallet.id,
				body: {
					kind: "Evm",
					to: to,
					value: value,
					data: data,
					nonce: txNonce,
				},
			};

			const challenge = await dfnsDelegated.wallets.broadcastTransactionInit(request);

			const defaultTransports = getDefaultTransports();

			const assertion = await sign(rpId, challenge.challenge, challenge.allowCredentials, defaultTransports);

			let transaction = await dfnsDelegated.wallets.broadcastTransactionComplete(request, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: assertion,
			});

			do {
				await timeout(1000);
				transaction = await dfnsDelegated.wallets.getTransaction({
					walletId: wallet.id,
					transactionId: transaction.id,
				});
				//@ts-ignore
			} while (transaction.status === TransactionStatus.Pending || transaction.status === "Executing");
			if (transaction.status === TransactionStatus.Failed || transaction.status === TransactionStatus.Rejected) {
				throw new Error(transaction.reason);
			}
			const txHash = transaction.txHash;
			resolve(txHash);
		} catch (error) {
			handleError(apiUrl, appId, error)
				.then((token) =>
					sendTransaction(apiUrl, dfnsHost, appId, rpId, token, wallet, to, value, data, txNonce).then((txHash) =>
						resolve(txHash),
					),
				)
				.catch((err) => reject(err));
		}
	});
}

export async function initPasskeyCreation(apiUrl: string, dfnsHost: string, appId: string, dfnsUserToken: string) {
	return new Promise<{ attestation: Fido2Attestation; challenge: Fido2Options }>(async (resolve, reject) => {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			const challenge = (await dfnsDelegated.auth.createUserCredentialChallenge({
				body: { kind: CredentialKind.Fido2 },
			})) as Fido2Options;
			const attestation = await create(challenge);
			resolve({
				attestation,
				challenge,
			});
		} catch (error) {
			handleError(apiUrl, appId, error)
				.then((token) => initPasskeyCreation(apiUrl, dfnsHost, appId, token).then((response) => resolve(response)))
				.catch((err) => reject(err));
		}
	});
}

export async function completePasskeyCreation(
	apiUrl: string,
	dfnsHost: string,
	appId: string,
	rpId: string,
	dfnsUserToken: string,
	attestation: Fido2Attestation,
	challenge: Fido2Options,
	passkeyName: string,
) {
	return new Promise(async (resolve, reject) => {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			const request = {
				body: {
					...attestation,
					credentialName: passkeyName,

					challengeIdentifier: challenge.temporaryAuthenticationToken,
				},
			};

			//@ts-ignore
			const addCredentialInitChallenge = await dfnsDelegated.auth.createUserCredentialInit(request);

			const defaultTransports = getDefaultTransports();

			const assertion = await sign(
				rpId,
				addCredentialInitChallenge.challenge,
				addCredentialInitChallenge.allowCredentials,
				defaultTransports,
			);

			//@ts-ignore
			const response = await dfnsDelegated.auth.createUserCredentialComplete(request, {
				challengeIdentifier: addCredentialInitChallenge.challengeIdentifier,
				firstFactor: assertion,
			});
			resolve(response);
		} catch (error) {
			handleError(apiUrl, appId, error)
				.then((token) =>
					completePasskeyCreation(apiUrl, dfnsHost, appId, rpId, token, attestation, challenge, passkeyName).then((response) =>
						resolve(response),
					),
				)
				.catch((err) => reject(err));
		}
	});
}

export function deactivatePasskey(
	apiUrl: string,
	dfnsHost: string,
	appId: string,
	rpId: string,
	dfnsUserToken: string,
	passkey: CredentialInfo,
) {
	return new Promise(async (resolve, reject) => {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			const request: DeactivateCredentialRequest = { body: { credentialUuid: passkey.credentialUuid } };
			const challenge = await dfnsDelegated.auth.deactivateCredentialInit(request);
			const defaultTransports = getDefaultTransports();
			const signedChallenge = await sign(rpId, challenge.challenge, challenge.allowCredentials, defaultTransports);
			const response = await dfnsDelegated.auth.deactivateCredentialComplete(request, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: signedChallenge,
			});
			resolve(response);
		} catch (error) {
			handleError(apiUrl, appId, error)
				.then((token) => deactivatePasskey(apiUrl, dfnsHost, appId, rpId, token, passkey).then((response) => resolve(response)))
				.catch((err) => reject(err));
		}
	});
}

export function activatePasskey(
	apiUrl: string,
	dfnsHost: string,
	appId: string,
	rpId: string,
	dfnsUserToken: string,
	passkey: CredentialInfo,
) {
	return new Promise(async (resolve, reject) => {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			const request: DeactivateCredentialRequest = { body: { credentialUuid: passkey.credentialUuid } };
			const challenge = await dfnsDelegated.auth.activateCredentialInit(request);
			const defaultTransports = getDefaultTransports();
			const signedChallenge = await sign(rpId, challenge.challenge, challenge.allowCredentials, defaultTransports);
			const response = await dfnsDelegated.auth.activateCredentialComplete(request, {
				challengeIdentifier: challenge.challengeIdentifier,
				firstFactor: signedChallenge,
			});
			resolve(response);
		} catch (error) {
			handleError(apiUrl, appId, error)
				.then((token) => activatePasskey(apiUrl, dfnsHost, appId, rpId, token, passkey).then((response) => resolve(response)))
				.catch((err) => reject(err));
		}
	});
}

export function createRecoveryKey(apiUrl: string, dfnsHost: string, appId: string, rpId: string, dfnsUserToken: string) {
	return new Promise<{
		recoveryKeyId: string;
		recoveryCode: string;
	}>(async (resolve, reject) => {
		try {
			const dfnsDelegated = getDfnsDelegatedClient(dfnsHost, appId, dfnsUserToken);
			const challenge = (await dfnsDelegated.auth.createUserCredentialChallenge({
				body: { kind: CredentialKind.RecoveryKey },
			})) as PublicKeyOptions;

			const clientData = {
				type: "key.create",
				challenge: arrayBufferToBase64UrlString(Buffer.from(challenge.challenge)).toString(),
				origin: window.location.origin,
				crossOrigin: false,
			};

			const response = await generateRecoveryKeyCredential(getDfnsUsernameFromUserToken(dfnsUserToken), JSON.stringify(clientData));

			const { encryptedPrivateKey, attestationData, recoveryKey, credentialId } = response;

			const recoveryFactor = {
				credentialKind: CredentialKind.RecoveryKey,
				credentialInfo: {
					attestationData: base64url(attestationData),
					clientData: base64url(JSON.stringify(clientData)),
					credId: credentialId,
				},
				encryptedPrivateKey: encryptedPrivateKey,
			};

			// Used internally (not sent to the Dfns server) to the user's browser

			const request = {
				body: {
					...recoveryFactor,
					credentialName: "Default Recovery key",
					//@ts-ignore
					challengeIdentifier: challenge.temporaryAuthenticationToken,
				},
			};

			//@ts-ignore
			const addCredentialInitChallenge = await dfnsDelegated.auth.createUserCredentialInit(request);
			const defaultTransports = getDefaultTransports();

			const assertion = await sign(
				rpId,
				addCredentialInitChallenge.challenge,
				addCredentialInitChallenge.allowCredentials,
				defaultTransports,
			);

			//@ts-ignore
			await dfnsDelegated.auth.createUserCredentialComplete(request, {
				challengeIdentifier: addCredentialInitChallenge.challengeIdentifier,
				firstFactor: assertion,
			});

			resolve({
				recoveryKeyId: credentialId,
				recoveryCode: recoveryKey,
			});
		} catch (error) {
			handleError(apiUrl, appId, error)
				.then((token) => createRecoveryKey(apiUrl, dfnsHost, appId, rpId, token).then((response) => resolve(response)))
				.catch((err) => reject(err));
		}
	});
}

export async function getRecoverAccountChallenge(apiUrl: string, appId: string, oauthAccessToken: string, recoveryCredId: string) {
	try {
		const challenge = await Recover.getInstance(apiUrl, appId).delegated(oauthAccessToken, recoveryCredId);

		return challenge;
	} catch (err) {
		throw isDfnsError(err) ? new DfnsError(err.httpStatus, err.context) : err;
	}
}

export async function recoverAccount(
	apiUrl: string,
	dfnsHost: string,
	appId: string,
	oauthAccessToken: string,
	challenge: UserRecoveryChallenge,
	recoveryCode: string,
	recoveryCredId: string,
) {
	try {
		const encryptedPrivateKey = challenge.allowedRecoveryCredentials[0].encryptedRecoveryKey;

		const attestation = (await create(challenge)) as RegistrationConfirmationFido2;

		const registrationCredentials = {
			firstFactorCredential: {
				credentialKind: CredentialKind.Fido2,
				credentialInfo: {
					attestationData: attestation.credentialInfo.attestationData,
					clientData: attestation.credentialInfo.clientData,
					credId: attestation.credentialInfo.credId,
				},
			},
		};

		const recoveryClientData = {
			type: "key.get",
			challenge: base64url(JSON.stringify(registrationCredentials)),
			origin: window.location.origin,
			crossOrigin: false,
		};

		const authToken = challenge.temporaryAuthenticationToken;
		const signature = await generateSignature(
			encryptedPrivateKey,
			JSON.stringify(recoveryClientData),
			recoveryCode,
			challenge.user.name,
			"base64url",
		);

		const recoveryAssertion: RecoverUserInput = {
			kind: CredentialKind.RecoveryKey,
			credentialAssertion: {
				clientData: base64url(JSON.stringify(recoveryClientData)),
				credId: recoveryCredId,
				signature: signature,
			},
		};

		const request: any = {
			recovery: recoveryAssertion,
			newCredentials: registrationCredentials,
		};

		//@ts-ignore
		const dfnsApiClient = new DfnsApiClient({
			appId: appId,
			authToken: authToken,
			baseUrl: dfnsHost,
		});
		await dfnsApiClient.auth.createUserRecovery({ body: request });
		const response = await Login.getInstance(apiUrl, appId).delegated(oauthAccessToken);
		return response.token;
	} catch (err) {
		throw isDfnsError(err) ? new DfnsError(err.httpStatus, err.context) : err;
	}
}

export function handleError(apiUrl: string, appId: string, error: unknown): Promise<string> {
	return new Promise((resolve, reject) => {
		if (isDfnsError(error)) {
			if (error.httpStatus === 401) {
				refreshTokenFromOAuthToken(apiUrl, appId, LocalStorageService.getInstance().items[OAUTH_ACCESS_TOKEN].get())
					.then((token) => {
						resolve(token);
					})
					.catch((err) => {
						reject(err);
					});
			} else {
				reject(error);
			}
		} else {
			reject(error);
		}
	});
}

export async function refreshTokenFromOAuthToken(apiUrl: string, appId: string, oauthAccessToken: string): Promise<string> {
	try {
		const now = new Date();
		const decodedOAuthToken = jwt_decode(oauthAccessToken) as JwtPayload;

		const oauthIssuedAt = new Date(decodedOAuthToken?.iat! * 1000);
		const oauthExpiresAt = new Date(decodedOAuthToken?.exp! * 1000);
		if (oauthIssuedAt < now && now < oauthExpiresAt) {
			const response = await Login.getInstance(apiUrl, appId).delegated(oauthAccessToken);
			dfnsStore.setValue("dfnsUserToken", response.token);
			LocalStorageService.getInstance().items[DFNS_END_USER_TOKEN].set(response.token);
			return response.token;
		}
		throw new TokenExpiredError();
	} catch (error) {
		throw new TokenExpiredError();
	}
}
