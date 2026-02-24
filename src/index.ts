const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./config/config');
const connectDB = require('./config/database');
const globalErrorHandler = require('./middlewarers/globalErrorHandler'); // Import the global error handler
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = config.port;

connectDB();

app.use(express.json()); // Middleware to parse JSON requests
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173'], // Replace with your frontend URL
}))

app.get('/', (req: any, res: any) => {
    res.json({ message: 'Billing System API is running' });
});

// Apply DB readiness check before API routes to avoid unexpected failures
app.use('/api/v1/auth', authRoutes);

app.use(globalErrorHandler); // Middleware to parse JSON requests

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Catch-all handlers for unhandled exceptions/rejections so the process doesn't crash silently
process.on('unhandledRejection', (reason: any, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err: any) => {
    console.error('Uncaught Exception thrown:', err);
});


