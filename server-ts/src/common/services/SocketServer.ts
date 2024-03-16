import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, FormData } from '../types/types.js';
import readFileJson from '../modules/readFileJson.js';
import logger from '../../loggers/logger.service.js'


class SocketServer {
   io: SocketIOServer;
   socket: Socket | null;
   usersOnline: Record<string, object>;
   Logger: logger;


   constructor(httpServer: HttpServer, Logger: logger) {
      this.io = new SocketIOServer(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
      this.socket = null;
      this.usersOnline = {};
      this.Logger = new logger
      this.initializeSocketEvents();
   }

   initializeSocketEvents(): void {
      this.io.on('connection', (socket: Socket) => {
         this.Logger.log('connection: ' + socket.id);
         this.socket = socket;

         socket.on('disconnect', () => {
            this.disconnect(socket);
         });

         //CHAT ! 
         socket.on('sendMessage', message => {
            this.Logger.log(message)
            this.io.emit('sendEveryoneMessage', message);
         });

         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   };

   sendUserInSocket(user: UserData): void {
      this.Logger.log(user);
      if (this.socket != null) {
         if (!this.isUserOnline(user.id.toString())) {

            this.usersOnline[this.socket.id] = { Nickname: user.Nickname, Time: user.time };
            this.io.to(this.socket.id).emit('userData', user);
         }
         this.handleConnection(this.socket, user);
      }
   };

   handleConnection(socket: Socket, user: UserData): void {

      this.io.to(socket.id).emit('userData', user);// send to id user
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
      // this.Logger.log(this.usersOnline)
   }

   updateUsers() {
      this.usersOnline
      this.io.emit('sendEveryoneMessage', this.usersOnline);

   }
};

export default SocketServer;
