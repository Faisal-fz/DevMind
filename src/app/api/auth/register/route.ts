import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email/verification-email";
import { BCRYPT_SALT_ROUNDS, registerSchema } from "@/lib/validations/auth";

interface RegisterResponse {
  success: boolean;
  data?: { id: string; name: string | null; email: string; emailSent: boolean };
  error?: string;
}

function errorResponse(error: string, status: number) {
  return NextResponse.json<RegisterResponse>({ success: false, error }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400);
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return errorResponse("A user with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    });

    // A failed send doesn't undo the account; the user can request a new link
    const emailSent = await sendVerificationEmail(user.email, user.name).catch((error: unknown) => {
      console.error("Verification email failed:", error);
      return false;
    });

    return NextResponse.json<RegisterResponse>(
      { success: true, data: { ...user, emailSent } },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return errorResponse("A user with this email already exists", 409);
    }
    console.error("Registration failed:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
