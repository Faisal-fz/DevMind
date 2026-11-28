import { APP_URL, EMAIL_FROM, getResend } from "@/lib/email/resend";
import { createVerificationToken } from "@/lib/email/verification-token";

interface VerificationEmailContent {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildVerificationEmail(url: string, name: string | null): VerificationEmailContent {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi,";
  const plainGreeting = name ? `Hi ${name},` : "Hi,";

  // Email clients need inline styles
  const html = `
<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:20px;margin:0 0 16px">Verify your email</h1>
  <p style="margin:0 0 16px">${greeting}</p>
  <p style="margin:0 0 24px">Thanks for signing up for DevMind. Confirm your email address to finish creating your account.</p>
  <p style="margin:0 0 24px">
    <a href="${url}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Verify email</a>
  </p>
  <p style="margin:0 0 8px;font-size:13px;color:#555">Or paste this link into your browser:</p>
  <p style="margin:0 0 24px;font-size:13px;word-break:break-all"><a href="${url}" style="color:#2563eb">${url}</a></p>
  <p style="margin:0;font-size:13px;color:#555">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
</div>`;

  const text = `${plainGreeting}

Thanks for signing up for DevMind. Confirm your email address to finish creating your account:

${url}

This link expires in 24 hours. If you didn't create an account, you can ignore this email.`;

  return { subject: "Verify your DevMind email", html, text };
}

/** Issues a fresh token (replacing any old one) and emails the verification link. */
export async function sendVerificationEmail(email: string, name: string | null): Promise<boolean> {
  const token = await createVerificationToken(email);
  const url = `${APP_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const { error } = await getResend().emails.send({
    from: EMAIL_FROM,
    to: email,
    ...buildVerificationEmail(url, name),
  });

  if (error) {
    console.error("Failed to send verification email:", error.message);
    return false;
  }
  return true;
}
