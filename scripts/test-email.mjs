import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log('SMTP Config:');
console.log('  Host:', process.env.SMTP_HOST);
console.log('  Port:', process.env.SMTP_PORT);
console.log('  User:', process.env.SMTP_USER);
console.log('  From:', process.env.SMTP_FROM);
console.log('  Admin:', process.env.ADMIN_EMAIL || 'info@endatech.nl');
console.log();

try {
  console.log('Verifying SMTP connection...');
  await transporter.verify();
  console.log('SMTP connection OK!\n');

  console.log('Sending test email to admin...');
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'EndaTech <info@endatech.nl>',
    to: process.env.ADMIN_EMAIL || 'info@endatech.nl',
    subject: 'Test e-mail — EndaTech',
    html: '<h2>Test</h2><p>Als je dit leest, werkt de e-mail configuratie correct.</p>',
  });
  console.log('Email sent! Message ID:', info.messageId);
  console.log('Response:', info.response);
} catch (err) {
  console.error('FOUT:', err.message);
  if (err.code) console.error('Error code:', err.code);
  if (err.responseCode) console.error('SMTP response code:', err.responseCode);
}
