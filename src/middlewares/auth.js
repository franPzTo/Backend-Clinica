const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const Admin = require('../models/Admin');
// const Doctor = require('../models/Doctor');
// const Secretary = require('../models/Secretary');


const verifyAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                ok:false,
                message:'No autorizado. Token no proporcionado!'
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_AUTH);
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(401).json({
                ok:false,
                message:'Usuario no encontrado.'
            })
        }
        req.user = user;
        next()
    } catch (error) {
        console.error('Error en verifyAuth:', error);
        return res.status(401).json({
            ok:false,
            message:'Token no válido o expirado.'
        })
    }
}

// const verifyAdmin = async (req, res, next) => {}
// const verifyDoctor = async (req, res, next) => {}
// const verifySecretary = async (req, res, next) => {}
// const verifyPatient = async (req, res, next) => {}


module.exports = {
    verifyAuth,
    // verifyAdmin,
    // verifyDoctor,
    // verifyPatient,
    // verifySecretary,
}