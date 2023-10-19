// Require the database configuration from the app_config.json file.
let dbConfig = require('../config/app_config.json');
const { Pool } = require("pg");

// Create a PostgreSQL database connection pool.
const pool = new Pool({
    user: dbConfig.db_postgres.user,       // Database user
    host: dbConfig.db_postgres.host,       // Database host
    database: dbConfig.db_postgres.database, // Database name
    password: dbConfig.db_postgres.password, // Database password
    port: dbConfig.db_postgres.port        // Database port
});

// Handle errors in the connection pool.
pool.on("error", (err, client) => {
    console.log(err.message);
});

module.exports = pool;
