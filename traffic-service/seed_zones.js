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
      (gen_random_uuid(), 'Centre-Ville', '[[36.77, 3.05], [36.77, 3.06], [36.76, 3.06], [36.76, 3.05]]', 'MOYEN'),
      (gen_random_uuid(), 'Bab El Oued', '[[36.79, 3.04], [36.79, 3.05], [36.78, 3.05], [36.78, 3.04]]', 'ELEVE'),
      (gen_random_uuid(), 'El Harrach', '[[36.72, 3.13], [36.72, 3.15], [36.70, 3.15], [36.70, 3.13]]', 'FAIBLE')
  `);
}).then(() => {
  console.log('Zones seeded');
  process.exit(0);
}).catch(console.error);
