const WebSocket = require('ws');

// Create a WebSocket server
const server = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

// Store connected clients
const clients = new Set();

server.on('connection', (socket) => {
  console.log('A new player has connected!');
  clients.add(socket);

  // Broadcast when a new player joins
  broadcast({ type: 'playerJoined', message: 'A new player has joined the game!' });

  // Handle messages from clients
  socket.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('Received:', message);

    // Broadcast the data to all clients
    broadcast(message, socket);
  });

  // Handle disconnections
  socket.on('close', () => {
    console.log('A player has disconnected.');
    clients.delete(socket);
    broadcast({ type: 'playerLeft', message: 'A player has left the game.' });
  });
});

// Broadcast a message to all clients
function broadcast(data, sender = null) {
  const message = JSON.stringify(data);
  for (const client of clients) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}
