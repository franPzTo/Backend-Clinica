const User = require('../models/User'); //Modelo base
const Patient = require('../models/Patient'); // Modelo específico para pacientes
const jwt = require('jsonwebtoken'); // Función para generar un token JWT
const { deleteOneFile } = require('../Utils/fileCleanup'); // Función para eliminar archivos
const {sendVerificationEmail} = require('../Utils/emailService') // Función para enviar correos de verificación

// Función para generar un token JWT con el ID del usuario para Login
const generateToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

const register = async (req, res, next) => {
    try {
        const { name, surname, email, password } = req.body;
        // 1. Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: '¡El usuario ya existe!' });
        }
        // 2. Crear la instancia del Usuario (sin guardar todavía)
        newUser = new User({
            name,
            surname,
            email,
            password,
            role: 'patient'
        });
        // 3. Generar código de verificación (Método definido en tu User Model)
        const code = newUser.generateVerificationCode();
        // 4. Guardar el usuario en la DB
        const savedUser = await newUser.save();
        // 5. INTENTO: Enviar el correo de verificación
        try {
            await sendVerificationEmail(email, name, code);
        } catch (emailError) {
            // Si el email falla, borramos el usuario creado para que pueda re-intentar
            console.error("Error enviando email:", emailError);
            await User.findByIdAndDelete(savedUser._id);
            if (req.file) deleteOneFile(req.file); // Limpiar imagen si existe
            return res.status(500).json({
                ok: false,
                message: 'Error al enviar el correo. Registro cancelado.',
                error: emailError.message
            });
        }
        // 6. INTENTO: Crear el perfil de Paciente (Relación 1 a 1)
        try {
            const newPatient = await Patient.create({
                userId: savedUser._id,
                medicalHistory: []
            });
            
            // ÉXITO TOTAL
            return res.status(201).json({
                ok: true,
                message: 'Registro exitoso. Revisa tu correo.',
                user: {
                    id: newPatient._id,
                    name: savedUser.name,
                    email: savedUser.email
                }
            });

        } catch (patientError) {
            // Si falla la creación del paciente, borramos el usuario también
            await User.findByIdAndDelete(savedUser._id);
            return res.status(500).json({
                ok: false,
                message: 'Error al crear el perfil médico.'
            });
        }

    } catch (error) {
        // Error genérico (ej: fallo de conexión a la DB)
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        const validPassword = await user.comparePasswords(password);
        if(!user || !validPassword){
            return res.status(401).json({
                ok:false,
                message: 'Credenciales inválidas!!'});
        }
        if(!user.verifiedEmail){
            return res.status(403).json({
                ok:false,
                message:'Cuenta no Válida!, Verifica tu correo electrónico para activar tu cuenta.'
            })
        }
        const token = generateToken(user._id);
        // Envía el token en una cookie segura
        res.cookie('token', token,{
            httpOnly: true,
            sameSite:'lax', // Permite enviar cookies en solicitudes entre sitios, pero solo para solicitudes de navegación (no para solicitudes AJAX)
            secure: true, // Asegura que la cookie solo se envíe a través de HTTPS
            maxAge: 120*60*1000, // 2 horas
        });
        return res.status(200).json({
            ok:true,
            message:'Login exitoso!!',
            user:{
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error){
        next(error);
    }
}

const verifyEmail = async (req,res,next)=>{
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        if(user.verifiedEmail){
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya ha sido verificado.'
            })
        }
        if(user.verificationCode !== code){
            return res.status(400).json({
                success: false,
                message: 'Código de verificación incorrecto.'
            })
        }
        if(new Date() > user.codeExpiration){
            return res.status(400).json({
                success:false,
                message:'El código de verificación ha expirado. Solicitar uno nuevo.'
            })
        }
        user.verifiedEmail = true; // cambiamos en verificado del email a true.
        user.verificationCode = null; // Limpiamos el código de verificación.
        user.codeExpiration = null; // Limpiamos la fecha de expiración.
        await user.save(); // Cargamos los cambios en la base de datos
        return res.status(200).json({
            success: true,
            message:'Email verificado exitosomente!!. Ahora puede Inicar Sesión'
        })
    } catch(error){
        next(error)
    }
}


const logout = async (req,res,next)=>{
    try {
        res.clearCookie('token');
        return res.status(200).json({
            ok:true,
            message:'Logout exitoso!!'
        })
    } catch(error){
        next(error)
    }
}

module.exports = {
    register,
    login,
    verifyEmail,
    logout
}