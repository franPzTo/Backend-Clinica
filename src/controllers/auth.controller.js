const User = require('../models/User'); //Modelo base
const Patient = require('../models/Patient'); // Modelo específico para pacientes
const jwt = require('jsonwebtoken'); // Función para generar un token JWT
const { deleteOneFile } = require('../Utils/fileCleanup'); // Función para eliminar archivos
const { sendVerificationCode } = require('../Utils/emailService'); // Función para enviar correos de verificación

// Función para generar un token JWT con el ID del usuario para Login
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

const register = async (req, res, next) => {
    try{
        const { name, surname, email, password} = req.body;
        // Verifica si el usuario ya existe
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'Usuario ya existe!!'});
        }
        // Crea el Usuario base
        const newUser = await User.create({
            name,
            surname,
            email,
            password,
            role: 'patient' // Asigna el rol de paciente
        });
        // Genera el código de verificación y actualiza el usuario
        const code = newUser.generateVerificationCode(); 
        // Guarda el usuario para obtener su ID y luego crear el registro específico para el paciente
        const savedUser = await newUser.save();
        try{
            await sendVerificationCode(email, name, code);
        } catch(emailError){
            // Si falla eliminamos el usuario creado
            await User.findByIdAndDelete(savedUser._id); // Elimina el usuario si hubo un error al enviar el correo
            if(req.file){
                deleteOneFile(req.file); // Elimina la imagen si se subió una
            }
            return res.status(500).json({
                ok:false,
                message: 'Error al enviar el correo de verificación. Por favor, intenta registrarte nuevamente.'
            });
        }
        // Crea el registro específico para el paciente
        try{
            const newPatient = await Patient.create({
                userId: savedUser._id,
                medicalHistory: [] // Puedes agregar campos adicionales según tus necesidades
            });
            // Guarda el paciente
            await newPatient.save();

        } catch (patientError){
            await User.findByIdAndDelete(savedUser._id); // Elimina el usuario si hubo un error al crear el paciente
            return res.status(500).json({
                ok:false,
                message: 'Error al crear el perfil del paciente. Por favor, intenta registrarte nuevamente.'
            });
        }
        return res.status(201).json({
            ok:true,
            message: 'Usuario registrado exitosamente. Por favor, verifica tu correo electrónico para activar tu cuenta.',
            user: {
                id: newPatient._id,
                name: savedUser.name,
                surname: savedUser.surname,
                email: savedUser.email,
            }
        });
    } catch(error){
        // Elimina el usuario si hubo un error al crear el paciente
        await User.findByIdAndDelete(newUser._id); 
        next(error);
    }
}

const login = async (req, res, next) => {}

module.exports = {
    register,
    login,
}