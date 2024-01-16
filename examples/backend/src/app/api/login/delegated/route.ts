import apiHandleErrors from "@Common/errors";
import LoginService from "@Services/back/login";

import { loginDelegatedSchema } from "@Validators/schemas/login";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	let payload: { oAuthToken: string };
	const appId = request.headers.get("appId") || "";
	const origin = request.headers.get("origin") || "";
	try {
		payload = await loginDelegatedSchema.validate(await request.json());
		const userAuthToken = await LoginService.delegated(appId, origin, payload!.oAuthToken);
		const response = NextResponse.json({ token: userAuthToken }, { status: 200 });
		return response;
	} catch (error: any) {
		return apiHandleErrors(error);
	}
}
