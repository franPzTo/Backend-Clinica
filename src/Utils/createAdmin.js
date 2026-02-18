// src/Utils/createAdmin.js
const User = require('../models/User');

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    // Verificar si ya existe el admin
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('✔ Admin ya existe!');
      return;
    }


  const admin = new User({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME,
    surname: process.env.ADMIN_LASTNAME,
    role: 'admin',
    verifiedEmail: true,
    DNI: process.env.ADMIN_DNI   // <-- agregamos DNI único
  })

    await admin.save();
    console.log('👩‍💻 Admin creado exitosamente!');
  } catch (error) {
    console.error('❌ Error al crear Admin: ', error.message);
  }
};

module.exports = createAdmin;