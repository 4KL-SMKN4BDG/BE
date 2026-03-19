import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD
    },
});

export const sendEmail = async (to: string, subject: string, html?: string) => {
    const mail = await transporter.sendMail({
        from: process.env.EMAIL_USER, // '"4KL Support" <process.env.EMAIL_USER>'. untuk alias nama pengirim, belum dicoba hehe tapi nemu di dokumentasi resmi nodemailer
        to,
        subject,
        html
    });

    return mail;
}