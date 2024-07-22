import mailgun from "mailgun-js";

const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
})

export const sendEmail = async (to, subject, htmlContent) => {
    const data = {
        from: 'Mern Blog <noreply@mernblog.com>',
        to,
        subject,
        html: htmlContent
    };
    try {
        const response = await mg.messages().send(data);
        console.log('email sent!', response);
        return response;
    } catch(err) {
        console.error('send email error', err);
        throw err;
    }
}