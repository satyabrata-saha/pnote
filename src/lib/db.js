const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  query,
  hashPassword,
  comparePassword,
};
