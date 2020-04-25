import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { string, number, object } from '@hapi/joi';
import { pick } from 'lodash';

const envsFromFile = {
  NODE_ENV: string()
    .allow('development', 'staging', 'production', 'test')
    .case('lower')
    .required(),
  PORT: number()
    .min(1000)
    .max(9000),
  DB_HOST: string().required(),
  DB_NAME: string().required(),
  DB_USERNAME: string().required(),
  DB_PASSWORD: string().required(),
  DB_PORT: number().required(),
  DEFAULT_ACCOUNT_EMAIL: string(),
  AUTH_SECRET: string().required(),
};

const envVarKeys = Object.keys(envsFromFile);
const envVarsSchema = object(envsFromFile);
const { value: envVars, error } = envVarsSchema.validate(
  pick(process.env, envVarKeys),
);

if (error) {
  throw new Error(`Environmental variable validation error: ${error}`);
}

const database: PostgresConnectionOptions = {
  type: 'postgres',
  host: envVars.DB_HOST,
  port: envVars.DB_PORT,
  username: envVars.DB_USERNAME,
  password: envVars.DB_PASSWORD,
  database: envVars.DB_NAME,
};

export default {
  isDevelopment: envVars.NODE_ENV === 'development',
  isStaging: envVars.NODE_ENV === 'staging',
  isProduction: envVars.NODE_ENV === 'production',
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT || 7000,
  database,
  defaultAccountEmail: envVars.DEFAULT_ACCOUNT_EMAIL,
  authSecret: envVars.AUTH_SECRET,
};
