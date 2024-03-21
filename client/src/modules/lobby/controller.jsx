import './Lobby.scss'
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { EntranceLobby } from '../../App';

//modules
import LobbyChat from './controller/chat/LobbyChat';
import LobbyList from './controller/list/LobbyList';
import GameFiled from './controller/game/GameFiled';

export const StartGame = React.createContext()
function Lobby() {
   const { showAuthorization, setShowAuthorization } = useContext(EntranceLobby);
   const [inGame, setInGame] = useState(false);
   const [socket, setSocket] = useState(null);
   const [userData, setUserData] = useState('');
   const [usersData, setUsersData] = useState('');
   const [messages, setMessages] = useState([]);
   const [messageInput, setMessageInput] = useState('');
   const [data, setData] = useState('');
   const [stepGame, setStepGame] = useState(false);
   const [cells, setCells] = useState(Array(9).fill(''));

   const clickCell = (index) => {
      console.log(index)
      console.log(data)
      console.log(data.Symbol)

      if (stepGame) {
         const updatedCells = [...cells];
         updatedCells[index] = data.user.Symbol;
         setCells(updatedCells);


         socket.emit('stepGame', { users: data, updatedCells });

         //ban on step
         setStepGame(false);
      }
   };

   const updateCells = ({ Cells, stepGame }) => {
      console.log('updateCells')
      // console.log(data)
      setCells(Cells)
      // setData(data);
      setStepGame(stepGame)
   }

   useEffect(() => {
      const Socket = io('');
      setSocket(Socket);

      const switchOff = () => {
         console.log('undefined')
         setShowAuthorization(!showAuthorization);
      };

      const updateUserData = (user) => {
         // console.log(user)
         Socket.emit('userData', user);
         setUserData(user);
      };

      const updateListUsers = (users) => {
         setUsersData(users);
      };
      const updateMessages = (exportMessage) => {
         setMessages((prevMessages) => [...prevMessages, exportMessage]);
      };

      const noticeGoGame = (usersData) => {
         window.confirm('Want to jump into the game?')
            ? Socket.emit('resultInvitationToGame', { result: true, usersData })
            : Socket.emit('resultInvitationToGame', { result: false, usersData })
      };

      // тут менять страницу 
      const startGame = (data) => {
         console.log('start');
         console.log(data);
         setStepGame(data.user.stepGame)
         setData(data);
         setInGame(true);
      }

      //отказ
      const rejected = () => {
         console.log('rejected')
      }
      // const invitationGame = (data) => {
      //    console.log('Получено приглашение:', data);
      // }
      // const sendMessage = (message) => {
      //    console.log('смс отправлено ');
      // }

      // socket.on('sendMessage', sendMessage);
      // socket.on('invitationGame', invitationGame);
      Socket.on('updateCells', updateCells)
      Socket.on('rejected', rejected)
      Socket.on('startGame', startGame);
      Socket.on('goToGame', noticeGoGame);
      Socket.on('undefined', switchOff);
      Socket.on('userFormData', updateUserData);
      Socket.on('usersOnline', updateListUsers);
      Socket.on('sendEveryoneMessage', updateMessages);
      return () => {
         Socket.off('updateCells', updateCells)
         Socket.off('rejected', rejected)
         Socket.off('startGame', noticeGoGame);
         Socket.off('goToGame', noticeGoGame);
         Socket.off('undefined', switchOff);
         Socket.off('userFormData', updateUserData);
         Socket.off('usersOnline', updateListUsers);
         Socket.off('sendEveryoneMessage', updateMessages);

         // socket.off('sendMessage');
         // socket.off('invitationGame');
         Socket.close();
      };
   }, [setSocket]);

   const sendMessage = (message) => {
      if (message !== '') {

         socket.emit('sendMessage', { message });
      }
   };

   const handleMessageInputChange = (e) => {
      setMessageInput(e.target.value);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      console.log(messages)

      sendMessage({
         message: messageInput,
         userName: userData.Nickname,
         userTime: userData.time
      });
      setMessageInput('');
   };

   const handleButtonClick = (userId, userNickname, userTime) => {
      const userRival = {
         id: userId,
         Nickname: userNickname,
         time: userTime,
      }

      socket.emit('invitationGame', { userSender: userData, userRival: userRival });
      // console.log("Clicked on user:", userId, userNickname, userTime);
   };

   return (
      <StartGame.Provider value={{ inGame, setInGame, cells, setCells }}>
         {!inGame && < div className='lobby'>
            <LobbyChat newMessages={messages} handleSubmit={handleSubmit} handleMessageInputChange={handleMessageInputChange} />
            <LobbyList user={userData} users={usersData} onButtonClick={handleButtonClick} />
         </div >}
         {inGame && < GameFiled clickCell={clickCell} data={data} />}
      </StartGame.Provider >
   )
}

export default Lobby;
