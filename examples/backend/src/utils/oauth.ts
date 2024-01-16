import { OAuthTokenError } from "@Common/errors";
import jwt from "jsonwebtoken";
// import { createRemoteJWKSet, jwtVerify } from "jose";

export type OAuthProvider = {
	name: string;
	tokenIssuer: string;
	validationUrl: string;
	validationType: "endpoint" | "jwks";
	validationHeaders: { [key: string]: string };
};

const GoogleOAuthProvider: OAuthProvider = {
	name: "google",
	tokenIssuer: "https://accounts.google.com",
	validationType: "endpoint",
	validationUrl: "https://oauth2.googleapis.com/tokeninfo?id_token=",
	validationHeaders: {
		apikey: process.env.ACCOR_REC_API_KEY!,
		appId: "all.accor",
	},
};
const AccorRecOAuthProvider: OAuthProvider = {
	name: "Accor Rec",
	tokenIssuer: "https://rec-login.accor.com",
	validationType: "jwks",
	validationUrl: "https://rec-login.accor.com/ext/oauth/com.molitorNFTjwks",
	validationHeaders: {},
};
const AccorOAuthProvider: OAuthProvider = {
	name: "Accor Rec",
	tokenIssuer: "https://login.accor.com",
	validationType: "jwks",
	validationUrl: "https://login.accor.com/ext/oauth/com.molitorNFTjwks",
	validationHeaders: {},
};

const tokenIssuerToProviderMap = {
	[GoogleOAuthProvider.tokenIssuer]: GoogleOAuthProvider,
	[AccorRecOAuthProvider.tokenIssuer]: AccorRecOAuthProvider,
	[AccorOAuthProvider.tokenIssuer]: AccorOAuthProvider,
};

export async function validateByOAuthProvider(oAuthToken: string) {
	const decodedToken = jwt.decode(oAuthToken);
	if (!decodedToken || typeof decodedToken === "string") throw new OAuthTokenError();
	if (!decodedToken.iss || !decodedToken.sub) throw new OAuthTokenError();

	const oAuthProvider = tokenIssuerToProviderMap[decodedToken.iss];
	if (!oAuthProvider) throw new Error("Bad OAuth token issuer");

	if (oAuthProvider.validationType === "endpoint") {
		await validateFromEndpoint(oAuthToken, oAuthProvider);
	} else if (oAuthProvider.validationType === "jwks") {
		// Disabled for Accor
		// await validateJwtFromJwk(oAuthToken, oAuthProvider);
	}
	return decodedToken;
}

async function validateFromEndpoint(oAuthToken: string, provider: OAuthProvider) {
	const response = await fetch(`${provider.validationUrl}${oAuthToken}`, { method: "GET", headers: provider.validationHeaders }).catch(
		() => {
			throw new OAuthTokenError("Invalid token");
		},
	);

	if (!response.ok) {
		throw new OAuthTokenError("Invalid token");
	}

	return jwt.decode(oAuthToken);
}

// async function validateJwtFromJwk(oAuthToken: string, provider: OAuthProvider) {
// 	try {
// 		const remoteJwks = createRemoteJWKSet(new URL(provider.validationUrl), {
// 			headers: provider.validationHeaders,
// 		});

// 		const { payload } = await jwtVerify(oAuthToken, remoteJwks);
// 		return payload;
// 	} catch (err) {
// 		throw new OAuthTokenError("Invalid token");
// 	}
// }
