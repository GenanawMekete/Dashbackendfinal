require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const gameRoutes = require('./src/routes/gameRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const telegramRoutes = require('./src/routes/telegramRoutes');
const rateLimit = require('./src/utils/rateLimit');
const GameService = require('./src/services/gameService');

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimit);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Connect to Mongo
mongoose.connect(process.env.MONGO_URI, { })
  .then(()=> console.log('Mongo connected'))
  .catch(err => console.error('Mongo err', err));

const gameService = new GameService(io);

// attach to app for routes
app.set('gameService', gameService);
app.set('io', io);

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/telegram', telegramRoutes);

// Socket.IO connections
io.on('connection', socket => {
  console.log('socket', socket.id, 'connected');
  socket.on('join-game', ({ gameId }) => {
    if (gameId) socket.join(String(gameId));
  });
  socket.on('leave-game', ({ gameId }) => {
    if (gameId) socket.leave(String(gameId));
  });
  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=> console.log(`Server listening ${PORT}`));
