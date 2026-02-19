// src/controllers/doctor.controller.js
const Appointment = require("../models/Appointment");

//  turnos del médico logueado
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            doctor: req.user._id
        }).populate("patient", "name email");

        return res.status(200).json({
            ok: true,
            data: appointments
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

// cambia estado / diagnóstico
const updateAppointmentStatus = async (req, res) => {
    const { status, diagnosis, notes } = req.body;

    // validación de estado
    if (!["PENDIENTE", "ATENDIDO", "CANCELADO"].includes(status)) {
        return res.status(400).json({
            ok: false,
            message: "Estado inválido"
        });
    }

    try {
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, doctor: req.user._id },
            { status, diagnosis, notes },
            { new: true }
        );

        // manejo si el turno no existe o no es del doctor
        if (!appointment) {
            return res.status(404).json({
                ok: false,
                message: "Turno no encontrado o no asignado a este médico"
            });
        }

        return res.status(200).json({
            ok: true,
            data: appointment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

module.exports = {
    getMyAppointments,
    updateAppointmentStatus
};