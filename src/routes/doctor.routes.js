const express = require("express");
const { verifyAuth } = require("../middlewares/auth");
const verifyDoctor = require("../middlewares/verify.doctor");
const { getMyAppointments, updateAppointmentStatus } = require("../controllers/doctor.controller");

const router = express.Router();

//protege todas las rutas de doctor
router.use(verifyAuth, verifyDoctor);

// ver turnos
router.get("/appointments", getMyAppointments);

// Actualizar estado / diagnóstico
router.patch("/appointments/:id", updateAppointmentStatus);

module.exports = router;