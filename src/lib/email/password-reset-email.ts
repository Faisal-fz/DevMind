import { APP_URL, EMAIL_FROM, getResend } from "@/lib/email/resend";
import { createPasswordResetToken } from "@/lib/email/password-reset-token";
import { escapeHtml } from "@/lib/email/escape-html";

interface PasswordResetEmailContent {
  subject: string;
  html: string;
  text: string;
}

function buildPasswordResetEmail(url: string, name: string | null): PasswordResetEmailContent {
  const greeting = name ? `Hi ${escapeHtml(name)},` : "Hi,";
  const plainGreeting = name ? `Hi ${name},` : "Hi,";

  // Email clients need inline styles
  const html = `
<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:20px;margin:0 0 16px">Reset your password</h1>
  <p style="margin:0 0 16px">${greeting}</p>
  <p style="margin:0 0 24px">We received a request to reset the password for your DevMind account. Click the button below to choose a new one.</p>
  <p style="margin:0 0 24px">
    <a href="${url}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">Reset password</a>
  </p>
  <p style="margin:0 0 8px;font-size:13px;color:#555">Or paste this link into your browser:</p>
  <p style="margin:0 0 24px;font-size:13px;word-break:break-all"><a href="${url}" style="color:#2563eb">${url}</a></p>
  <p style="margin:0;font-size:13px;color:#555">This link expires in 1 hour and can only be used once. If you didn't request a password reset, you can ignore this email.</p>
</div>`;

  const text = `${plainGreeting}

We received a request to reset the password for your DevMind account. Open this link to choose a new one:

${url}

This link expires in 1 hour and can only be used once. If you didn't request a password reset, you can ignore this email.`;

  return { subject: "Reset your DevMind password", html, text };
}

/** Issues a fresh reset token (replacing any old one) and emails the reset link. */
export async function sendPasswordResetEmail(email: string, name: string | null): Promise<boolean> {
  const token = await createPasswordResetToken(email);
  const url = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
  const { error } = await getResend().emails.send({
    from: EMAIL_FROM,
    to: email,
    ...buildPasswordResetEmail(url, name),
  });

  if (error) {
    console.error("Failed to send password reset email:", error.message);
    return false;
  }
  return true;
}
