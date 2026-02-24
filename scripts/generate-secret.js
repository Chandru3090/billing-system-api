#!/usr/bin/env node
// Simple helper to generate a strong random secret for ACCESS_TOKEN_SECRET
// Usage examples:
//  node generate-secret.js            -> prints a 32-byte (256-bit) secret, hex encoded
//  node generate-secret.js 64 --base64 -> prints 64-byte secret, base64 encoded
//  node generate-secret.js --update-env -> prints secret and replaces ACCESS_TOKEN_SECRET in .env in the cwd

const fs = require('fs');
const crypto = require('crypto');

const arg = process.argv[2] || '32';
const bytes = parseInt(arg === '--update-env' || arg === '--base64' ? '32' : arg, 10);
const isBase64 = process.argv.includes('--base64');
const doUpdateEnv = process.argv.includes('--update-env');

if (Number.isNaN(bytes) || bytes <= 0) {
  console.error('Invalid bytes argument. Provide a positive integer, e.g. 32');
  process.exit(2);
}

const secret = crypto.randomBytes(bytes).toString(isBase64 ? 'base64' : 'hex');
console.log(secret);

if (doUpdateEnv) {
  const envPath = process.cwd() + '/.env';
  if (!fs.existsSync(envPath)) {
    console.error('.env not found in current directory; cannot update');
    process.exit(3);
  }
  const envContents = fs.readFileSync(envPath, { encoding: 'utf8' });
  const newContents = envContents.replace(/ACCESS_TOKEN_SECRET=.*\r?\n?/, `ACCESS_TOKEN_SECRET=${secret}\n`);
  fs.writeFileSync(envPath, newContents, { encoding: 'utf8' });
  console.log('Updated .env with new ACCESS_TOKEN_SECRET');
}
