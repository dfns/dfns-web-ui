import apiHandleErrors from "@Common/errors";
import LoginService from "@Services/back/login";
import { loginInitSchema } from "@Validators/schemas/login";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	let payload: { oAuthToken: string };
	const appId = request.headers.get("appId") || "";

	try {
		payload = await loginInitSchema.validate(await request.json());
		const challenge = await LoginService.init(appId, payload!.oAuthToken);

		return NextResponse.json(challenge, { status: 200 });
	} catch (error: any) {
		return apiHandleErrors(error);
	}
}
