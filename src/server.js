const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cookieParser =require('cookie-parser')
const cors =require('cors')



// Import Routes
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const { globalLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const userRoutes = require('./routes/user.Routes');
const createAdmin = require("./Utils/createAdmin");

// Use express to create the server
const app = express();
//  Database
connectDB()

createAdmin();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));
app.use(morgan('dev'));
app.use(globalLimiter)
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// Routes   

app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});