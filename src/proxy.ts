import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Next.js 16 : « middleware » est renommé « proxy ».
// La racine est servie à part : seul le navigateur peut lire sa préférence locale.
export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).+)",
};
