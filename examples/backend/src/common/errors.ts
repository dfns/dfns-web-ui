import { DfnsError } from "@dfns/sdk";
import { NextResponse } from "next/server";
import { ValidationError } from "yup";

export function isDfnsError(err: unknown): err is DfnsError {
	return err instanceof DfnsError;
}
export class OAuthTokenError extends Error {
	public constructor(message?: string) {
		super(message);
	}
}
export function isOAuthTokenError(err: unknown): err is OAuthTokenError {
	return err instanceof OAuthTokenError;
}
export function isValidationError(err: unknown): err is ValidationError {
	return err instanceof ValidationError;
}

export default function apiHandleErrors(error: any) {
	if (isOAuthTokenError(error)) {
		return NextResponse.json({error: error.message}, { status: 401 });
	}
	if (isDfnsError(error)) {
		return NextResponse.json(error, { status: error.httpStatus });
	}
	if (isValidationError(error)) {
		return NextResponse.json(error, { status: 400 });
	}
	return NextResponse.json({error: error.message}, { status: 500 });
}
