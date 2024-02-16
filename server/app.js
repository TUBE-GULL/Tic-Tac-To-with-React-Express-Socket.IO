import http from 'http';
import express from 'express';
import logs from './modules/logs.js';
import router from './routes/router.js';
import SocketServer from './services/SocketServer.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

app.use('/', router);

const socketServer = new SocketServer(server);

console.time(' ➜ \x1b[32mServer startup time:\x1b[0m');
server.listen(PORT, () => {
   logs();
   console.log(` ➜ \x1b[32mLocal: \x1b[4mhttp://localhost:${PORT}/\x1b[0m`);
   console.timeEnd(' ➜ \x1b[32mServer startup time:\x1b[0m');
});

export default socketServer;

// import { Server } from 'socket.io'
// const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
//io.on('connection', (socket) => {
//    // io.use((socket, next) =>)

//    // const authToken = socket.handshake.headers.authorization;
//    // console.log(authToken);
//    // try {
//    //    const decodedToken = jwt.verify(authToken, config.secretKey);
//    //    const userId = decodedToken.id;
//    //    console.log('User ID:', userId);

//    //    const user = {
//    //       id: userId,
//    //    };
//    //    UsersOnline[socket.id] = user;

//    //    socket.emit('connectServer', { user });

//    //    io.emit('usersOnline', UsersOnline);
//    // } catch (error) {
//    //    console.error('Error verifying token:', error);
//    // }

//    socket.emit('connectServer', { data: 'text' });

//    socket.on('disconnect', () => {
//       console.log('User disconnected' + socket.id);
//       // delete UsersOnline[socket.id];
//       // io.emit('usersOnline', UsersOnline);
//    });
// });