const nodemailer = require('nodemailer');

// Configurar el "transporter" de nodemailer
const transporter = nodemailer.createTransport({
    service:'gmail', // De donde se envian
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});


const sendVerificationEmail = async (email, userName, userCode) => {
    const mailOptions = {
        from:`"Clinica S.M." <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu cuenta - Clinica S.M.',
        html: 
        `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        }
                        .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                        }
                        .content {
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        }
                        .code {
                        font-size: 32px;
                        font-weight: bold;
                        color: #4CAF50;
                        text-align: center;
                        padding: 20px;
                        background-color: #f0f0f0;
                        border-radius: 5px;
                        letter-spacing: 5px;
                        }
                        .footer {
                        text-align: center;
                        margin-top: 20px;
                        font-size: 12px;
                        color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                        <h2>¡Bienvenido/a ${userName}!</h2>
                        <p>Gracias por registrarte en Clinica S.M.</p>
                        <p>Para completar tu registro, por favor verifica tu cuenta usando el siguiente código:</p>
                        <div class="code">${userCode}</div>
                        <p><strong>Este código expira en 15 minutos.</strong></p>
                        <p>Si no solicitaste este registro, puedes ignorar este email.</p>
                        </div>
                        <div class="footer">
                        <p>© 2025 Clinica S.M. - Todos los derechos reservados.</p>
                        </div>
                    </div>
                </body>
            </html>        
        `    };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✔ Email de verificación enviado a: ${email}`)
            return true            
        } catch (error) {
            console.error('⛔ Error al enviar el email: ', error);
            throw new Error('No se pudo enviar el email de verificación')
        }
};

module.exports ={
    sendVerificationEmail
};