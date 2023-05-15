const mysql = require('mysql2');

// create a MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'test',
  database: 'indexer_db'
}).promise()

module.exports = pool;
