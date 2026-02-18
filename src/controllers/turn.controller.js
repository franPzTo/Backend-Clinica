const Turn = require('../models/turn')

// Crear un turno
const createTurn = async (req, res) => {
    try {
        const { patient, doctor, date, notes } = req.body;

        if(turnDate < now) {
            return res.status(400).json({
                ok: false,
                message: "No se puede crear un turno en el pasado"
            })
        }

        const hour = turnDate.getHours();
        if (hour < 8 || hour >= 18){
            return res.status(400).json({
                ok : false,
                message: "Horario fuera del horario laboral (8 a 18)"
            })
        }

        const minutos = turnDate.getMinutes();
        if (minutes !== 0 && minutes !== 30){
            return res.status(400).json({
                ok: false,
                message : "Los turnos deben ser cada 30 minutos"
            })
        }

        const newTurn = new Turn({
            patient ,
            doctor,
            date: turnDate,
            notes
        });

        await newTurn.save();
        res.status(201).json({ ok: true, turn: newTurn });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};


// listar turnos
const getTurns = async (req, res) => {
    try {
        const turns = await Turn.find()
            .populate('patient', 'name surname email')
            .populate('doctor','name surname email')
            .sort({ date: 1 });
        res.json({ ok: true, turns });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

// actualizar turno
const updateTurn = async (req, res) => {
    try {
        const { id } =req.params;
        const updates = req.body;

        const turn = await Turn.findByIdAndUpdate(id, updates, { new: true });
        if (!turn) return res.status(404).json({ ok: false, message: 'Turno no encontrado' });

        res.json({ ok: true, turn });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};

//Cancelar turno
const cancelTurn = async(req, res) => {
    try {
        const { id } =req.params;

        const turn = await Turn.findByIdAndUpdate(id, { status: 'canceled' }, { new: true });
        if (!turn) return res.status(404).json({ ok: false, message: 'Turno no encontrado' });

        res.json({ ok: true, turn });
    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};



module.exports = 
{ createTurn,
  getTurns, 
  updateTurn,
  cancelTurn };