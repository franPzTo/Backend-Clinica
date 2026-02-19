const User = require('../models/User')
const { sendVerificationEmail } = require('../Utils/emailService')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { deleteOneFile } = require('../Utils/fileCleanup')

const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'1h'
    })
}


const register = async (req,res,next)=>{
    try {
        const {name, surname, email, password}= req.body;
        const newUser=await User.create({
            name,
            surname,
            email,
            password,
        })
        const code = newUser.generateVerificationCode();
        await newUser.save();
        try {
            await sendVerificationEmail(email,name,code)
        } catch (error) {
            await User.findByIdAndDelete(newUser._id);
            if (req.file) {
                await fs.unlink(req.file.path).catch(err => console.error("Error borrando archivo:", err));
            }
            return res.status(500).json({
                ok:false,
                message: 'Error al enviar el email de verificación. Reintentar nuevamente!'
            })
        }
        return res.status(201).json({
            ok:true,
            message:'Usuario Registrado Exitosamente!',
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role,
                photo:newUser.profilePic,
            }
        })
    } catch (error) {
        next(error)
    }
}


const login = async (req,res,next)=>{
    try {
        const {email, password}= req.body
        const user = await User.findOne({email})
        const validPassword = await user.comparePasswords(password)
        if(!validPassword){
            return res.status(401).json({
                ok: false,
                message:'Credenciales Inválidas!'
            })
        }
        if(!user.verifiedEmail){
            return res.status(403).json({
                ok: false,
                message:'Debes Verificar tu Email para poder Iniciar Sesión'
            })
        }
        const token = generateToken(user._id)
        res.cookie('token', token,{
            httpOnly:true,
            sameSite:'lax',
            maxAge:60*60*1000,
            secure: true
        })
        return res.status(200).json({
            ok:true,
            message: 'Inicio de Sesión Exitoso!',
            data: {
                id: user._id,
                name: user.name,
                emmail: user.email,
                role: user.role,
            }
        })
    } catch (error) {
        next(error)
    }
}


const verifyEmail = async (req,res,next)=>{
    try {
        const {email, code}=req.body
        const user = await User.findOne({email})
        if(user.verifiedEmail){
            return res.status(400).json({
                success: false,
                message: 'El email ya está verificado'
            })
        }
        if(user.verificationCode !== code){
            return res.status(400).json({
                success: false,
                message: 'Codigo de Verificación Incorrecto'
            })
        }
        if(new Date() > user.codeExpiration){
            return res.status(400).json({
                success: false,
                message: 'Codigo de Verificación Expiradao'
            })
        }
        user.verifiedEmail=true;
        user.verificationCode=null;
        user.codeExpiration=null;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Email Verificado Exitosamente. Ahora podes Iniciar Sesión'
        })
    } catch (error) {
        next(error)
    }
}


const logout = async (req,res,next)=>{
    try {
        res.clearCookie('token');
        return res.status(200).json({
            ok:true,
            message:'Logout Exitoso!'
        })
    } catch (error) {
        next(error)
    }
}


const getUserProfile = async (req,res, next) => {
    try {
        const user = await User.findById(req.user._id)
        .select('-password -verificationCode -codeExpiration')
        ;
        return res.status(200).json({
            ok:true,
            message: "Perfil del usuario obtenido correctamente",
            data: user
        })
    } catch (error) {
        next(error)
    }
}


const updateProfilePhoto = async (req,res, next) => {
    try {
        if(!req.file){
            return res.status(400).json({
                ok:false,
                message:"no se proporcionó ninguna imagen"
            })
        }
        const user = await User.findById(req.user._id)
        .select('-password -verificationCode -codeExpiration')
        ;
        if(user.profilePic){
            const path = require('path');
            const previousPhoto = path.join(__dirname, '../../uploads/profiles',user.profilePic)
            deleteOneFile(previousPhoto)
        }
        user.profilePic = req.file.filename;
        await user.save()
        return res.status(201).json({
            ok:true,
            message:"Foto de perfil actualizada 😊",
            data: user.profilePic
        })
        
    } catch (error) {
        next(error)
    }
}


const updateUserProfile = async (req, res, next) => {
    try {
        const {name, password, birthdate} = req.body
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id, 
            { name, password, birthdate }, 
            { new: true, runValidators: true } 
        ).select('-password -verificationCode -codeExpiration');
        
        res.status(200).json({
            ok: true,
            message: "Perfil actualizado correctamente",
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
}

module.exports={
    register,
    login,
    verifyEmail,
    logout,
    getUserProfile,
    updateProfilePhoto,
    updateUserProfile,
}