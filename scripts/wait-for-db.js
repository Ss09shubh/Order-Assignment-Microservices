const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'order_platform',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function waitForDatabase() {
  const maxRetries = 30;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connected successfully');
      await pool.end();
      return;
    } catch (error) {
      retries++;
      console.log(`Database connection attempt ${retries}/${maxRetries} failed. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.error('Failed to connect to database after maximum retries');
  process.exit(1);
}

if (require.main === module) {
  waitForDatabase();
}

module.exports = { waitForDatabase };