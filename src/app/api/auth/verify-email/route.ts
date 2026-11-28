import { NextResponse, type NextRequest } from "next/server";
import { verifyEmailToken } from "@/lib/email/verification-token";

function redirectToSignIn(request: NextRequest, param: string, value: string) {
  const url = new URL("/sign-in", request.nextUrl.origin);
  url.searchParams.set(param, value);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) return redirectToSignIn(request, "verifyError", "invalid");

  try {
    const result = await verifyEmailToken(token);
    return result === "verified"
      ? redirectToSignIn(request, "verified", "1")
      : redirectToSignIn(request, "verifyError", result);
  } catch (error) {
    console.error("Email verification failed:", error);
    return redirectToSignIn(request, "verifyError", "invalid");
  }
}
