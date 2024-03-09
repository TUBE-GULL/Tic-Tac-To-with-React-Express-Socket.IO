import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, FormData } from '../types/types.js';
import readFileJson from '../modules/readFileJson.js';

class SocketServer {
   private io: SocketIOServer;
   private usersOnline: Record<string, number>;


   constructor(httpServer: HttpServer) {
      this.io = new SocketIOServer(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
      this.usersOnline = {};

      this.initializeSocketEvents();
   }

   initializeSocketEvents(): void {
      this.io.on('connection', (socket: Socket) => {
         this.handleConnection(socket);
         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   }

   checkUserUndefined(socket: Socket, userData: UserData) {
      if (userData === undefined) {
         this.io.to(socket.id).emit('undefined');
      } else {
         return true
      }
   }

   // handleConnection(socket: Socket, userData: UserData): void {
   //    // console.log('User connected: ' + socket.id);
   //    console.log(userData)

   //    // Привязываем socket.id к идентификатору пользователя
   //    this.usersOnline[socket.id] = userData.id;

   //    // // Отправляем пользовательские данные на его сокет
   //    // this.sendSocketDataUser(socket.id, userId);

   //    // // Отправляем обновленный список пользователей онлайн
   //    // this.io.emit('usersOnline', this.usersOnline);
   // }

   private handleConnection(socket: Socket): void {
      const userData = readFileJson('../data/data.json');
      if (userData === undefined) {
         socket.emit('undefined');
      } else {
         console.log('User connected: ' + socket.id);
         console.log(userData);

         // Привязываем socket.id к идентификатору пользователя
         // this.usersOnline[socket.id] = userData.id;

         // Отправляем пользовательские данные на его сокет
         // this.sendSocketDataUser(socket.id, userData);

         // Отправляем обновленный список пользователей онлайн
         this.io.emit('usersOnline', this.usersOnline);
      }
   }


   disconnect(socket: Socket): void {
      console.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.io.emit('usersOnline', this.usersOnline);
      // console.log(this.usersOnline)
   }

   sendSocketDataUser(socketId: string, data: UserData): void {
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

