fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `mutation { declareIncident(input: { type: ACCIDENT, description: "Test", lat: 0, lng: 0, reportedBy: "Admin" }) { id } }`
  })
}).then(r => r.json()).then(console.log).catch(console.error);
