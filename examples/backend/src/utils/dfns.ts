import { OAuthTokenError } from "@Common/errors";
import Config from "@Configs/index";
import {
	BaseAuthApi,
	CreateUserActionChallengeRequest,
	CreateUserLoginChallengeRequest,
	CreateUserLoginRequest,
	CreateUserRegistrationChallengeRequest,
	CreateUserRegistrationRequest,
	DfnsApiClient,
	DfnsBaseApiOptions,
	DfnsDelegatedApiClient,
	SignUserActionChallengeRequest,
	UserActionChallengeResponse,
	UserActionResponse,
	UserLoginChallengeResponse,
	UserLoginResponse,
	UserRegistrationChallengeResponse,
	UserRegistrationResponse
} from "@dfns/sdk";
import { AsymmetricKeySigner } from "@dfns/sdk-keysigner";
import jwt from "jsonwebtoken";

class DfnsBaseAuthApi {
	constructor(protected orgId: string, protected options: DfnsBaseApiOptions) {}

	createUserActionChallenge(request: CreateUserActionChallengeRequest): Promise<UserActionChallengeResponse> {
		return BaseAuthApi.createUserActionChallenge({ ...request }, this.options);
	}

	signUserActionChallenge(request: SignUserActionChallengeRequest): Promise<UserActionResponse> {
		return BaseAuthApi.signUserActionChallenge(request, this.options);
	}

	createUserLoginChallenge(request: Omit<CreateUserLoginChallengeRequest, "orgId">): Promise<UserLoginChallengeResponse> {
		return BaseAuthApi.createUserLoginChallenge({ ...request, orgId: this.orgId }, this.options);
	}

	createUserLogin(request: CreateUserLoginRequest): Promise<UserLoginResponse> {
		return BaseAuthApi.createUserLogin(request, this.options);
	}

	createUserRegistrationChallenge(
		request: Omit<CreateUserRegistrationChallengeRequest, "orgId">,
	): Promise<UserRegistrationChallengeResponse> {
		return BaseAuthApi.createUserRegistrationChallenge({ ...request, orgId: this.orgId }, this.options);
	}

	createUserRegistration(request: CreateUserRegistrationRequest): Promise<UserRegistrationResponse> {
		return BaseAuthApi.createUserRegistration(request, this.options);
	}
}

export const getSigner = (appOrigin: string) => new AsymmetricKeySigner({
	appOrigin,
	credId: process.env.DFNS_SERVICE_ACCOUNT_CREDENTIAL_ID!,
	privateKey: process.env.DFNS_SERVICE_ACCOUNT_PRIVATE_KEY ? atob(process.env.DFNS_SERVICE_ACCOUNT_PRIVATE_KEY) : "",
});


export const getDfnsApiClient = (appId: string, appOrigin: string) => {
	return new DfnsApiClient({
		appId,
		baseUrl: Config.getInstance().get().dfnsHost,
		authToken: process.env.DFNS_SERVICE_ACCOUNT_TOKEN!,
		signer: getSigner(appOrigin),
	});
}

export const getDfnsBaseAuthApi = (appId: string) => new DfnsBaseAuthApi(process.env.DFNS_ORG_ID!, {
	appId,
	baseUrl: Config.getInstance().get().dfnsHost,
	authToken: process.env.DFNS_SERVICE_ACCOUNT_TOKEN!,
});



export const getDfnsDelegatedClient = (appId: string, endUserAuthToken: string) =>
	new DfnsDelegatedApiClient({
		appId: appId,
		baseUrl: Config.getInstance().get().dfnsHost,
		authToken: endUserAuthToken,
	});


export function getUsernameFromOAuthToken(decodedToken: jwt.JwtPayload): string {
	if (!decodedToken || typeof decodedToken === "string") throw new OAuthTokenError();
	if (!decodedToken.iss || !decodedToken.sub) throw new OAuthTokenError();

	// let audience: string = "";

	// if (typeof decodedToken.aud === "string") audience = decodedToken.aud;
	// else if (Array.isArray(decodedToken.aud)) audience = decodedToken.aud.join();

	// let username = `${decodedToken.iss}-${audience}-${decodedToken.sub}`.toLowerCase();

	let username = `${decodedToken.iss}-${decodedToken.sub}`.toLowerCase();

	// if (decodedToken.email) {
	// 	username = `${username}-${decodedToken.email}`
	// }

	const shouldEncodeUsername = process.env.DFNS_ENCODE_USERNAME === "true";

	return shouldEncodeUsername ? btoa(username) : username;
}


