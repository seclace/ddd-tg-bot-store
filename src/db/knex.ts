import Knex from 'knex';
import { config } from 'dotenv';
config();

const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;

export const knexConfig = {
  client: 'pg',
  connection: {
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: Number(DB_PORT) || 5432,
  },
};

export const knex = Knex(knexConfig);
