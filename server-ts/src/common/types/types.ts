//export Interfaces !!! ================================================

export interface GameRoom {
   Sender: string;
   Rival: string;
   timerInterval: NodeJS.Timeout | null;
   timerValue: string;
}

export interface UsersOnline {
   [socketId: string]: UserOnline;
}

export interface UserOnline {
   socketId: string;
   id: string | number;
   Nickname: string;
   Time: string;
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