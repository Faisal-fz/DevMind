// On unless explicitly set to "false", so a forgotten variable never turns verification off in production
export function isEmailVerificationEnabled(): boolean {
  return process.env.EMAIL_VERIFICATION_ENABLED?.trim().toLowerCase() !== "false";
}
