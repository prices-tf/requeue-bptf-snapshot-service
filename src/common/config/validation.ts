import * as Joi from 'joi';

const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),
  DELAY_MIN: Joi.number()
    .integer()
    .positive()
    .default(60 * 1000),
  DELAY_MAX: Joi.number()
    .integer()
    .positive()
    .default(24 * 60 * 60 * 1000),
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_PORT: Joi.number().required(),
  RABBITMQ_USERNAME: Joi.string().required(),
  RABBITMQ_PASSWORD: Joi.string().required(),
  RABBITMQ_VHOST: Joi.string().allow('').required(),
  BPTF_SNAPSHOT_SERVICE_URL: Joi.string().required(),
  BPTF_LISTING_SERVICE_URL: Joi.string().required(),
});

export { validation };
