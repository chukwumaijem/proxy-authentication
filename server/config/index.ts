import Joi from '@hapi/joi';
import pick from 'lodash/pick';

const envsFromFile = {
  AUTH_SECRET: Joi.string().required(),
  NODE_ENV: Joi.string()
    .allow('development', 'staging', 'production', 'test')
    .case('lower')
    .required(),
  PORT: Joi.number()
    .min(1000)
    .max(9000),
};

const envVarKeys = Object.keys(envsFromFile);
const envVarsSchema = Joi.object(envsFromFile);
const { value: envVars, error } = envVarsSchema.validate(pick(process.env, envVarKeys));

if (error) {
  throw new Error(`Environmental variable validation error: ${error}`);
}

export default {
  isDevelopment: envVars.NODE_ENV === 'development',
  isStaging: envVars.NODE_ENV === 'staging',
  isProduction: envVars.NODE_ENV === 'production',
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT || 7000,
};
