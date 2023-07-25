SQLITE_PATH = process.env.SQLITE_PATH;
if(!SQLITE_PATH) {
  SQLITE_PATH = '/db/auth.sqlite';
}

sqlite3 = require('sqlite3');
const db = new sqlite3.Database(SQLITE_PATH);

module.exports = class {
  constructor(tableName) {
    this.tableName = tableName;
    db.run('CREATE TABLE IF NOT EXISTS ' + tableName 
    + '(hashkey TEXT PRIMARY KEY, hashval TEXT,timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
     function (err) {
      if (err) {
          console.log('create table error',err)
      }
    })
  }

  async get(hashKey) {
    return db.get('SELECT hashval FROM ' + this.tableName + ' WHERE hashkey = ?', [hashKey], function (err, row) {
      if (err) {
        console.log('get data error',err)
        return null;
      }
      if(!row) {
        return null;
      }
      return row.hashval;
    })
  }

  async set(hashKey, hashValue) {
    db.get('INSERT INTO ' + this.tableName + ' (hashkey, hashval) VALUES(?, ?)', [hashKey,hashValue], function (err) {
      if (err) {
        return console.log('set data error: ', err.message)
      }
    })
  }
}
