const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    birthDate: {
        type: Date,
        required: false
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: false
    },
    allergies: [{
        type: String,
        required: false
    }],
    medicalHistory:[{
        date: Date,
        diagnosis: String,
        required: false
    }]
});


module.exports = mongoose.model('Patient', PatientSchema);