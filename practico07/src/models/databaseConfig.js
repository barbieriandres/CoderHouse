/*
create schema codehouse;
CREATE USER usercode@localhost IDENTIFIED BY "codehouse";
GRANT ALL ON codehouse.* TO usercode@localhost;
FLUSH PRIVILEGES;

CREATE USER 'usercode'@'%' IDENTIFIED BY 'codehouse';
GRANT ALL ON codehouse.* TO usercode@'%';
FLUSH PRIVILEGES;
*/
const optionsDatabaseMariaDb = {
  client: 'mysql',
  connection: {
    host : 'localhost',
    port : 3306,
    user : 'usercode',
    password : 'codehouse',
    database : 'codehouse'
  },
  pool: { min: 0, max: 4 }
}

const optionsDatabaseSqlite3 = {
  client: 'sqlite3',
  connection: { filename: './src/db/chat.sqlite' },
  useNullAsDefault: true
}

module.exports = {
  optionsDatabaseMariaDb,
  optionsDatabaseSqlite3
}