const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cookieParser =require('cookie-parser')
const cors =require('cors')

const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const { globalLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const userRoutes = require('./routes/user.Routes');
const createAdmin = require("./Utils/createAdmin");
const doctorRoutes = require('./routes/doctor.routes');



const app = express();

connectDB()

createAdmin();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));


app.use(morgan('dev'));
app.use(globalLimiter)
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/doctor', doctorRoutes);


app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});