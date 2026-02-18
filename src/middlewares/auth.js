const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyAdmin, } = require('./user');

const verifyAuth = async (req,res,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                ok:false,
                message:'No autorizado. Token No Proporcionado'
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password')
        if(!user){
            return res.status(401).json({
                ok:false,
                message:'Usuario no encontrado'
            })
        }
        req.user=user;
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok:false,
            message:'Token Inválido o Expirado'
        })
    }
}




module.exports={
    verifyAuth,
    verifyAdmin,
}