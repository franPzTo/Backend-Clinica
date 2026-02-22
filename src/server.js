const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
// const paht = require('paht');
const cookieParser = require('cookie-parser');

// Traemos las rutas y sus funciones
// const adminRouter = require('./routes/admin.routes');
// const userRouter = require('./routes/user.routes');
// const doctorRouter = require('./routes/doctor.routes');
// const secretaryRouter = require('./routes/secretary.routes');
const authRouter = require('./routes/auth.routes');
// Traemos la Base de datos, el Creador de Admin y los middlewares generales
const connectDB = require('./config/database'); // Hecho
const createAdmin = require('./Utils/createAdmin'); // Hecho
const errorHandler = require('./middlewares/errorHandler')
const { globalLimiter } = require('./middlewares/rateLimiter')

// Declarar de Express y usarlo
const app = express();
// Conexión con la Base de Datos y creación del Admin
connectDB()
createAdmin()
// Conexión con el Frontend
app.use(cors({
    origin: process.env.URL_FRONTEND, // Define la dirección URL del sitio web
    credentials: true // Uso de cookies
}))
// Middlewares
app.use(morgan('dev'));
app.use(globalLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true})); // Leer formularios

// Decaramos las rutas y donde estan
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/user', userRouter);
// app.use('/api/v1/doctor', doctorRouter);
// app.use('/api/v1/secretary', secretaryRouter);
// app.use('/api/v1/admin', adminRouter);

// Middlewares manejador de Errores
app.use(errorHandler);
// Declaramos el puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})