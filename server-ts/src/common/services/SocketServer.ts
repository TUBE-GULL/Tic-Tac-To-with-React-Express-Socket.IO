import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, SocketUser, GameRoom, sendMessage, CheckWinFunction } from '../types/types.js';
import checkWin from '../modules/gameFun.js';
import logger from '../../loggers/logger.service.js'
import timerForGame from '../modules/timerForGame.js';
import writeFileData from '../modules/writeFileJson.js';
import readFileJson from '../modules/readFileJson.js'

class SocketServer {
   io: SocketIOServer;
   usersOnline: Record<string, SocketUser>;
   gameRooms: Record<string, GameRoom>;
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
         this.io.to(socket.id).emit('userFormData', user);
      });
   };

   initializeSocketEvents(): void {
      this.io.on('connection', (socket: Socket) => {
         // this.Logger.log('connection: ' + socket.id);

         // send all users list users online
         socket.on('userData', (user: UserData): void => {
            if (!this.isUserOnline(user.id.toString())) {
               this.usersOnline[socket.id] = { socketId: socket.id, Nickname: user.Nickname, Time: user.time, invitation: true } as SocketUser;
            };

            this.SendingListUsersEveryone();
         });

         //chat 
         socket.on('sendMessage', (message: sendMessage): void => {
            this.io.emit('sendEveryoneMessage', message);
         });

         // invitation the Game
         socket.on('invitationGame', (data): void => {

            // remove the user from invitation access
            if (!this.searchUser(data.userRival) && !this.searchUser(data.userSender)) {
               this.io.to(data.userSender.socketId).emit('invitationUser', false);
               return;
            };

            const userSender: SocketUser | undefined = this.searchUser(data.userSender) as SocketUser | undefined;
            const userRival: SocketUser | undefined = this.searchUser(data.userRival) as SocketUser | undefined;

            if (userSender && userRival && userRival.invitation) {
               //remove custom invitation
               if (userRival.socketId && userSender.socketId) {
                  this.usersOnline[userRival.socketId].invitation = false;
                  this.usersOnline[userSender.socketId].invitation = false;
               }

               this.io.to(userRival.socketId).emit('goToGame', { userRival, userSender });

            } else {
               if (userSender) {
                  this.io.to(userSender.socketId).emit('invitationUser', false);
               }
            }
         });

         socket.on('resultInvitationToGame', (data): void => {
            const userSender = { ...data.usersData.userSender, Symbol: 'X', stepGame: true };
            const userRival = { ...data.usersData.userRival, Symbol: 'O', stepGame: false };

            if (userSender != undefined && userRival != undefined) {

               //result TRUE
               if (data.result) {

                  const newGameRoom: GameRoom = {
                     userSender: userSender.socketId,
                     userRival: userRival.socketId,
                     timerInterval: null,
                     timerValue: '',
                  };

                  this.gameRooms[userSender.socketId + userRival.socketId] = newGameRoom;
                  this.io.to(userRival.socketId).emit('startGame', { stepGame: true, Symbol: 'X', data: { userRival, userSender, roomId: (userSender.socketId + userRival.socketId) } });
                  this.io.to(userSender.socketId).emit('startGame', { stepGame: false, Symbol: 'O', data: { userRival, userSender, roomId: (userSender.socketId + userRival.socketId) } });
                  this.sendTimeRoom(userSender.socketId + userRival.socketId);
                  // this.Logger.log(`join the game ${userRival.socketId} and ${userSender.socketId} `);//room:${room} ???

                  //delete list users online
                  delete this.usersOnline[userRival.socketId];
                  delete this.usersOnline[userSender.socketId];
                  this.SendingListUsersEveryone();

                  //result False
               } else {
                  // this.flipInvitation(userRival, userSender)
                  this.io.to(userSender.socketId).emit('rejected', { result: false });
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

            const sendGameResultAndDeleteRoom = (nickName: string, socketId: string, cells: string[], isWinner: string | boolean) => {
               this.io.to(socketId).emit('gameResult', { Cells: cells, isWinner });
               this.stopTimeRoom(data.userSender.socketId + data.userRival.socketId);
               this.returnUserList(data.userRival, data.userSender);


               // this.Logger.log(this.gameRooms);
               const room: GameRoom = this.gameRooms[data.roomId];
               // this.Logger.log(room);
               if (room !== undefined) {
                  // this.Logger.log(room.timerValue);
                  this.writeBestTime(room.timerValue, nickName);

               }

               //best recording time
               if (isWinner && isWinner != 'nobody') {


                  // this.writeBestTime(this.gameRooms[data.userSender.socketId + data.userRival.socketId].timerValue, nickName);
                  // {"_HOJ3K5j6x4LGLJ3AAAP345FMQFEy7XC-05tAAAM":{"userSender":"_HOJ3K5j6x4LGLJ3AAAP","userRival":"345FMQFEy7XC-05tAAAM","timerInterval":null,"timerValue":"00:01:40"}}


                  // for (const roomId in this.gameRooms) {
                  //    const room = this.gameRooms[roomId];
                  //    if (room.userRival == socketId || room.userSender == socketId) {
                  //       this.Logger.log(room.timerValue);
                  //    }
                  // }

               }
               delete this.gameRooms[data.userSender.socketId + data.userRival.socketId];
            };

            //check uses on victory
            if (checkWin(updatedCells)) {
               const isSenderWinner = sender.symbol === data.userSender.Symbol;
               sendGameResultAndDeleteRoom(data.userSender.nickName, data.userSender.socketId, updatedCells, !isSenderWinner);
               sendGameResultAndDeleteRoom(data.userRival.nickName, data.userRival.socketId, updatedCells, isSenderWinner);
            } else if (updatedCells.every((el: string) => el !== '')) {
               sendGameResultAndDeleteRoom('nobody', data.userSender.socketId, updatedCells, 'nobody');
               sendGameResultAndDeleteRoom('nobody', data.userRival.socketId, updatedCells, 'nobody');
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

   sendTimeRoom(gameRoom: string): void {
      const room = this.gameRooms[gameRoom];
      if (room && room.timerInterval) {
         clearInterval(room.timerInterval);
      }
      if (room) {
         room.timerInterval = setInterval(() => {
            const timeString = timerForGame();

            room.timerValue = timeString;
            this.io.to(room.userRival).emit('timerUpdate', timeString);
            this.io.to(room.userSender).emit('timerUpdate', timeString);
         }, 100);
      }
   }

   stopTimeRoom(gameRoom: string): void {
      // this.Logger.log('timer stop');
      const room = this.gameRooms[gameRoom];
      if (room && room.timerInterval) {
         clearInterval(room.timerInterval);
         // return room.timerInterval
         room.timerInterval = null;
      }
   }


   SendingListUsersEveryone(): void {
      this.io.emit('usersOnline', this.usersOnline); // all users
   };

   searchUser(user: any): object | undefined {
      return Object.values(this.usersOnline).find((userObj: any) =>
         userObj.id === user.id || userObj.Nickname === user.Nickname
      );
   };

   isUserOnline(userId: string): boolean {
      const users = Object.values(this.usersOnline);

      for (const userObj of users) {
         if ('id' in userObj && userObj.id === userId) {
            return true;
         }
      }

      return false;
   };


   //------------------------------------------------------------------------------------------------------------
   // flipInvitation(userRival: SocketUser, userSender: SocketUser): boolean {
   //    const rival: any = this.searchUser(userRival);
   //    const sender: any = this.searchUser(userSender);

   //    if (!rival || !sender || !rival.invitation) {
   //       return false;
   //    }

   //    this.io.to(rival.socketId).emit('goToGame', { userRival: rival, userSender: sender });

   //    this.usersOnline[rival.socketId].invitation = !this.usersOnline[rival.socketId].invitation;
   //    this.usersOnline[sender.socketId].invitation = !this.usersOnline[sender.socketId].invitation;

   //    return true;
   // }


   flipInvitation(userRival: SocketUser | undefined = undefined, userSender: SocketUser): void {
      const rival: any = this.searchUser(userRival);
      const sender: any = this.searchUser(userSender);

      if (userRival == undefined) {
         this.usersOnline[sender.socketId].invitation = !this.usersOnline[sender.socketId].invitation;
      } else {
         this.usersOnline[sender.socketId].invitation = !this.usersOnline[sender.socketId].invitation;
         this.usersOnline[rival.socketId].invitation = !this.usersOnline[rival.socketId].invitation;
      }
   }

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

   //------------------------------------------------------------------------------------------------------------

   // writeBestTime = async (roomId: string, Nickname: string): void => {

   //    const bestTime = this.gameRooms[roomId].timerInterval

   //    const userData = await readFileJson('../data/data.json');

   //    const newUserData = userData.find((user: UserData) => {
   //       if (user.Nickname === Nickname) {
   //          if (user.time < bestTime) {
   //             user.time = bestTime
   //          }
   //       };
   //    })
   //    await writeFileData(newUserData, '../data/data.json')
   // };

   writeBestTime = async (bestTime: string, Nickname: string): Promise<void> => {

      this.Logger.log('writeBestTime')
      this.Logger.log(bestTime)

      // if (!bestTime) {
      //    return;
      // };

      const userData = await readFileJson('../data/data.json');

      this.Logger.log(userData);
      const index = userData.findIndex((user: UserData) => user.Nickname === Nickname);
      this.Logger.log(index);

      if (index !== -1) {
         const user = userData[index];
         if (!user.time || user.time < bestTime) {
            user.time = bestTime;
            userData[index] = user;
         }
      }

      this.Logger.log(userData);

      await writeFileData(userData, '../data/data.json');
   };

   returnUserList = (userRival: SocketUser, userSender: SocketUser): void => {
      this.usersOnline[userRival.socketId] = userRival;
      this.usersOnline[userSender.socketId] = userSender;

      this.SendingListUsersEveryone();
   };

   leaveRoomGame = (socketId: string, gameRooms: object): void => {
      if (gameRooms) {
         for (const room of Object.values(gameRooms)) {
            if (room.userRival === socketId) {
               this.io.to(room.userSender).emit('opponentRanAway', { message: 'Opponent Ran Away' });
               this.stopTimeRoom(room.userSender + room.userRival)
               delete this.gameRooms[room.userSender + room.userRival];
               this.SendingListUsersEveryone();
            } else if (room.userSender === socketId) {
               this.io.to(room.userRival).emit('opponentRanAway', { message: 'Opponent Ran Away' });
               this.stopTimeRoom(room.userSender + room.userRival)
               delete this.gameRooms[room.userSender + room.userRival];
               this.SendingListUsersEveryone();
            }
         }
      };
   };

   disconnect(socket: Socket): void {
      // this.Logger.log('User disconnected: ' + socket.id);
      delete this.usersOnline[socket.id];
      this.SendingListUsersEveryone();
      this.leaveRoomGame(socket.id, this.gameRooms)
   };
};

export default SocketServer;


