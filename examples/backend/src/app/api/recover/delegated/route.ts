import apiHandleErrors from "@Common/errors";
import RecoveryService from "@Services/back/recovery";

import { recoveryDelegatedSchema } from "@Validators/schemas/recovery";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	let payload: { oAuthToken: string; credentialId: string };
	const appId = request.headers.get("appId") || "";
	const origin = request.headers.get("origin") || "";
	try {
		payload = await recoveryDelegatedSchema.validate(await request.json());
		const challenge = await RecoveryService.delegated(appId, origin, payload!.oAuthToken, payload!.credentialId);
		const response = NextResponse.json(challenge, { status: 200 });
		return response;
	} catch (error: any) {
		return apiHandleErrors(error);
	}
}
