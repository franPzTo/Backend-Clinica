const User = require('../models/turn')  
const jwt = require('jsonwebtoken')


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

module.exports = {
    deleteUser,
    updateUserRole,
    getAllUsers,
    getUserById
}
