import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, FormData } from '../types/types';
import readFileJson from '../modules/readFileJson';

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

   checkUserUndefined(socket: Socket, userData) {
      if (userData === undefined) {
         this.io.to(socket.id).emit('undefined');
      } else {
         return true
      }
   }

   handleConnection(socket: Socket, userData): void {
      // console.log('User connected: ' + socket.id);
      console.log(userData)

      // Привязываем socket.id к идентификатору пользователя
      this.usersOnline[socket.id] = userData.id;

      // // Отправляем пользовательские данные на его сокет
      // this.sendSocketDataUser(socket.id, userId);

      // // Отправляем обновленный список пользователей онлайн
      // this.io.emit('usersOnline', this.usersOnline);
   }

   disconnect(socket: Socket): void {
      console.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.io.emit('usersOnline', this.usersOnline);
      // console.log(this.usersOnline)
   }

   sendSocketDataUser(socketId, data): void {
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

