import { DFNS_PERMISSION_NAME } from "@Common/constants";
import Config from "@Configs/index";
import { BaseAuthApi, CreateUserRegistrationRequest } from "@dfns/sdk/baseAuthApi";
import { UserAuthKind, UserRegistrationChallenge } from "@dfns/sdk/codegen/datamodel/Auth";
import { getDfnsApiClient, getUsernameFromOAuthToken } from "@Utils/dfns";
import { validateByOAuthProvider } from "@Utils/oauth";

async function init(appId: string, appOrigin: string, oAuthToken: string) {
	const dfns = getDfnsApiClient(appId, appOrigin);
	const decodedToken = await validateByOAuthProvider(oAuthToken);
	const username = getUsernameFromOAuthToken(decodedToken);
	const permissions = await dfns.permissions.listPermissions();

	let walletPermission = permissions.items.find((permission) => permission.name === DFNS_PERMISSION_NAME);
	if (!walletPermission) {
		walletPermission = await dfns.permissions.createPermission({
			body: {
				name: DFNS_PERMISSION_NAME,
				operations: [
					"Auth:Creds:Create",
					"Auth:Creds:Update",
					"Auth:Creds:Read",
					"Auth:Action:Sign",
					"Wallets:Create",
					"Wallets:Read",
					"Wallets:GenerateSignature",
					"Wallets:ReadSignature",
					"Wallets:TransferAsset",
					"Wallets:BroadcastTransaction",
					"Wallets:ReadTransaction",
					"Wallets:ReadTransfer",
				],
			},
		});
	}

	
	const challenge = await dfns.auth.createDelegatedUserRegistration({
		body: { email: username, kind: UserAuthKind.EndUser },
	});

	await dfns.permissions.createPermissionAssignment({
		body: {
			permissionId: walletPermission.id,
			identityId: challenge.user.id,
		},
	});

	return challenge;
}

async function restart(appId: string, appOrigin: string, oAuthToken: string) {
	const dfns = getDfnsApiClient(appId, appOrigin);
	const decodedToken = await validateByOAuthProvider(oAuthToken);

	const username = getUsernameFromOAuthToken(decodedToken);

	let challenge: UserRegistrationChallenge;

	challenge = await dfns.auth.restartDelegatedUserRegistration({
		body: { email: username, kind: UserAuthKind.EndUser },
	});

	return challenge!;
}

async function complete(appId: string, appOrigin: string, tempAuthToken: string, signedChallenge: CreateUserRegistrationRequest) {
	const dfns = getDfnsApiClient(appId, appOrigin);
	const result = await BaseAuthApi.createUserRegistration(signedChallenge, {
		appId: appId,
		baseUrl: Config.getInstance().get().dfnsHost,
		authToken: tempAuthToken,
	});

	// Perform delegated login to get the Dfns auth token of the end-user ("on his behalf")
	const { token: userAuthToken } = await dfns.auth.createDelegatedUserLogin({
		body: { username: result.user.username },
	});

	return { userAuthToken, result };
}

const RegisterService = {
	init,
	complete,
	restart,
};

export default RegisterService;
