import Config from "@Configs/index";
import { CreateUserLoginRequest } from "@dfns/sdk";
import { getDfnsApiClient, getDfnsBaseAuthApi, getUsernameFromOAuthToken } from "@Utils/dfns";
import { validateByOAuthProvider } from "@Utils/oauth";

async function init(appId: string, oAuthToken: string) {
	console.log(process.env.DFNS_ORG_ID!, {
		appId,
		baseUrl: Config.getInstance().get().dfnsHost,
	})
	const dfnsBaseAuthApi = getDfnsBaseAuthApi(appId);
	const decodedToken = await validateByOAuthProvider(oAuthToken);

	const username = getUsernameFromOAuthToken(decodedToken);

	const challenge = await dfnsBaseAuthApi.createUserLoginChallenge({ username });

	return challenge;
}

async function complete(appId: string, request: CreateUserLoginRequest) {
	const dfnsBaseAuthApi = getDfnsBaseAuthApi(appId);
	const { token } = await dfnsBaseAuthApi.createUserLogin(request);
	return token;
}

async function delegated(appId: string, appOrigin: string, oAuthToken: string) {
	const dfns = getDfnsApiClient(appId, appOrigin);
	const decodedToken = await validateByOAuthProvider(oAuthToken);

	const { token: userAuthToken } = await dfns.auth.createDelegatedUserLogin({
		body: { username: getUsernameFromOAuthToken(decodedToken) },
	});

	return userAuthToken;
}

const LoginService = {
	init,
	complete,
	delegated,
};

export default LoginService;
