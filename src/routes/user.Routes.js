// src/routes/user.Routes.js
const express = require("express");
const { verifyAuth, verifyAdmin } = require("../middlewares/auth");
const { getAllUsers,getUserById,updateUserRole,deleteUser} = require("../controllers/user.controller");
const { validateMongoID, validateUserId, validateUpdateRole} = require("../middlewares/validator");

const router = express.Router();


router.use(verifyAuth, verifyAdmin);

//RUTAS PRIVADAS PARA ADMINISTRACIÓN DE USUARIOS
router.get('/', getAllUsers);
router.get('/:id', validateUserId, getUserById)
router.patch('/:id/role', validateMongoID, validateUpdateRole, updateUserRole);
router.delete('/:id',validateMongoID, deleteUser);

module.exports = router;