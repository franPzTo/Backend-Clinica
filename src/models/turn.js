const mongoose = require('mongoose');

const turnSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Turn', turnSchema);