import { Server as SocketIOServer } from 'socket.io';
import readFileJson from '../readFileJson.js';

class SocketServer {
   constructor(httpServer) {
      this.io = new SocketIOServer(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
      this.usersOnline = {};

      this.initializeSocketEvents();
   }

   initializeSocketEvents(userData) {
      this.io.on('connection', (socket) => {
         if (userData === undefined) {
            socket.emit('undefined');
         }

         this.handleConnection(socket, userData);

         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   }

   checkUserUndefined(socket, userData) {
      if (userData === undefined) {
         this.io.to(socket.id).emit('undefined');
      } else {
         return true
      }
   }

   handleConnection(socket, userData) {
      // console.log('User connected: ' + socket.id);
      console.log(userData)

      // Привязываем socket.id к идентификатору пользователя
      this.usersOnline[socket.id] = userData.id;

      // // Отправляем пользовательские данные на его сокет
      // this.sendSocketDataUser(socket.id, userId);

      // // Отправляем обновленный список пользователей онлайн
      // this.io.emit('usersOnline', this.usersOnline);
   }

   disconnect(socket) {
      console.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.io.emit('usersOnline', this.usersOnline);
      // console.log(this.usersOnline)
   }

   sendSocketDataUser(socketId, data) {
      this.io.to(socketId).emit('sendData', data);
   }

   // sendSocketDataUser(userId) {
   //    console.log(userId)
   //    this.io.emit('userData', userId);
   // }
};

export default SocketServer;



// const UsersOnline = {};
// const config = await readFileJson('./config.json');

