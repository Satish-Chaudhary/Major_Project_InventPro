import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    },
})

// Send an emial using async/await

const sendMail = async (to, otp) => {
    await transporter.sendMail({
        from: `${process.env.EMAIL}`,
        to,
        subject: "Reset Your Password",
        html: `<p>Your OTP for reset password is <b>${otp}</b>. It will be expire in 5 minutes.</p>`
    })
}

export default sendMail;