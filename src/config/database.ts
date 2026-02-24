const mongoose = require('mongoose');
const config = require('./config'); // Import the config file (same folder)

const connectDB = async () => {
    try {
        // Provide explicit errors when URI is not set
        if (!config.databaseURI) {
            if (config.allowLocalDb) {
                console.warn('ALLOW_LOCAL_DB enabled; falling back to mongodb://localhost:27017/pos');
                config.databaseURI = 'mongodb://localhost:27017/pos';
            } else {
                throw new Error('MONGODB_URI is not defined and ALLOW_LOCAL_DB is not enabled; aborting DB connect');
            }
        }

        console.log('Connecting to MongoDB using URI (trimmed):',
            typeof config.databaseURI === 'string' ? config.databaseURI.substring(0, 60) : config.databaseURI);
        const conn = await mongoose.connect(config.databaseURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        } as any);
        console.log(`MongoDB connected successfully, ${conn.connection.host}`);
        mongoose.connection.on('error', (err: any) => {
            console.error('MongoDB connection error', err);
        });
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });
    } catch (error: any) {
        console.error(`MongoDB connection error:', ${error.message}`);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;