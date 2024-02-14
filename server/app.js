import http from 'http';
import express from 'express';
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken';
import logs from './modules/logs.js';
import router from './routes/router.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
const PORT = process.env.PORT || 8080;

app.use('/', router);

import readFileJson from './modules/readFileJson.js';

const UsersOnline = {};
const config = await readFileJson('./config.json');

io.on('connection', (socket) => {
   // io.use((socket, next) =>)

   // const authToken = socket.handshake.headers.authorization;
   // console.log(authToken);
   // try {
   //    const decodedToken = jwt.verify(authToken, config.secretKey);
   //    const userId = decodedToken.id;
   //    console.log('User ID:', userId);

   //    const user = {
   //       id: userId,
   //    };
   //    UsersOnline[socket.id] = user;

   //    socket.emit('connectServer', { user });

   //    io.emit('usersOnline', UsersOnline);
   // } catch (error) {
   //    console.error('Error verifying token:', error);
   // }

   socket.emit('connectServer', { data: 'text' });

   socket.on('disconnect', () => {
      console.log('User disconnected' + socket.id);
      // delete UsersOnline[socket.id];
      // io.emit('usersOnline', UsersOnline);
   });
});

// io.on('connection', (socket) => {
//    console.log('Клиент подключен');
//    io.emit('message', 'Привет, вы подключены к серверу Socket.IO!');

// });

console.time(' ➜ \x1b[32mServer startup time:\x1b[0m');
server.listen(PORT, () => {
   logs();
   console.log(` ➜ \x1b[32mLocal: \x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
   console.timeEnd(' ➜ \x1b[32mServer startup time:\x1b[0m');
});