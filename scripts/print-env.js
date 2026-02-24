#!/usr/bin/env node
// Show debugging env info to help find where the process is loading environment from
const path = require('path');
const fs = require('fs');
console.log('Process cwd:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 60) : 'undefined');
console.log('ACCESS_TOKEN_SECRET presence:', process.env.ACCESS_TOKEN_SECRET ? 'SET' : 'UNSET');
console.log('PID:', process.pid);
// Discover which .env file will be or was loaded by the application
const rootEnv = path.join(process.cwd(), '.env');
const srcEnv = path.join(process.cwd(), 'src', '.env');
console.log('.env root exists?', fs.existsSync(rootEnv));
console.log('src/.env exists?', fs.existsSync(srcEnv));
console.log('--- Running `ls` in process cwd to help discover .env ---');
try {
  const list = fs.readdirSync(process.cwd());
  console.log(list.join('\n'));
} catch (e) {
  console.error('Failed to list process.cwd()', e.message);
}
