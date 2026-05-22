const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'sirine',
  host: 'localhost',
  port: 5432,
  database: 'auth_db'
});
client.connect().then(() => {
  return client.query('SELECT id, email, role FROM users;');
}).then(res => {
  console.table(res.rows);
  process.exit(0);
}).catch(console.error);
