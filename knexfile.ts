import { config } from 'dotenv';
config();

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;

const knexConfig = {
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
  },
};

module.exports = {
  development: knexConfig,
  stage: knexConfig,
  production: knexConfig,
};
