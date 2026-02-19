const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { name, surname, email, password, role, specialties, office } = req.body;
        // verificar que no exista el email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ ok: false, message: "El email ya existe" });
        }
        const newUser = new User({
            name,surname, email, password, role, specialties,office
        });
        await newUser.save();

        return res.status(201).json({
            ok: true,
            message: "Usuario creado correctamente",
            data: newUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, message: error.message });
    }
};

const getAllUsers = async (req,res) => {
    try {
     const users = await User.find().select("-password")
     if(users.length === 0){
        return res.status(404).json({
            ok:false, 
            message: "No se encontraron usuarios en la base de datos 😥"
        })
     }

     return res.status(200).json({
        ok:true,
        message:"Usuarios obtenidos correctamente",
        data: {
            length: users.length,
            users
        }
     }) 
         
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok:false, 
            message: error.message
        })
    }
}

const getUserById = async (req, res, next) => {
    try {
    const user = await User.findById(req.params.id)
    .select('-password --verificationCode -codeExpiration')  
    
    if(!user){
        return res.status(404).json({
            ok:false,
            message:  'Usuario no encontrado'
        })
    }

    return res.status(200).json({
        ok:true,
        message:'Usuario encontrado',
        data:user
    })
        
    } catch (error) {
        next(error)
    }
}

const updateUserRole = async (req, res) => {
    try {

        const {id} = req.params;
        const {role} = req.body;

  
       const updateUser = await User.findByIdAndUpdate(
        id,
        {role},
        {new: true, runValidators:true}
       ).select("-password");


       return res.status(200).json({
        ok:true, 
        message: `Rol actualizado correctamente!`,
        user: {
            id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role
        }
    })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok:false, 
            message: error.message
        })
    }
}

const deleteUser = async (req,res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id);

        if(user.role === process.env.SUPER_ADMIN_ROLE){
            return res.status(403).json({
                ok:false,
                message: "NO se puede eliminar a este usuario ⛔❌🗑"
            })
        }

        //Si existe un archivo guardado como foto de perfil borrarla
        if(user.profilePic){
            const photoPath = getCompleteRoute(user.profilePic, 'profiles');
            deleteOneFile(photoPath)
        }


        //Elimino el usuario
        const deletedUser = await User.findByIdAndDelete(id).select("-password");



        return res.status(200).json({
            ok:true,
            message: 'Usuario eliminado exitosamente!',
            user: deletedUser
        })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok:false, 
            message: error.message
        })
    }
}


//Funciones para el perfil del usuario logueado

const getMyProfile = async (req,res) => {
    try {
        const user = await User.findById(req.user._id)
        .select("-password -verificationCode -codeExpiration");
        if (!user) {
            return res.status(404).json({
                ok:false,
                message: "Usuario no encontrado"
            })
        }

        return res.status(200).json({
            ok:true,
            message: "Perfil del usuario obtenido correctamente",
            data:user
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok:false,
            message: error.message
        })
    }
}


const updateMyProfile = async (req,res) => {
    try {
        const {name, email, phone, address} = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {name, email, phone, address},
            {new:true, runValidators:true}
        ).select("-password -verificationCode -codeExpiration")

        return res.status(200).json({
            ok:true,
            message: "Perfil actualizado correctamente",
            data:user
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok:false,
            message: error.message
        })
    }
}


//ver  turnos
const getAllAppointments = async (req,res)=>{
    const appointments = await Appointment.find()
        .populate('patient', 'name email')
        .populate('doctor', 'name email');
    
    res.json({
        ok:true,
        data: appointments
    });
};

// crear turno
const createAppointment = async (req,res)=>{
    const { patient, doctor, date, time } = req.body;

    const newAppointment = await Appointment.create({
        patient, doctor, date, time, status: 'PENDIENTE'
    });

    res.status(201).json({
        ok:true,
        message:'Turno creado correctamente',
        data: newAppointment
    });
};

// Actualizar turno (solo estado o reasignar médico)
const updateAppointment = async (req,res)=>{
    const { status, doctor } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status, doctor },
        { new: true }
    );
    res.json({
        ok:true,
        message:'Turno actualizado',
        data: appointment
    });
};

// Cancelar turno
const cancelAppointment = async (req,res)=>{
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    res.json({
        ok:true,
        message:'Turno cancelado',
        data: appointment
    });
};

module.exports = {
    deleteUser,
    updateUserRole,
    getAllUsers,
    getUserById,

    getMyProfile,
    updateMyProfile,
    createUser,
    cancelAppointment
}


