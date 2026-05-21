const http = require('http');

const GRAPHQL_URL = 'http://localhost:4000/graphql';

const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        name
        role
      }
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
        'Content-Length': Buffer.byteLength(data),
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

async function seed() {
  console.log('Seeding admin user...');
  const res = await request(REGISTER_MUTATION, {
    input: {
      email: "admin@urbanflow.dz",
      password: "password",
      name: "Mohamed Amine",
      role: "ADMIN"
    }
  });
  
  if (res.errors) {
    console.error('Erreur lors de la création:', JSON.stringify(res.errors, null, 2));
  } else {
    console.log('Utilisateur créé avec succès !');
    console.log(res.data.register.user);
  }
}

seed();
