import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export function getEmailTemplate(type, data) {
  switch (type) {
    case "welcome":
      return {
        subject: "Welcome to Eqvico!",
        html: `<h1>Welcome ${data.name}!</h1>...`,
      };
    case "new-message":
      return {
        subject: "New Message Received",
        html: `<h1>You have a new message</h1>...`,
      };
    // Add more email templates
  }
}
