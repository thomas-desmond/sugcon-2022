import { NextURL } from "next/dist/server/web/next-url";
import { NextMiddlewareResult } from "next/dist/server/web/types";
import { NextResponse, NextRequest } from "next/server";


export async function middleware(request: NextRequest): Promise<NextMiddlewareResult> {


    console.log("Url: ", request.url);
    console.log("Geo: ", request.geo);
    console.log("IP: ", request.ip);
    console.log("Cookies: ", request.cookies);
    return;
}

