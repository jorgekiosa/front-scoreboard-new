import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store active games
const activeGames = new Map();

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('joinGame', (gameCode) => {
    console.log('Client joined game:', gameCode);
    socket.join(gameCode);
    
    // Send current game state if exists
    const gameState = activeGames.get(gameCode);
    if (gameState) {
      socket.emit('gameUpdated', gameState);
    }
  });

  socket.on('gameUpdate', (data) => {
    console.log('Game update received:', data.code);
    // Store latest game state
    activeGames.set(data.code, data);
    // Broadcast to all clients in the game room except sender
    socket.to(data.code).emit('gameUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});