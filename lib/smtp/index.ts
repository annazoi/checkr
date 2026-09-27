import nodemailer from "nodemailer";

// Falls back to a disabled transport so `next build`'s page-data collection
// (which imports this module even for routes that never send an email at
// build time) doesn't crash when SMTP_HOST isn't set yet. Sending an email
// still fails at request time against a real environment without it.
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined,
});

const FROM_ADDRESS = process.env.SMTP_FROM || "Checkr <noreply@checkr.example>";

const REPORT_STATUS_COPY: Record<string, string> = {
  published: "Your report has been published and is now visible to the community.",
  removed: "Your report was removed after moderation review.",
  hidden: "Your report has been hidden pending further review.",
  under_review: "Your report has been escalated for further review.",
};

export async function sendReportStatusEmail(to: string, status: string) {
  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: "Update on your Checkr report",
    html: `<p>${REPORT_STATUS_COPY[status] ?? `Your report status changed to: ${status}.`}</p>`,
  });
}

export async function sendBadgeEmail(to: string, badgeSlug: string) {
  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: "You earned a new Checkr badge",
    html: `<p>Congratulations! You just earned the "${badgeSlug.replace(/_/g, " ")}" badge.</p>`,
  });
}
