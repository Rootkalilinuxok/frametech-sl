// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware neutro: non applica alcuna logica di autenticazione.
 * Lasciano passare tutto, eccetto le path tecniche già filtrate di default.
 */
export function middleware(req: NextRequest) {
  // puoi comunque gestire eccezioni, rate-limit, ecc. qui dentro in futuro
  return NextResponse.next();
}

/**
 * Facoltativo: limita il middleware solo a certe route
 * (se lo lasci così, viene comunque eseguito ma non fa nulla).
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
