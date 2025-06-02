import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
  // Configurar transporte SMTP com suas credenciais
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // seu email
      pass: process.env.EMAIL_PASS, // sua senha ou token de app
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};
