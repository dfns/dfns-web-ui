import { NextRequest, NextResponse } from "next/server";

export const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization, appId",
};

export async function middleware(request: NextRequest) {
	const response = NextResponse.next();

	if (request.nextUrl.pathname.startsWith("/api")) {
		response.headers.append("Access-Control-Allow-Origin", "*");
        response.headers.append("Access-Control-Allow-Methods", "*");
        response.headers.append("Access-Control-Allow-Headers", "*");
	}

    if(request.method === "OPTIONS") {
        return NextResponse.json({}, { headers: corsHeaders });
    }

	return response;
}
