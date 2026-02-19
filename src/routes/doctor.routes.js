// src/routes/doctor.Routes.js
const express = require("express");
const { verifyAuth } = require("../middlewares/auth");
const verifyDoctor = require("../middlewares/verifyDoctor");
const {getMyAppointments,updateAppointmentStatus} = require("../controllers/doctor.controller");

const router = express.Router();

router.use(verifyAuth, verifyDoctor);

// ver mis turnos
router.get("/appointments", getMyAppointments);

// Actualizar estado / diagnóstico
router.patch(
  "/appointments/:id",
  updateAppointmentStatus
);

module.exports = router;