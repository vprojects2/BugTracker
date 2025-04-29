import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,      // your Gmail
    pass: process.env.EMAIL_PASS,      // your Gmail app password
  },
});

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `http://localhost:5000/api/auth/verify-email?token=${token}`; // or your deployed URL

  await transporter.sendMail({
    from: `"BugTracker 🔧" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email ✔️',
    html: `
      <h2>Verify your BugTracker account</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>If you did not register, please ignore this email.</p>
    `,
  });
};
