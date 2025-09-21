import nodemailer from "nodemailer";

const {
  SMTP_HOST = "smtp.gmail.com",
  SMTP_PORT = "587",
  SMTP_SECURE = "false",
  SMTP_USER,
  SMTP_PASS,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === "true",
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  requireTLS: SMTP_SECURE !== "true",
});

export default async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"Contacts App" <${SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
