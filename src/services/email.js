import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailService = {
  sendDepositEmail: async ({ to, amount, balance }) => {
    const subject = "Deposit Successful";
    const text = `Your deposit of ₦${amount} was successful. Your new balance is ₦${balance}.`;

    await transporter.sendMail({
      from: `"Monyio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  },

  sendWithdrawEmail: async ({ to, amount, balance }) => {
    const subject = "Withdrawal Successful";
    const text = `Your withdrawal of ₦${amount} was successful. Your new balance is ₦${balance}.`;

    await transporter.sendMail({
      from: `"Monyio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  },
};
