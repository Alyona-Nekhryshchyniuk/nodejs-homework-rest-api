require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { BASE_URL } = process.env;
const { SANDGRID_MAIL_KEY: key } = process.env;
sgMail.setApiKey(key);

const sendMail = (email, token) => {
  sgMail.send({
    to: email,
    from: "giovanni29121991@gmail.com",
    subject: "Email verification",
    text: "Email verification",
    html: `<a target ='_blank' href='${BASE_URL}/api/auth/verify/${token}'> Link to verify your email</a>`,
  });
};

module.exports = sendMail;
