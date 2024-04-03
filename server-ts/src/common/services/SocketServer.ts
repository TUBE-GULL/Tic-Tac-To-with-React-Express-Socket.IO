import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, socketId, GameRoom, sendMessage, CheckWinFunction } from '../types/types.js';
import checkWin from '../modules/gameFun.js';
import logger from '../../loggers/logger.service.js'
import timerForGame from '../modules/timerForGame.js';

class SocketServer {
   io: SocketIOServer;
   usersOnline: Record<string, object>;
   gameRooms: Record<string, object>;
   Logger: logger;
   checkWin: CheckWinFunction;

   constructor(httpServer: HttpServer, Logger: logger, checkWin: CheckWinFunction) {
      this.io = new SocketIOServer(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });
      this.usersOnline = {};
      this.gameRooms = {};
      this.Logger = new logger
      this.checkWin = checkWin;
      this.initializeSocketEvents();
   };

   formDataUser(user: UserData): void {
      this.io.on('connection', (socket: Socket) => {
         // this.Logger.log(user.push(invitation:true))
         this.io.to(socket.id).emit('userFormData', user);
      });
   };

   initializeSocketEvents(): void {

      this.io.on('connection', (socket: Socket) => {
         this.Logger.log('connection: ' + socket.id);

         // send all users list users online
         socket.on('userData', (user: UserData): void => {

            if (!this.isUserOnline(user.id.toString())) {
               this.usersOnline[socket.id] = { socketId: socket.id, Nickname: user.Nickname, Time: user.time, invitation: true };
               this.io.to(socket.id).emit('userData', user);
            };

            this.SendingListUsersEveryone();
         });

         //chat 
         socket.on('sendMessage', (message: sendMessage): void => {
            this.io.emit('sendEveryoneMessage', message);
         });

         // invitation the Game
         //V1 ============================================================================================
         socket.on('invitationGame', (data): void => {

            // remove the user from invitation access
            const userRival = this.searchUser(data.userRival);

            this.io.to((userRival as socketId).socketId).emit('goToGame', { userRival, userSender: this.searchUser(data.userSender) });
         });

         //V2 ============================================================================================
         // socket.on('invitationGame', (data): void => {
         //    this.Logger.log(this.usersOnline);
         //    // remove the user from invitation access
         //    const userRival = this.searchUser(data.userRival);

         //    if (userRival === undefined) {

         //       this.Logger.log(this.usersOnline);
         //       this.Logger.log('userRival: undefined');
         //       this.io.to(data.userSender.socketId).emit('invitationUser', false);
         //       return;
         //    }
         //    if (userRival.invitation) {
         //       this.io.to((userRival as socketId).socketId).emit('goToGame', { userRival, userSender: this.searchUser(data.userSender) });
         //       // this.io.to(userRival.socketId).emit('goToGame', { userRival, userSender: this.searchUser(data.userSender) });

         //       //remove custom invitation
         //       //ТУТ ПЕРЕВЕСТИ В ФУНКЦИЮ 

         //       this.usersOnline[userRival.id].invitation = false;
         //       this.usersOnline[data.userSender.socketId].invitation = false;

         //    } else {
         //       this.io.to(data.userSender.socketId).emit('invitationUser', false);
         //    }
         // });


         socket.on('resultInvitationToGame', (data): void => {
            const userSender = { ...data.usersData.userSender, Symbol: 'X', stepGame: true };
            const userRival = { ...data.usersData.userRival, Symbol: 'O', stepGame: false };

            if (userSender != undefined && userRival != undefined) {

               const newGameRoom: GameRoom = {
                  userSender: userSender.socketId,
                  userRival: userRival.socketId
               };

               this.gameRooms[userSender.socketId + userRival.socketId] = newGameRoom;

               //result TRUE
               if (data.result) {

                  this.io.to(userRival.socketId).emit('startGame', { stepGame: true, Symbol: 'X', data: { userRival, userSender } });
                  this.io.to(userSender.socketId).emit('startGame', { stepGame: false, Symbol: 'O', users: { userRival, userSender } });

                  //delete list users online
                  this.Logger.log(`join the game ${userRival.socketId} and ${userSender.socketId} `)//room:${room} ???

                  delete this.usersOnline[userRival.socketId];
                  delete this.usersOnline[userSender.socketId];
                  this.SendingListUsersEveryone();

                  //result False
               } else {
                  this.io.to((userSender as socketId).socketId).emit('rejected', { result: false });
               }
            } else {
               this.Logger.error('userRival or userSearch undefined');
            };
         });

         socket.on('stepGame', ({ sender, data, updatedCells }): void => {
            let newStepGameSender, newStepGameRival;

            if (sender.Nickname === data.userSender.Nickname) {
               newStepGameSender = !data.userSender.stepGame;
               newStepGameRival = !data.userRival.stepGame;
            } else {
               newStepGameSender = !data.userRival.stepGame;
               newStepGameRival = !data.userSender.stepGame;
            };

            let newUserRival = { ...data.userRival, stepGame: newStepGameRival };
            let newUserSender = { ...data.userSender, stepGame: newStepGameSender };

            const sendGameResultAndDeleteRoom = (socketId: string, cells: string[], isWinner: string | boolean) => {
               this.io.to(socketId).emit('gameResult', { Cells: cells, isWinner });
               delete this.gameRooms[data.userSender.socketId + data.userRival.socketId];
               this.returnUserList(data.userRival, data.userSender);
            };

            //check uses on victory
            if (checkWin(updatedCells)) {
               const isSenderWinner = sender.symbol === data.userSender.Symbol;
               sendGameResultAndDeleteRoom(data.userSender.socketId, updatedCells, !isSenderWinner);
               sendGameResultAndDeleteRoom(data.userRival.socketId, updatedCells, isSenderWinner);
            } else if (updatedCells.every((el: string) => el !== '')) {
               sendGameResultAndDeleteRoom(data.userSender.socketId, updatedCells, 'nobody');
               sendGameResultAndDeleteRoom(data.userRival.socketId, updatedCells, 'nobody');
            } else {
               this.io.to(newUserRival.socketId).emit('updateCells', { Cells: updatedCells, stepGame: newUserRival.stepGame, data });
               this.io.to(newUserSender.socketId).emit('updateCells', { Cells: updatedCells, stepGame: newUserSender.stepGame, data });
            }
         });

         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   };

   // messages(): {

   // }

   // sendTimeRoom(rivalSocketId: string, senderSocketId: string): void {
   //    const timeString = timerForGame(roomTimers, roomName);


   //    setInterval(() => {
   //       this.io.to(rivalSocketId).emit('timerUpdate', timeString);
   //       this.io.to(senderSocketId).emit('timerUpdate', timeString);
   //    }, 1000);
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

   // flipInvitation(userRival: UserData, userSender: UserData): boolean {
   //    this.usersOnline.[userRival.socketId].invitation = false;
   //    this.usersOnline.[userSender.socketId].invitation = false;
   // }


   // flipInvitation(userRival: UserData, userSender: UserData): boolean {
   //    // Check if both users are online
   //    if (this.usersOnline[userRival.socketId] && this.usersOnline[userSender.socketId]) {
   //       // Set invitation status to false for userRival
   //       this.usersOnline[userRival.socketId].invitation = false;
   //       this.usersOnline[userSender.socketId].invitation = false;

   //       return true;
   //    } else {
   //       return false;
   //    }
   // }


   returnUserList = (userRival: socketId, userSender: socketId): void => {
      this.usersOnline[userRival.socketId] = userRival;
      this.usersOnline[userSender.socketId] = userSender;

      this.SendingListUsersEveryone();
   }

   leaveRoomGame = (socketId: string, gameRooms: object): void => {
      if (gameRooms) {
         for (const room of Object.values(gameRooms)) {
            if (room.userRival === socketId) {
               this.io.to(room.userSender).emit('opponentRanAway', { message: 'Opponent Ran Away' });
               delete this.gameRooms[room.userSender + room.userRival];
               this.SendingListUsersEveryone();
            } else if (room.userSender === socketId) {
               this.io.to(room.userRival).emit('opponentRanAway', { message: 'Opponent Ran Away' });
               delete this.gameRooms[room.userSender + room.userRival];
               this.SendingListUsersEveryone();
            }
         }
      };
   };

   disconnect(socket: Socket): void {
      this.Logger.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.SendingListUsersEveryone();
      this.leaveRoomGame(socket.id, this.gameRooms)
   };
};

export default SocketServer;


