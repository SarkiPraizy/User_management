const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  host: 'localhost',
  port: 5432, // default Postgres port
  database:"user_management"
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};