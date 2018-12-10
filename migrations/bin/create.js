const fs = require('fs');
const path = require('path');

var migrationTemplate = `
module.exports = (client) => {
  return client
    .query('SELECT 1 + 1');
}
`;

function createMigration() {

  console.log("========== MIGRATION MESSAGE ==========");
  console.log("Creating a new migration for you, hold tight!");

  const filename = `${+new Date()}.js`;
  fs.writeFile(
    path.join(__dirname, '../', filename),
    migrationTemplate,
    (err) => {
      if (err) throw err;
      console.log("Migration created successfully, happy SQLing!");
      console.log("=======================================\r\n");
    }

  )
};

createMigration();
