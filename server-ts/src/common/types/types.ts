//export Interfaces !!! ================================================

export interface GameRoom {
   userSender: string;
   userRival: string;
   timerInterval: NodeJS.Timeout | null;
   timerValue: string;
}

export interface UsersOnline {
   [socketId: string]: UserOnline;
}

export interface UserOnline {
   socketId: string;
   Nickname: string;
   Time: string;
   invitation: boolean;
}

export interface UserData {
   id: string | number;
   Nickname: string;
   password?: string | number;
   time: string;
   invitation?: boolean;
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