import nodemailer from "nodemailer"

const sendEmail = async (email, subject, text) => {
    try {
        // Sending the OTP code via email
        const transporter = nodemailer.createTransport({
          host: process.env.OTPHOST,
          service: process.env.OTPSERVICE,
          port: process.env.OTPPORT,
          secure: true,
          auth: {
            user: process.env.OTPUSER,
            pass: process.env.OTPPASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.FROMSENDEMAIL,
          to: email,
          subject:subject,
          text: text,
        });

        console.log("Email sent successfully");
       
      } catch (error) {
        console.log("Email not sent:", error.message);
      }
};


export default sendEmail