const REQUIRED_VARS = [
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_REGION',
  'CLERK_SECRET_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_ID_STARTER',
  'STRIPE_PRICE_ID_PRO',
  'STRIPE_PRICE_ID_BUSINESS',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'CRON_SECRET',
] as const;

export function validateEnv() {
  const missing = REQUIRED_VARS.filter(v => !process.env[v]);
  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}
