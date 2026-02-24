#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const srcEnv = path.join(process.cwd(), 'src', '.env');
const rootEnv = path.join(process.cwd(), '.env');

if (!fs.existsSync(rootEnv) && fs.existsSync(srcEnv)) {
  fs.copyFileSync(srcEnv, rootEnv);
  console.log(`Copied ${srcEnv} to ${rootEnv}`);
} else if (fs.existsSync(rootEnv)) {
  console.log(`Root .env already exists: ${rootEnv}`);
} else {
  console.log(`No .env file found in src or root. Please create a .env in the project root.`);
}
