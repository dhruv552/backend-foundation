import Mailgen from 'mailgen';

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

const EmailVerificationMailgenContent = (username, varificationUrl) => {

    return {
        body: {
            name: username,
            intro: 'Welcome! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with your account, please click the button below to verify your email address:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify your email',
                    link: varificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }

    }
}

export { forgotPasswordMailGenContent, EmailVerificationMailgenContent }