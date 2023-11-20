const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USERNAME, password: process.env.EMAIL_PASSWORD }
  });
  // define email options

  const mailOption = {
    from: 'Caleb Oshalusi <caleboshalusi@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  //actually send the email with email
  await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
