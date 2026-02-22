const rateLimit = require('express-rate-limit');

// Limita a 5 intentos de inicio de sesión por hora por IP
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // Limita a 5 intentos por IP
    message: {
        success: false,
        message: 'Demasiados petisiones desde esta IP, en una hora vuelve a intentarlo'
    },
    standardHeaders: true, // Devuelve información de limitación en los encabezados
    legacyHeaders: false, // Desactiva los encabezados de limitación heredados
});

//Limitardor global para toda la app.
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max:100, // Limita a 100 peticiones por IP
    message:{
        success: false,
        message: 'Demasiadas petisiones desde esta IP, en 15 minutos vuelve a intentarlo'
    },
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = {
    authLimiter,
    globalLimiter
}