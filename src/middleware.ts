// src/middleware.ts
import { NextResponse } from "next/server";

/**
 * Middleware neutro: lascia passare tutte le richieste
 * senza fare controlli di autenticazione.
 */
export function middleware() {
  return NextResponse.next();
}

/**
 * Limita l’esecuzione del middleware solo alle route dell’app (esclude asset Next.js)
 * – puoi anche eliminare completamente questo export se non ti serve.
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
