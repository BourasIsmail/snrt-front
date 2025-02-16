import { NextResponse } from "next/server";
export async function middleware(request) {
    const authRoutes = ["/login"];
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;
    const url = request.nextUrl.clone();

    if (token && authRoutes.includes(pathname)) {
        url.pathname = "/";
    } else if (!token && pathname !== "/login") {
        url.pathname = "/login";
    }
    return pathname != url.pathname
        ? NextResponse.redirect(url)
        : NextResponse.next();
}

export const config = {
    matcher: "/((?!api|admin|static|.*\\..*|_next).*)",
};