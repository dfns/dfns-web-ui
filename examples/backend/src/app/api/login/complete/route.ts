import apiHandleErrors from "@Common/errors";
import { CreateUserLoginRequest } from "@dfns/sdk";
import LoginService from "@Services/back/login";
import { loginCompleteSchema } from "@Validators/schemas/login";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest, response: NextResponse) {
	let payload: CreateUserLoginRequest;
	const appId = request.headers.get("appId") || "";
	try {

		//@ts-ignore
		payload = await loginCompleteSchema.validate(await request.json());
		const userAuthToken = await LoginService.complete(appId, payload);
		const response = NextResponse.json({ userAuthToken }, { status: 200 });
		
		return response;
	} catch (error: any) {
		return apiHandleErrors(error);
	}
}
