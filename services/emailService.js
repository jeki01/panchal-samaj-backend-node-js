// services/MailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error("Missing GMAIL_USER or GMAIL_PASS in .env file");
}

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS,
            },
        });

        this.sender = `"SMJ App" <${GMAIL_USER}>`;
    }

    async sendMail({ to, subject, text, html }) {
        try {
            const info = await this.transporter.sendMail({
                from: this.sender,
                to,
                subject,
                text,
                html,
            });

            console.log("📧 Message sent:", info.messageId);
            return info;
        } catch (error) {
            console.error("❌ Error sending email:", error);
            throw error;
        }
    }
}

module.exports = MailService;
