import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

const sendEmail =  async(options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Project Management App',
            link: 'https://projectmanagementapp.com'
        }
    });
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    const transporter =  nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })
    const email = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }

    try {
        await transporter.sendMail(email);
        
    } catch (error) {
        console.log("Email service Failed silently.Make sure to check the email configuration and credentials in Emailtrap and in the .env file.");
        console.error("Error:",error);
        
    }


}


const forgotPasswordMailGenContent = (username, passwordResetUrl) => {

    return {
        body: {
            name: username,
            intro: 'we received a request to reset your password. Click the button below to reset it.',
            action: {
                instructions: 'Click the button below to reset your password:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset your password',
                    link: passwordResetUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }

    }
}

const emailVerificationMailgenContent = (username, verificationUrl) => {

    return {
        body: {
            name: username,
            intro: 'Welcome! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with your account, please click the button below to verify your email address:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify your email',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }

    }
}

export { 
    forgotPasswordMailGenContent,
    emailVerificationMailgenContent,
    sendEmail
    }
