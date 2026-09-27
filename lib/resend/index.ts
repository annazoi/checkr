import { Resend } from "resend";

// Falls back to a placeholder so `next build`'s page-data collection (which
// imports this module even for routes that never send an email at build
// time) doesn't crash when RESEND_API_KEY isn't set yet. Sending an email
// still fails at request time against a real environment without it.
export const resend = new Resend(process.env.RESEND_API_KEY ?? "re_000000000_placeholder");

const FROM_ADDRESS = "GameSafe <noreply@gamesafe.example>";

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Verify your email for GameSafe",
    html: `
      <p>Welcome to GameSafe. Confirm your email address to start sharing and reading community reports.</p>
      <p><a href="${verifyUrl}">Verify your email</a></p>
      <p>This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>
    `,
  });
}
