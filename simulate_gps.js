const http = require('http');

const GRAPHQL_URL = 'http://localhost:4000/graphql';

const GET_VEHICLES = `
  query {
    vehicles {
      id
      licensePlate
    }
  }
`;

const RECORD_POSITION = `
  mutation RecordPosition($input: RecordPositionInput!) {
    recordPosition(input: $input) {
      id
      lat
      lng
      timestamp
    }
  }
`;

function request(query, variables = {}) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, variables });
    const req = http.request(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function startSimulation() {
  console.log('🚀 Démarrage du simulateur GPS...');
  
  try {
    const res = await request(GET_VEHICLES);
    const vehicles = res.data.vehicles;
    
    if (!vehicles || vehicles.length === 0) {
      console.log('❌ Aucun véhicule trouvé. Veuillez en ajouter un d\'abord.');
      return;
    }

    const vehicle = vehicles[0];
    console.log(`🚗 Simulation pour le véhicule: ${vehicle.licensePlate} (ID: ${vehicle.id})`);

    // Coordonnées de départ (Alger Centre)
    let lat = 36.7372;
    let lng = 3.0869;

    setInterval(async () => {
      // Déplacement aléatoire
      lat += (Math.random() - 0.5) * 0.005;
      lng += (Math.random() - 0.5) * 0.005;

      console.log(`📍 Envoi position: ${lat.toFixed(4)}N, ${lng.toFixed(4)}E`);

      await request(RECORD_POSITION, {
        input: {
          vehicleId: vehicle.id,
          lat,
          lng
        }
      });
    }, 5000); // Toutes les 5 secondes
    
  } catch (err) {
    console.error('Erreur:', err.message);
  }
}

startSimulation();
