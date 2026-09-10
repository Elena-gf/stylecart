const nodemailer = require( 'nodemailer');

const emailConfig = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elena39788@gmail.com',
        pass: 'zsmi jiej jjwz zsqa'
    }
});

const sendEmail = async (to) => {
    try {
        const mailOptions = {
        from: 'elena39788@gmail.com',
        to: to,
        subject: 'Gracias por registrarte en nuestra app de recetas', 
        html: '<h1>¡Hola [nombre]!</h1><br><p>¡Nos alegra muchísimo tenerte aquí! 🎉</p> <p>Ya eres parte de nuestra comunidad de amantes de la cocina. Desde hoy puedes explorar cientos de recetas, guardar tus favoritas y compartir las tuyas con el mundo.</p>', 
        }
        await emailConfig.sendMail(mailOptions);
    } catch (error) {
        console.log ('Error al enviar email');
    }
}

module.exports = sendEmail;
