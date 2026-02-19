const mongoose =require('mongoose')

const connectDB= async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conección exitosa a la Base de Datos!')
    } catch (error) {
        console.error('fallo en la coneción con la base de datos', error.message)
        process.exit(1);
    }
}

module.exports={
    connectDB
}