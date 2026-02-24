#!/usr/bin/env node
// Quick script to test MongoDB connection using the project's config
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env similar to the app's config
const rootEnv = path.join(process.cwd(), '.env');
const srcEnv = path.join(process.cwd(), 'src', '.env');
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else if (fs.existsSync(srcEnv)) {
  dotenv.config({ path: srcEnv });
} else {
  dotenv.config();
}

const MONGODB_URI = process.env.MONGODB_URI || null;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in environment. Use `npm run setup-env` to copy src/.env to root, or set MONGODB_URI in your environment.');
  process.exit(1);
}

(async () => {
  try {
    console.log('Testing connection to MongoDB using:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connection successful');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
