import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Token não enviado" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload: decoded } = await jwtVerify(token, secret);

    const requestHeaders = new Headers(request.headers);

    requestHeaders.set("x-user-id", decoded.id);

    requestHeaders.set("x-user-role", decoded.perfil);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Token inválido" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    "/api/profile/:path*",
    "/api/agendamentos/:path*",
    "/api/me/:path*",
    "/api/profissionais/:path*",
    "/api/servicos/:path*",
    "/api/dashboard/:path*",
  ],
};
