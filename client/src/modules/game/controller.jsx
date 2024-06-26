import './Lobby.scss'
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { EntranceLobby } from '../../App';

//modules
import LobbyChat from './components/chat/LobbyChat';
import LobbyList from './components/list/LobbyList';
import GameFiled from './components/game/GameFiled';
export const StartGame = React.createContext();

function Lobby() {
   const { userData } = useContext(EntranceLobby);
   const [inGame, setInGame] = useState(false);
   const [socket, setSocket] = useState(null);
   const [usersData, setUsersData] = useState('');
   const [messages, setMessages] = useState([]);
   const [data, setData] = useState('');
   const [stepGame, setStepGame] = useState(false);
   const [cells, setCells] = useState(Array(9).fill(''));
   const [symbol, setSymbol] = useState('');
   const [timer, setTimer] = useState('00:00:00')
   const [buttonClick, setButtonClick] = useState(true);

   useEffect(() => {
      const Socket = io('');
      setSocket(Socket);

      Socket.on('connectUser', () => {
         Socket.emit('userData', userData);
      });

      const updateListUsers = (users) => {
         setUsersData(users);
      };
      const updateMessages = (message) => {
         setMessages((prevMessages) => [...prevMessages, message]);
      };

      const noticeGoGame = (usersData) => {
         window.confirm('Want to jump into the game?')
            ? Socket.emit('resultInvitationToGame', { result: true, usersData })
            : Socket.emit('resultInvitationToGame', { result: false, usersData })
      };

      const startGame = ({ stepGame, Symbol, data }) => {
         setStepGame(stepGame)
         setData(data);
         setSymbol(Symbol);
         setInGame(true);
      };

      const rejected = (message) => {
         console.log('rejected')
         alert(message)
      };

      const gameResult = ({ cells, isWinner }) => {
         setInGame(false);
         setCells(cells)
         switch (isWinner) {
            case true:
               alert('you win! 🙂');
               break;
            case false:
               alert('You lose! 😞');
               break;
            case 'nobody':
               alert('no one win! 😕');
               break;
         }
         window.location.reload();
      };

      const opponentRanAway = ({ message }) => {
         alert(message)
         setInGame(false);
         window.location.reload();
      };

      const invitationUser = ({ answer, sms }) => {
         alert(sms)
         setInGame(answer)
      };

      const timerUpdate = (time) => {
         setTimer(time)
      }

      const waitInvitation = (res) => {
         console.log(res)
         setButtonClick(res)
      };

      Socket.on('waitInvitation', waitInvitation);
      Socket.on('timerUpdate', timerUpdate);
      Socket.on('invitationUser', invitationUser);
      Socket.on('gameCancelled', rejected);//?
      Socket.on('opponentRanAway', opponentRanAway);
      Socket.on('leaveGame', leaveGame);
      Socket.on('gameResult', gameResult);
      Socket.on('updateCells', updateCells);
      Socket.on('rejected', rejected);
      Socket.on('startGame', startGame);
      Socket.on('goToGame', noticeGoGame);
      Socket.on('usersOnline', updateListUsers);
      Socket.on('sendEveryoneMessage', updateMessages);
      return () => {
         Socket.off('waitInvitation', waitInvitation);
         Socket.off('timerUpdate', timerUpdate)
         Socket.off('invitationUser', invitationUser);
         Socket.off('gameCancelled', rejected)//?
         Socket.off('opponentRanAway', opponentRanAway);
         Socket.off('leaveGame', leaveGame);
         Socket.off('victory', gameResult);
         Socket.off('updateCells', updateCells);
         Socket.off('rejected', rejected);
         Socket.off('startGame', startGame);
         Socket.off('goToGame', noticeGoGame);
         Socket.off('usersOnline', updateListUsers);
         Socket.off('sendEveryoneMessage', updateMessages);
         Socket.close();
      };
   }, [setSocket]);

   // Game choice user 
   const clickCell = (index) => {
      if (stepGame) {
         if (cells[index] == '') {
            const updatedCells = [...cells];
            updatedCells[index] = symbol;
            setCells(updatedCells);
            socket.emit('stepGame', { sender: { Nickname: userData.Nickname, symbol: symbol }, data, updatedCells });
         }
      }
   };

   const updateCells = ({ Cells, stepGame, data }) => {
      setCells(Cells)
      setData(data);
      setStepGame(stepGame)
   }

   const handleSubmitMessage = (message) => {
      socket.emit('sendMessage', {
         message: message,
         userName: userData.Nickname,
         userTime: userData.Time
      });
   };

   const handleButtonClick = (socketId, userId, userNickname, userTime) => {
      const Rival = {
         socketId,
         id: userId,
         Nickname: userNickname,
         Time: userTime,
      };
      if (buttonClick) {
         socket.emit('invitationGame', { userSender: userData, userRival: Rival });
         setButtonClick(!buttonClick);
      } else {
         alert('waiting for an answer !')
      }
   };

   const leaveGame = () => {
      socket.emit('leaveGame', { Rival: data.userRival, Sender: data.userSender });
      setInGame(false);
   };

   return (
      <StartGame.Provider value={{ inGame, setInGame, cells, setCells, messages }}>
         {!inGame && < div className='lobby'>
            <LobbyChat Nickname={userData.Nickname} newMessages={messages} handleSubmit={handleSubmitMessage} />
            <LobbyList user={userData} users={usersData} onButtonClick={handleButtonClick} />
         </div >}
         {inGame && < GameFiled clickCell={clickCell} data={data} time={timer} />}
      </StartGame.Provider >
   )
}

export default Lobby;