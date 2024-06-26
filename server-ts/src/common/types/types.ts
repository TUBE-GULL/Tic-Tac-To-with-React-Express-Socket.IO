//export Interfaces !!! ================================================

export interface GameRoom {
   Sender: gameUser;
   Rival: gameUser;
   timerInterval: NodeJS.Timeout | null;
   timerValue: string;
}

interface gameUser extends UserOnline {
   stepGame: boolean,
   Symbol: string,
}

export interface UsersOnline {
   [socketId: string]: UserOnline;
}

export interface UserData {
   id: string | number;
   Nickname: string;
   Time: string;
}

export interface UserOnline extends UserData {
   socketId: string;
   invitation: boolean;
}

export interface UserGame extends UserOnline {
   Symbol: string;
   stepGame: boolean;
}

export interface UsersData {
   Rival: UserOnline;
   Sender: UserOnline;
}

export interface FormData {
   Nickname: string,
   password: string,
}

export interface writeFileData {
   id: number,
   Nickname: string,
   password: string,
   time: string
}

export interface RoomTimers {
   [roomName: string]: {
      minutes: number;
      seconds: number;
      miniSeconds: number;
   };
}

export interface sendMessage {
   message: string,
   userName: string,
   userTime: string
};

//export Types !!! =====================================================

export type CheckWinFunction = (cells: string[]) => boolean;

export type TimerForGameFunction = (roomTimers: RoomTimers, roomName: string) => string;