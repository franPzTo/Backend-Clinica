const User = require('../models/User');

const createAdmin = async ()=>{
  try{
    // 
    const adminEmail = process.env.ADMIN_EMAIL;
    // existe?
    const existAdmin = await User.findOne({email: adminEmail}); 
    if(existAdmin){
      console.log('Admin ya existe!');
      return
    }
    // crear Admin
    const Admin = new User({
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD,
      name: process.env.ADMIN_NAME,
      surname: process.env.ADMIN_SURNAME,
      role: 'admin',
      DNI: process.env.ADMIN_DNI,
      verifiedEmail: true
    })
    await Admin.save();
    console.log('Admin creado exitosamente!');
  } catch(error){
    console.error('Error al crear el admin:', error);
  }
}

module.exports = createAdmin;
