// game.js
// Connect to the WebSocket server
const socket = new WebSocket('ws://localhost:8080');

// Handle connection open
socket.addEventListener('open', () => {
  console.log('Connected to the WebSocket server!');

  // Send a message to the server
  const joinMessage = { type: 'join', playerID: generatePlayerID() };
  socket.send(JSON.stringify(joinMessage));
});

// Handle incoming messages
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('Message from server:', data);

  // Handle specific message types
  if (data.type === 'playerJoined') {
    console.log(data.message);
    // Update the game state (e.g., add a new player)
  } else if (data.type === 'playerLeft') {
    console.log(data.message);
    // Update the game state (e.g., remove a player)
  }
});

// Handle connection close
socket.addEventListener('close', () => {
  console.log('Disconnected from the WebSocket server.');
});

// Generate a unique player ID
function generatePlayerID() {
  return 'player-' + Math.floor(Math.random() * 10000);
}

// Example: Send player movement data to the server
document.addEventListener('keydown', (e) => {
  const movement = { type: 'move', key: e.key };
  socket.send(JSON.stringify(movement));
});
// Get the canvas and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Player object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 30,
  height: 30,
  color: 'blue',
  speed: 5,
  dx: 0,
  dy: 0,
};

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') player.dy = -player.speed;
  if (e.key === 'ArrowDown') player.dy = player.speed;
  if (e.key === 'ArrowLeft') player.dx = -player.speed;
  if (e.key === 'ArrowRight') player.dx = player.speed;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// Update player position
function updatePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Prevent player from moving out of bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Draw player on canvas
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  updatePlayer(); // Update player position
  drawPlayer(); // Draw the player
  requestAnimationFrame(gameLoop); // Keep the loop running
}

// Start the game loop
gameLoop();
