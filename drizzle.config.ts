import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: "./.env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL, 
  },
  tablesFilter: ["palstreak_*"],
  verbose: true,
  strict: true,
});
