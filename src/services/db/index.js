var pg = require("pg");
var PGUSER = "deploy";
var PGDATABASE = "oscpushserver";
var config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || '5432',
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000
}

var pool = new pg.Pool(config);

module.exports = pool;
