import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, FormData } from '../types/types.js';
import logger from '../../loggers/logger.service.js'


class SocketServer {
   io: SocketIOServer;
   usersOnline: Record<string, object>;
   Logger: logger;


   constructor(httpServer: HttpServer, Logger: logger) {
      this.io = new SocketIOServer(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
      this.usersOnline = {};
      this.Logger = new logger
      this.initializeSocketEvents();
   };

   formDataUser(user: UserData) {
      this.io.on('connection', (socket: Socket) => {
         this.io.to(socket.id).emit('userFormData', user);
      });
   };

   initializeSocketEvents(): void {

      this.io.on('connection', (socket: Socket) => {
         this.Logger.log('connection: ' + socket.id);

         socket.on('userData', (user: UserData): void => {
            if (!this.isUserOnline(user.id.toString())) {

               this.usersOnline[socket.id] = { Nickname: user.Nickname, Time: user.time };
               this.io.to(socket.id).emit('userData', user);
            }
            this.handleConnection();
         })

         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   };


   handleConnection(): void {

      this.io.emit('usersOnline', this.usersOnline); // all users
   }


   isUserOnline(userId: string): boolean {
      const value = Object.values(this.usersOnline);
      for (const userObj of value) {
         if (userObj.id == userId) { //?
            return true;
         }
      }
      return false;
   }

   disconnect(socket: Socket): void {
      this.Logger.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.io.emit('usersOnline', this.usersOnline);
   };
};

export default SocketServer;
