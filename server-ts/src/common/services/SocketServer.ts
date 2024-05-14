import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { UserData, GameRoom, sendMessage, CheckWinFunction, UsersOnline, UserOnline, UserGame } from '../types/types.js';
import checkWin from '../modules/gameFun.js';
import logger from '../../loggers/logger.service.js'
import timerForGame from '../modules/timerForGame.js';
import writeFileData from '../modules/writeFileJson.js';
import readFileJson from '../modules/readFileJson.js'

class SocketServer {
   io: SocketIOServer;
   usersOnline: UsersOnline;
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

   //main function
   initializeSocketEvents(): void {
      this.io.on('connection', (socket: Socket) => {
         // this.Logger.log('connection: ' + socket.id);S
         socket.emit('connectUser');

         //send in client data 
         socket.on('userData', (user: UserData): void => {
            this.Logger.log(user)
            this.Logger.log(this.usersOnline)
            // this.Logger.log(this.gameRooms)  

            const userId = user.id;
            if (!this.checkUserOnline(userId)) {
               console.log(user)
               const userOnline: UserOnline = {
                  socketId: socket.id,
                  id: user.id,
                  Nickname: user.Nickname,
                  Time: user.Time,
                  invitation: true
               }

               this.usersOnline[userId] = userOnline;
               this.sendAllModifiedListUserOnline();
            } else {
               // add function send sing in 
               this.io.to(socket.id).emit('resetSingIn');
            }
         });

         // chat 
         socket.on('sendMessage', (message: sendMessage): void => {
            this.io.emit('sendEveryoneMessage', message);
         });

         socket.on('invitationGame', ({ userSender, userRival }): void => {
            const Sender: UserOnline | undefined = this.searchUser(userSender);
            const Rival: UserOnline | undefined = this.searchUser(userRival);


            if (Sender != undefined && Rival != undefined) {
               this.usersOnline[Sender.id].invitation = false;
               this.usersOnline[Rival.id].invitation = false;

               //locked on invitation and invite
               this.waitInvitation(Rival.socketId, Sender.socketId, false)
               // this.io.to(Rival.socketId).emit('waitInvitation', false);
               // this.io.to(Sender.socketId).emit('waitInvitation', false);
               this.io.to(Rival.socketId).emit('goToGame', { Rival, Sender })
            }
            if (Rival == undefined) {
               this.io.to(userSender.socketId).emit('invitationUser', { answer: false, sms: 'he/she is not online' });
            }
         });

         socket.on('resultInvitationToGame', ({ result, usersData }): void => {
            // this.Logger.log(usersData);

            const Sender: UserGame = {
               ...usersData.Sender,
               Symbol: 'X',
               stepGame: true
            };
            const Rival: UserGame = {
               ...usersData.Rival,
               Symbol: 'O',
               stepGame: false
            };

            if (Sender != undefined && Rival != undefined) {

               //result True
               if (result) {
                  const roomId = Sender.socketId + Rival.socketId;
                  const newGameRoom: GameRoom = {
                     Sender: { ...Sender, stepGame: true, Symbol: 'X' },
                     Rival: { ...Rival, stepGame: false, Symbol: 'O' },
                     timerInterval: null,
                     timerValue: '',
                  };

                  this.gameRooms[roomId] = newGameRoom;
                  this.io.to(Rival.socketId).emit('startGame', {
                     stepGame: newGameRoom.Sender.stepGame,
                     Symbol: newGameRoom.Sender.Symbol,
                     data: { Sender, Rival, roomId }
                  });
                  this.io.to(Sender.socketId).emit('startGame', {
                     stepGame: newGameRoom.Rival.stepGame,
                     Symbol: newGameRoom.Rival.Symbol,
                     data: { Sender, Rival, roomId }
                  });
                  this.sendTimeRoom(roomId);

                  //delete list users online
                  delete this.usersOnline[Rival.id];
                  delete this.usersOnline[Sender.id];
                  this.sendAllModifiedListUserOnline();

                  //result false
               } else {
                  this.waitInvitation(Rival.socketId, Sender.socketId, true)
                  this.io.to(Sender.socketId).emit('invitationUser', { answer: false, sms: 'he/she is busy' });
               }
            } else {
               this.Logger.error('userRival or userSearch undefined');
               // !!!!
               if (Sender !== undefined && Rival === undefined) {
                  /// ADD
                  this.io.to(Sender.socketId).emit('invitationUser', true);
               };
               if (Sender === undefined && Rival !== undefined) {
                  /// ADD
                  this.io.to(Rival.socketId).emit('invitationUser', true);
               };
            }
         })

         socket.on('stepGame', ({ sender, data, updatedCells }): void => {
            let newStepGameSender, newStepGameRival;

            if (sender.Nickname === data.Sender.Nickname) {
               newStepGameSender = !data.Sender.stepGame;
               newStepGameRival = !data.Rival.stepGame;
            } else {
               newStepGameSender = !data.Rival.stepGame;
               newStepGameRival = !data.Sender.stepGame;
            };

            let newRival = { ...data.Rival, StepGame: newStepGameRival };
            let newSender = { ...data.Sender, StepGame: newStepGameSender };
            const room: GameRoom = this.gameRooms[data.roomId];

            const sendGameResultAndDeleteRoom = (nickName: string, socketId: string, cells: string[], isWinner: string | boolean) => {
               this.io.to(socketId).emit('gameResult', { Cells: cells, isWinner });
               this.stopTimeRoom(data.Sender.socketId + data.Rival.socketId);
               // this.returnUserList(data.Rival, data.Sender);
               this.sendAllModifiedListUserOnline();
               delete this.gameRooms[data.Sender.socketId + data.Rival.socketId];
            };

            this.io.to(newRival.socketId).emit('updateCells', { Cells: updatedCells, stepGame: newStepGameRival, data });
            this.io.to(newSender.socketId).emit('updateCells', { Cells: updatedCells, stepGame: newStepGameSender, data });

            if (checkWin(updatedCells)) {
               const isSenderWinner = sender.symbol === data.Sender.Symbol;
               sendGameResultAndDeleteRoom(data.Sender.Nickname, data.Sender.socketId, updatedCells, !isSenderWinner);
               sendGameResultAndDeleteRoom(data.Rival.Nickname, data.Rival.socketId, updatedCells, isSenderWinner);

               if (!isSenderWinner) {
                  this.writeBestTime(room, data.Sender.Nickname)
               } else {
                  this.writeBestTime(room, data.Rival.Nickname)
               }
            } else if (updatedCells.every((el: string) => el !== '')) {
               sendGameResultAndDeleteRoom('nobody', data.Sender.socketId, updatedCells, 'nobody');
               sendGameResultAndDeleteRoom('nobody', data.Rival.socketId, updatedCells, 'nobody');
               // this.returnUserList(data.userSender.socketId, data.userRival.socketId);
            }
         });

         socket.on('disconnect', () => {
            this.disconnect(socket);
         });
      });
   };

   private writeBestTime = async (room: GameRoom, Nickname: string): Promise<void> => {
      const userData = await readFileJson('../data/data.json');

      const newUserData = userData.map((user: UserOnline) => {
         if (user.Nickname === Nickname) {
            if (user.Time < room.timerValue) {
               user.Time = room.timerValue
            }
         };
      });
      await writeFileData(userData, '../data/data.json')
   };

   // mailing to everyone  about adding/removing  a new user
   private sendAllModifiedListUserOnline(): void {
      this.io.emit('usersOnline', this.usersOnline); // all users
   };

   private waitInvitation(socketIdR: string, socketIdS: string, answer: boolean): void {
      this.io.to(socketIdR).emit('waitInvitation', answer);
      this.io.to(socketIdS).emit('waitInvitation', answer);
   };

   private returnUserList = (userRival: UserOnline, userSender: UserOnline): void => {
      this.usersOnline[userRival.socketId] = userRival;
      this.usersOnline[userSender.socketId] = userSender;
      this.sendAllModifiedListUserOnline();
   };

   private checkUserOnline(userId: string | number): boolean {
      const users = Object.values(this.usersOnline);

      for (let user of users) {
         if (typeof userId === 'string' && user.id === userId) {
            return true;
         }
         if (typeof userId === 'number' && user.id === userId) {
            return true;
         };
      };
      return false;
   };

   private searchUser(data: { Nickname?: string, socketId?: string, }): UserOnline | undefined {
      const users = Object.values(this.usersOnline);

      if (data.Nickname !== undefined) {
         return users.find(user => user.Nickname === data.Nickname);
      }
      if (data.socketId !== undefined) {
         return users.find(user => user.socketId === data.socketId);
      }

      return undefined
   };

   private sendTimeRoom(gameRoom: string): void {
      const room = this.gameRooms[gameRoom];
      if (room && room.timerInterval) {
         clearInterval(room.timerInterval);
      }
      if (room) {
         room.timerInterval = setInterval(() => {
            const timeString = timerForGame();

            room.timerValue = timeString;
            this.io.to(room.Rival.socketId).emit('timerUpdate', timeString);
            this.io.to(room.Sender.socketId).emit('timerUpdate', timeString);
         }, 100);
      }
   };

   private stopTimeRoom(gameRoom: string): void {
      // this.Logger.log('timer stop');
      const room = this.gameRooms[gameRoom];
      if (room && room.timerInterval) {
         clearInterval(room.timerInterval);
         // return room.timerInterval
         room.timerInterval = null;
      };
   };

   private leaveRoomGame = (socketId: string, gameRooms: object): void => {
      if (gameRooms) {
         for (const room of Object.values(gameRooms)) {
            if (room.Rival.socketId === socketId) {
               this.io.to(room.Sender.socketId).emit('opponentRanAway', { message: 'Opponent Ran Away' });
               this.stopTimeRoom(room.Sender.socketId + room.Rival.socketId)
               delete this.gameRooms[room.Sender.socketId + room.Rival.socketId];
               this.sendAllModifiedListUserOnline();
            } else if (room.Sender.socketId === socketId) {
               this.io.to(room.Rival.socketId).emit('opponentRanAway', { message: 'Opponent Ran Away' });
               this.stopTimeRoom(room.Sender.socketId + room.Rival.socketId)
               delete this.gameRooms[room.Sender.socketId + room.Rival.socketId];
               this.sendAllModifiedListUserOnline();
            }
         }
      };
   };

   private disconnect(socket: Socket): void {
      const disconnectUser = this.searchUser({ socketId: socket.id });
      this.Logger.log('User disconnected: ' + socket.id);

      if (disconnectUser) {
         delete this.usersOnline[disconnectUser.id];
      };
      this.sendAllModifiedListUserOnline();
      this.leaveRoomGame(socket.id, this.gameRooms)
   };
};

export default SocketServer;
