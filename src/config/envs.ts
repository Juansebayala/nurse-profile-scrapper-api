import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  JOB_OFFER_BASE_URL: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    JOB_OFFER_BASE_URL: joi.string().required(),
  })
  .unknown(true);

const validation = envSchema.validate(process.env);

if (validation.error) {
  throw new Error(`Config validation error: ${validation.error.message}`);
}

const envVars = validation.value as EnvVars;

export const envs = {
  port: envVars.PORT,
  jobOfferBaseUrl: envVars.JOB_OFFER_BASE_URL,
};
