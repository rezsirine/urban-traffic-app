const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'sirine',
  host: 'localhost',
  port: 5432,
  database: 'traffic_db'
});
client.connect().then(() => {
  return client.query(`
    INSERT INTO zones (id, name, bounds, "densityLevel") 
    VALUES 
      (gen_random_uuid(), 'Centre-Ville', '[[36.81, 10.17], [36.81, 10.19], [36.80, 10.19], [36.80, 10.17]]', 'MOYEN'),
      (gen_random_uuid(), 'Carthage', '[[36.86, 10.32], [36.86, 10.34], [36.84, 10.34], [36.84, 10.32]]', 'ELEVE'),
      (gen_random_uuid(), 'La Marsa', '[[36.89, 10.32], [36.89, 10.34], [36.87, 10.34], [36.87, 10.32]]', 'FAIBLE')
  `);
}).then(() => {
  console.log('Zones seeded');
  process.exit(0);
}).catch(console.error);
