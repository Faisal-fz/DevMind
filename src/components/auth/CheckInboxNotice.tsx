import { MailCheck } from "lucide-react";
import FormAlert from "@/components/auth/FormAlert";
import ResendVerificationButton from "@/components/auth/ResendVerificationButton";

interface CheckInboxNoticeProps {
  email: string;
  emailSent: boolean;
}

export default function CheckInboxNotice({ email, emailSent }: CheckInboxNoticeProps) {
  return (
    <div className="space-y-4 text-center">
      <MailCheck className="mx-auto size-10 text-emerald-400" aria-hidden="true" />
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold">
          {emailSent ? "Check your inbox" : "Account created"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {emailSent ? "We sent a verification link to " : "Your account for "}
          <span className="font-medium text-foreground">{email}</span>
          {emailSent
            ? ". Click it to activate your account, then sign in."
            : " needs to be verified before you can sign in."}
        </p>
      </div>
      {!emailSent && (
        <FormAlert message="We couldn't send the verification email. Use the button below to try again." />
      )}
      <ResendVerificationButton email={email} startInCooldown={emailSent} />
    </div>
  );
}
