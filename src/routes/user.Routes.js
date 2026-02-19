// src/routes/user.Routes.js
const express = require("express");
const { verifyAuth} = require("../middlewares/auth");
const { verifyAdmin, verifySecretary } = require("../middlewares/user");

const { getAllUsers,getUserById,updateUserRole,deleteUser, getMyProfile,updateMyProfile, createUser} = require("../controllers/user.controller");
const { validateMongoID, validateUserId, validateUpdateRole} = require("../middlewares/validator");

const router = express.Router();

//usuario logueado 
router.get('/me', verifyAuth, getMyProfile);
router.patch('/me', verifyAuth, updateMyProfile);


router.use(verifyAuth, verifyAdmin, verifySecretary);

//RUTAS PRIVADAS PARA ADMINISTRACIÓN DE USUARIOS
router.post('/', verifyAuth, verifyAdmin, createUser);
router.get('/', getAllUsers);
router.get('/:id', validateUserId, getUserById)
router.patch('/:id/role', validateMongoID, validateUpdateRole, updateUserRole);
router.delete('/:id',validateMongoID, deleteUser);

module.exports = router;