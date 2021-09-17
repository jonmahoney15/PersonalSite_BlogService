import Joi from "joi";

import { loadConfig } from "./util/load-config";

export interface Env {
  NODE_ENV: "development" | "test" | "production";
  PORT: number;
  MONGO_DB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: number;
  ADMIN_STATUS: string;
  GUEST_STATUS: string;
}

const schema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("development", "test", "production")
      .default("development"),
    PORT: Joi.number().port().default(3000),
    FROM_EMAIL: Joi.string().email(),
    TO_EMAIL: Joi.string().email(),
    PASSWORD: Joi.string().regex(/^[a-zA-Z0-9_!@./#&+-]{3,30}$/),
    MONGO_DB_URI: Joi.string(),
    ORIGIN: Joi.string(),
    JWT_SECRET: Joi.string(),
    JWT_EXPIRES_IN: Joi.number().default(0),
    CRYPT_PASSWORD: Joi.string().regex(/^[a-zA-Z0-9_!@./#&+-]{3,30}$/),
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
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  adminStatus: env.ADMIN_STATUS,
  guestStatus: env.GUEST_STATUS,
};
