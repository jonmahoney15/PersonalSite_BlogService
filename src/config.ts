import Joi from "joi";

import { loadConfig } from "./util/load-config";

export interface Env {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  MONGO_DB_URI: string;
  JWT_SECRET: string;
  ADMIN_STATUS: string;
  GUEST_STATUS: string;
}

const schema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("development", "test", "production")
      .default("development"),
    PORT: Joi.number().port().default(3000),
    MONGO_DB_URI: Joi.string(),
    JWT_SECRET: Joi.string(),
    ADMIN_STATUS: Joi.string(),
    GUEST_STATUS: Joi.string(),
  })
  .unknown();

const env = loadConfig(schema);

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  mongoDbUri: env.MONGO_DB_URI,
  jwtSecret: env.JWT_SECRET,
  adminStatus: env.ADMIN_STATUS,
  guestStatus: env.GUEST_STATUS,
};
