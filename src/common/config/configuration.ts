export interface Config {
  port: number;
  delay: DelayConfig;
  rabbitmq: RabbitMQConfig;
  services: Services;
}

export interface RabbitMQConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  vhost: string;
}

export interface DelayConfig {
  min: number;
  max: number;
}

export interface Services {
  snapshot: string;
  listing: string;
}

export default (): Config => {
  return {
    port:
      process.env.NODE_ENV === 'production'
        ? 3000
        : parseInt(process.env.PORT, 10),
    delay: {
      min: parseInt(process.env.DELAY_MIN, 10),
      max: parseInt(process.env.DELAY_MAX, 10),
    },
    rabbitmq: {
      host: process.env.RABBITMQ_HOST,
      port: parseInt(process.env.RABBITMQ_PORT, 10),
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
      vhost: process.env.RABBITMQ_VHOST,
    },
    services: {
      snapshot: process.env.BPTF_SNAPSHOT_SERVICE_URL,
      listing: process.env.BPTF_LISTING_SERVICE_URL,
    },
  };
};
