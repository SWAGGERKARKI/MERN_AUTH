import nodemailer from 'nodemailer'; // import nodemailer

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // host name
  port: 587, // port number
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }, // auth object
}); // create transporter

export default transporter; // export transporter
