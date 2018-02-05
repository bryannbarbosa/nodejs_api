const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mi39490168807mi',
  database: 'maike_ajuda_db'
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Database is connected');
});

module.exports = conn;
