const client = require("../../"); // Assuming this is your Discord.js client
const api = require("express").Router();
const nodemailer = require('nodemailer');


const smtpConfig = {
    host: 'smtp.zoho.in',
    port: 465,
    secure: true, // Set to true if using SSL
    auth: {
        user: 'admin@kartadharta.xyz',
        pass: 'RajaRani1997@'
    }
};

const transporter = nodemailer.createTransport(smtpConfig);

api.post('/contact-us', async (req, res) => {
    try {
        const { subject, message } = req.body;

        const recipients = ['akashsinhakvs@gmail.com', 'akashsinha91@yahoo.com', 'akashsinha2589@gmail.com', 'errordoc404@gmail.com', 'akashsinha970808@gmail.com'];

        const mailOptions = {
            from: 'admin@kartadharta.xyz',
            subject: subject,
            text: message,
            bcc: recipients.join(', ')
        };

        // Send bulk emails
        const info = await transporter.sendMail(mailOptions);

        console.log('Bulk email sent:', info.response);
        res.json({ message: 'Bulk emails sent successfully.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while sending bulk emails.' });
    }
});

module.exports = api;