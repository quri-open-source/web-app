export const environment = {
  production: false,
  stripePublicKey: process.env['STRIPE_PUBLIC_KEY'] || '',
  serverBaseUrl: process.env['SERVER_BASE_URL'] || ''
};
