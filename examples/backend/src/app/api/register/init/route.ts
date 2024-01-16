import apiHandleErrors from "@Common/errors";
import RegisterService from "@Services/back/register";
import { registerInitSchema } from "@Validators/schemas/register";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, response: NextResponse) {
	let payload: { oAuthToken: string };
	const appId = request.headers.get("appId") || "";
	const origin = request.headers.get("origin") || "";
	try {
		payload = await registerInitSchema.validate(await request.json());
		const challenge = await RegisterService.init(appId, origin, payload!.oAuthToken);

		return NextResponse.json(challenge, { status: 200 });
	} catch (error: any) {
		return apiHandleErrors(error);
	}
}
