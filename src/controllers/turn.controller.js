const Turn = require('../models/turn')

// Crear un turno
const createTurn = async (req, res) => {
    try {
        const { patient, doctor, date, notes } = req.body;

        const newTurn = new Turn({
            patient,
            doctor,
            date,
            notes
        });

        await newTurn.save();
        res.status(201).json({ ok: true, turn: newTurn });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Listar turnos
const getTurns = async (req, res) => {
    try {
        const turns = await Turn.find()
            .populate('patient', 'name surname email')
            .populate('doctor', 'name surname email')
            .sort({ date: 1 });
        res.json({ ok: true, turns });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Actualizar turno
const updateTurn = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const turn = await Turn.findByIdAndUpdate(id, updates, { new: true });
        if (!turn) return res.status(404).json({ ok: false, message: 'Turno no encontrado' });

        res.json({ ok: true, turn });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// Cancelar turno
const cancelTurn = async (req, res) => {
    try {
        const { id } = req.params;

        const turn = await Turn.findByIdAndUpdate(id, { status: 'canceled' }, { new: true });
        if (!turn) return res.status(404).json({ ok: false, message: 'Turno no encontrado' });

        res.json({ ok: true, turn });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

module.exports = { createTurn, getTurns, updateTurn, cancelTurn };