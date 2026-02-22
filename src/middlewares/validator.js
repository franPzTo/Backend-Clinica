const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Secretary = require('../models/Secretary');
const admin = require('../models/admin');
const { deleteOneFile } = require('../Utils/fileCleanup'); // Función para eliminar archivos

// Middleware para manejar los errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok:false,
            messaeg:'Errores de validación',
            errors: errors.mapped()
        })
    }
    next();
}


// Middleware para validar los datos de registro
const validateRegister = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
        .customSanitizer(value => value.trim()), // Elimina espacios al inicio y al final
    body('surname')
        .notEmpty().withMessage('El apellido es obligatorio')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres')
        .customSanitizer(value => value.trim()), // Elimina espacios al inicio y al final
    body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El correo electrónico no es válido')
        .normalizeEmail()
        .custom(async (email)=>{
            const user = await User.findOne({email});
            if(user){
                throw new Error('Usuario ya existe!');
            }
        }),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({min:8}).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/^[A-Za-z0-9\-(),.]+$/).withMessage('La contraseña solo puede contener letras, números y los caracteres especiales: - ( ) , .')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\-(),.]+$/).withMessage('La contraseña debe contener al menos una letra y un número')
        .customSanitizer(value => value.trim()), // Elimina espacios al inicio y al final
        
        handleValidationErrors
]

    const validateLogin = [
    body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El correo electrónico no es válido')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .matches(/^[A-Za-z0-9\-(),.]+$/).withMessage('La contraseña solo puede contener letras, números y los caracteres especiales: - ( ) , .')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\-(),.]+$/).withMessage('La contraseña debe contener al menos una letra y un número')
        .customSanitizer(value => value.trim()), // Elimina espacios al inicio y al final

    handleValidationErrors
]

const validateEmail = [
    body('email')
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('El correo electrónico no es válido')
        .normalizeEmail(),
    body('verificationCode')
        .notEmpty().withMessage('El código de verificación es obligatorio')
        .isLength({ min: 6, max: 6 }).withMessage('El código de verificación debe tener 6 dígitos')
        .matches(/^\d{6}$/).withMessage('El código de verificación debe contener solo números'),

    handleValidationErrors
    ]


module.exports = {
    validateRegister,
    validateLogin,
    validateEmail
}