//export Interfaces !!! ================================================

export interface socketId {
   socketId: string;
   Nickname: string;
   Time: string;
}

export interface UserData {
   id: string | number;
   Nickname: string;
   password?: string | number;
   time: string;
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


//export Types !!! =====================================================