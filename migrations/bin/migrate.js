const fs = require('fs');
const path = require('path');

const utils = require('./utils');

/*
 * serial executes Promises sequentially.
 * @param {funcs} An array of funcs that return promises.
 * @example
 * const urls = ["/url1", "/url2", "/url3"]
 * serial(urls.map(url => () => $.ajax(url)))
 *     .then(console.log.bind(console))
 */
function serial(funcs) {
  return funcs.reduce(
    (promise, func) => promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  );
}

const abort = (err, client) => {
  if (err) {

    console.log(`Uh oh! There was an error in this migration:`);
    console.error(err.stack);
    console.log('\r\nRolling back now...');
    client.query('ROLLBACK', (err) => {
      if (err) {
        console.error('Error rolling back client', err.stack)
      }
      // release the client back to the pool
      done()
    })
  }
  return !!err
}

function migrateSingle(migrationFile, client) {
  console.log(`\r\nStarting migration: ${migrationFile}`);
  const migration = require(path.join(__dirname, '../', migrationFile));
  return client.query('BEGIN')
    .then(() => migration(client))
    .then((res) => {
      console.log(`Migration was smooth sailing! Committing now.`);
      return client.query({
        text: 'INSERT INTO migrations (file_name) VALUES ($1)',
        values: [migrationFile]
      });
    })
    .then(() => client.query('COMMIT'))
    .catch((err) => abort(err, client));
  // begin transaction
  // run the migration
  // check for errors
  // close transaction
  // return promise to continue sequence
};

function migrate() {

  console.log("========== MIGRATION MESSAGE ==========");
  console.log("Hi there! Running your migrations shortly.");
  console.log("Looking for new migrations...\r\n");
  utils.getExistingMigrations()
    .then(migrations => {
      const migrationMap = migrations.reduce((prev, next) => {
        prev[next.file_name] = true;
        return prev;
      }, {});
      fs.readdir( path.join(__dirname, '../'), (err, files) => {
        if (err) throw err;

        // only get .js files
        files = files.filter(file => (file.indexOf(".js") > -1));

        // remove migrations that have already ran
        files = files.filter(file => !migrationMap[file]);


        if (!files.length) {
          console.log(`no new migrations found! Going back to bed.`);
          return;
        }

        console.log(`${files.length} new migrations found! Getting to work.\r\n`);

        utils.connect()
        .then(client => {
            return serial(files.map(file => () => migrateSingle(file, client)))
              .then(res => {
                console.log("=======================================\r\n");
                return client.end();
              });
          })
          .catch(err => {
            console.log(err);
            client.end();
          });


      });
    });
}

utils
  .doesTableExist()
  .then(exists => {
    if(!exists) {
      utils.install().then(() => migrate());
    } else {
      migrate();
    }
  })
  .catch(err => {
    console.log(err);
  });
