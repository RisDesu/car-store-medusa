import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  admin: {
    vite: (config) => {
      config.define["__VITE_CHAT_APP_ID__"] = JSON.stringify(
        process.env.VITE_CHAT_APP_ID
      );
      config.define["__VITE_CHAT_AUTH_KEY__"] = JSON.stringify(
        process.env.VITE_CHAT_AUTH_KEY
      );
      return {
        optimizeDeps: {
          include: [
            "qs",
            "eventemitter3",
            "@xmpp/iq/callee",
            "@xmpp/resolve",
            "@xmpp/session-establishment",
            "@xmpp/client-core",
            "@xmpp/sasl-plain",
            "@xmpp/stream-features",
            "@xmpp/resource-binding",
            "@xmpp/reconnect",
            "@xmpp/middleware",
            "@xmpp/sasl-anonymous",
            "@xmpp/websocket",
            "@xmpp/iq/caller",
            "@xmpp/sasl",
          ], // Will be merged with config that we use to run and build the dashboard.
        },
      };
    },
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    workerMode: process.env.MEDUSA_WORKER_MODE as
      | "shared"
      | "worker"
      | "server",
  },
  modules: [
    {
      resolve: "./src/modules/brand",
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              capture: true,
            },
          },
        ],
      },
    },
  ],
  plugins: [
    {
      resolve: "@connectycube/chat-widget-medusa-plugin",
      options: {},
    },
  ],
});
