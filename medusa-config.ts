/**
 * Local-dev Medusa config. Used when running `medusa develop` against
 * this plugin directory directly — Medusa's CLI loads it.
 *
 * The published package does NOT include this file; it's here so
 * developers can iterate on the plugin without setting up a separate
 * host Medusa app.
 */

import { defineConfig, loadEnv } from '@medusajs/framework/utils';

loadEnv(process.env.NODE_ENV || 'development', process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  plugins: [
    {
      resolve: './',
      options: {},
    },
  ],
});
