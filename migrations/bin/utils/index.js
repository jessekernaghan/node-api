const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();


function connect() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || '5432',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  return client.connect()
  .then(() => Promise.resolve(client));
}

function doesTableExist() {
  return connect()
  .then(client => {
    return client
      .query(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'migrations')`)
      .then(result => {
        return client
          .end()
          .then(() => Promise.resolve(result.rows[0].exists))
      })
      .catch(err => {
        return client
          .end()
          .then(() => Promise.reject(err))
      });
  });
}


function install() {
  return connect()
    .then(client => {
      console.log("========== MIGRATION MESSAGE ==========");
      console.log("No migration table found in this database, creating one now!");
      return client
        .query(`
          CREATE TABLE migrations (
            file_name varchar(50) NOT NULL
          )
        `)
        .then(result => {
          console.log("Migration tabled created successfully.");
          console.log("=======================================\r\n");
          return client
            .end()
            .then(() => Promise.resolve(true));
        })
        .catch(err => {
          return client
            .end()
            .then(() => Promise.reject(err));
        });
    });
}

function getExistingMigrations() {
  return connect()
    .then(client => {
      return client
        .query(`SELECT file_name FROM migrations`)
        .then(result => {
          return client
            .end()
            .then(() => Promise.resolve(result.rows));
        })
        .catch(err => {
          return client
            .end()
            .then(() => Promise.reject(err));
        });
    });
}


module.exports = { connect, doesTableExist, install, getExistingMigrations };
