const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin ya existe');
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      name: process.env.ADMIN_NAME,
      surname: process.env.ADMIN_LASTNAME,
      role: 'admin',        
      verifiedEmail: true,
      DNI: process.env.ADMIN_DNI
    });

    await admin.save();
    console.log(' Admin creado exitosamente');
  } catch (error) {
    console.error('Error al crear Admin:', error.message);
  }
};

module.exports = createAdmin;