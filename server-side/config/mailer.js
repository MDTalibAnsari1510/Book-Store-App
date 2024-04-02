import { createTransport } from 'nodemailer';
import { FROMEMAIL, GMAILFORNODEMAILER, PASSWORDFORNODEMAILER, NODEMAILERPORT } from './config.js'

const transporter = createTransport({
    port: NODEMAILERPORT,
    host: "smtp.gmail.com",
    auth: {
        user: GMAILFORNODEMAILER,
        pass: PASSWORDFORNODEMAILER,
    },
    secure: true,
});

export const sendRevenueEmail = (mailInfo) => {
    const mailOptions = {
        from: FROMEMAIL,
        to: mailInfo.email,
        subject: mailInfo.subject,
        html: mailInfo?.revenue ?
            `
            <h1>Revenue Report</h1>
            <p>Current Month: ${mailInfo.revenue?.currentMonth || 0}</p>
            <p>Current Year: ${mailInfo.revenue?.currentYear || 0}</p>
            <p>Total Revenue: ${mailInfo.revenue?.total || 0}</p>`
            :
            `<h1>New Book Lunch Information</h1>
        <p>Book Name: ${mailInfo.bookName}</p>
        <p>Book price: ${mailInfo.price}</p>
        `
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully:');
        }
    });
};