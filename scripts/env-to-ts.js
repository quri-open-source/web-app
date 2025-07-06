// Script para inyectar variables del .env en environment.ts
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables del .env
const envPath = path.resolve(__dirname, '../.env');
const env = dotenv.config({ path: envPath }).parsed;

if (!env) {
  throw new Error('.env file not found or empty');
}

const content = `export const environment = {
  production: false,
  stripePublicKey: '${env.STRIPE_PUBLIC_KEY}',
  serverBaseUrl: '${env.SERVER_BASE_URL}'
};
`;

const target = path.resolve(__dirname, '../src/environments/environment.ts');
fs.writeFileSync(target, content);
console.log('environment.ts generado a partir de .env');
