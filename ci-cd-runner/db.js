// db.js
const { Pool } = require('pg');

// Create a reusable PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',          // your username
  host: 'localhost',         // local server
  database: 'cicd_runner',   // your DB name
  password: 'Pragati@12',    // your postgres password
  port: 5432,                // default port
});

// Optional: test initial connection once
pool
  .connect()
  .then((client) => {
    console.log('✅ PostgreSQL connection pool ready');
    client.release(); // release the client back to the pool
  })
  .catch((err) => {
    console.error('❌ Error connecting to PostgreSQL:', err.message);
  });

// Export the pool for use in server.js
module.exports = pool;
