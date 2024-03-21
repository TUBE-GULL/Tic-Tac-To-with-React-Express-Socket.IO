import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, socketId } from '../types/types.js';
import logger from '../../loggers/logger.service.js'


class SocketServer {
   io: SocketIOServer;
   usersOnline: Record<string, object>;
   gameRoom: Record<string, object>;
   Logger: logger;

   constructor(httpServer: HttpServer, Logger: logger) {
      this.io = new SocketIOServer(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
      this.usersOnline = {};
      this.gameRoom = {};
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

         // send all users list users online
         socket.on('userData', (user: UserData): void => {
            if (!this.isUserOnline(user.id.toString())) {
               this.usersOnline[socket.id] = { socketId: socket.id, Nickname: user.Nickname, Time: user.time };
               this.io.to(socket.id).emit('userData', user);
            }

            this.SendingListUsersEveryone();
         })

         // invitation the Game
         socket.on('invitationGame', (data): void => {
            const userRival = this.searchUser(data.userRival);
            // if (userRival.socketId != undefined) {
            this.io.to((userRival as socketId).socketId).emit('goToGame', { userRival, userSender: this.searchUser(data.userSender) });
            // }
         })

         socket.on('resultInvitationToGame', (data): void => {
            this.Logger.log(data);
            const userSender = { ...data.usersData.userSender, Symbol: 'X', stepGame: true };
            const userRival = { ...data.usersData.userRival, Symbol: 'O', stepGame: false };
            // const userSender = data.usersData.userSender;
            // const userRival = data.usersData.userRival;
            if (userSender != undefined && userRival != undefined) {
               //result TRUE
               if (data.result) {
                  this.io.to((userRival as socketId).socketId).emit('startGame', { user: userRival, users: { userRival, userSender } });
                  this.io.to((userSender as socketId).socketId).emit('startGame', { user: userSender, users: { userRival, userSender } });
                  //result False 
               } else {
                  this.io.to((userSender as socketId).socketId).emit('rejected', { result: false });
               }
            } else {
               this.Logger.error('userRival or userSearch undefined');
            }
         });

         socket.on('stepGame', (data): void => {
            this.Logger.log('stepGame')
            this.Logger.log(data)
            //тут проверка все значений по правилом хо
            // data.data.updatedCells


            this.io.to((data.data.userRival as socketId).socketId).emit('updateCells', { Cells: data.updatedCells, data });
            this.io.to((data.data.userSender as socketId).socketId).emit('updateCells', { Cells: data.updatedCells, data });
         })


         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   };


   // messages(): {

   // }

   SendingListUsersEveryone(): void {
      this.io.emit('usersOnline', this.usersOnline); // all users
   };

   searchUser(user: UserData): object | undefined {
      return Object.values(this.usersOnline).find(userObj =>
         (userObj as UserData).id === user.id || (userObj as UserData).Nickname === user.Nickname
      );
   };

   isUserOnline(userId: string): boolean {
      const value = Object.values(this.usersOnline);
      for (const userObj of value) {
         if ((userObj as UserData).id == userId) {
            return true;
         }
      };
      return false;
   };

   disconnect(socket: Socket): void {
      this.Logger.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.SendingListUsersEveryone();
   };
};

export default SocketServer;
