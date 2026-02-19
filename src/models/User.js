const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    surname:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
    },
    profilePic:{
        type: String,
        default: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
    },
    DNI:{
        type: String,
        require: false,
        unique: true,
        default: null,
        sparse: true
    },
    role:{
        type: String,
        enum:['patient', 'doctor', 'secretary', 'admin'],
        default:'patient',
    },

    specialties:{
        type: [String],
        default: []
    },
    
    office : {type: String},

    verifiedEmail:{
        type: Boolean,
        require: false,
    },
    verificationCode:{
        type: String,
        require: true,
    },
    codeExpiration:{
        type: String,
        require: null,
    },
},{
    timestamps: true
})

userSchema.pre('save', async function (){
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePasswords = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}

userSchema.methods.generateVerificationCode = function () {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCode = code;
    this.codeExpiration = new Date(Date.now()+15*60*1000)
    return code;
}

module.exports = mongoose.model('User', userSchema)
