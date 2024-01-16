import { getDfnsApiClient, getUsernameFromOAuthToken } from "@Utils/dfns";
import { validateByOAuthProvider } from "@Utils/oauth";

async function delegated(appId: string, appOrigin: string, oAuthToken: string, credentialId: string) {
	const dfns = getDfnsApiClient(appId, appOrigin);
	const decodedToken = await validateByOAuthProvider(oAuthToken);
	return dfns.auth.createDelegatedUserRecovery({
		body: { username: getUsernameFromOAuthToken(decodedToken), credentialId },
	});
}

const RecoveryService = {
	delegated,
};

export default RecoveryService;
