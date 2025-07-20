import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ecofurnisher@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD, 
    },
  });

  await transporter.sendMail({
    from: 'EcoFurnisher <ecofurnisher@gmail.com>',
    to,
    subject,
    html,
  });
} 