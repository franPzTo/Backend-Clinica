const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    
    timeSlot: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'arrived', 'completed', 'cancelled'],
        default: 'pending',
    },
    notes: {
        type: String,
        default: null,
        maxlength: 1000,
    },
    diagnosis: {
        type: String,
        default: null,
    },
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    cancelReason: {
        type: String,
        default: null,
    },
    arrivedConfirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    arrivedAt: {
        type: Date,
        default: null,
    },
  
    createdBySecretary: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

//evita doble turno del mismo doctor en el mismo slot y fecha
appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 }, { unique: true });
appointmentSchema.index({ patient: 1, status: 1 });
appointmentSchema.index({ doctor: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
