import apiHandleErrors from "@Common/errors";
import { CreateUserRegistrationRequest } from "@dfns/sdk";
import RegisterService from "@Services/back/register";

import { registerCompleteSchema } from "@Validators/schemas/register";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	let payload: {
		tempAuthToken: string;
		signedChallenge: CreateUserRegistrationRequest;
	};
	const appId = request.headers.get("appId") || "";
	const origin = request.headers.get("origin") || "";
	try {
		payload = await registerCompleteSchema.validate(await request.json());
		const { userAuthToken, result } = await RegisterService.complete(appId, origin, payload!.tempAuthToken, payload!.signedChallenge);
		const response = NextResponse.json({ userAuthToken, result }, { status: 200 });

		return response;
	} catch (error: any) {
		return apiHandleErrors(error);
	}
}
