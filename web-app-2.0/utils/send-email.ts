import nodemailer, { SendMailOptions } from 'nodemailer';

export const sendEmail = async (
  fromEmail: string,
  toEmail: string,
  subject: string,
  textBody: string | null,
  htmlBody: string | null
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions: SendMailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
  };

  if (textBody) {
    mailOptions.text = textBody;
  }

  if (htmlBody) {
    mailOptions.html = htmlBody;
  }

  const result = await transporter.sendMail(mailOptions);
  return result;
};

export const sendEmailViaMinter = async (
  fromEmail: string,
  toEmail: string,
  subject: string,
  textBody: string | null,
  htmlBody: string | null
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MINT_SMTP_HOST,
    port: Number(process.env.MINT_EMAIL_SPRT),
    secure: true,
    auth: {
      user: process.env.MINT_EMAIL_ADDR,
      pass: process.env.MINT_EMAIL_PASS,
    },
  });

  const mailOptions: SendMailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
  };

  if (textBody) {
    mailOptions.text = textBody;
  }

  if (htmlBody) {
    mailOptions.html = htmlBody;
  }

  const result = await transporter.sendMail(mailOptions);
  return result;
};
