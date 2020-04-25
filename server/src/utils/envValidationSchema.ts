import * as Joi from '@hapi/joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'staging', 'production', 'test')
    .case('lower')
    .required(),
  PORT: Joi.number()
    .min(7000)
    .max(9000),
});
