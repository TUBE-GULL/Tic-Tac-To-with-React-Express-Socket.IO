import './Lobby.scss'
import React, { useContext, useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { EntranceLobby } from '../../App';

import LobbyChat from './controller/chat/LobbyChat';
import LobbyList from './controller/list/LobbyList';


function Lobby() {
   const { showAuthorization, setShowAuthorization } = useContext(EntranceLobby);
   const { SocketFormData } = useContext(EntranceLobby);
   const [socket, setSocket] = useState(null);
   const [userData, setUserData] = useState('');
   const [usersData, setUsersData] = useState('');
   const [messages, setMessages] = useState([]);
   const [messageInput, setMessageInput] = useState('');

   useEffect(() => {
      const Socket = io('');
      setSocket(Socket);

      const switchOff = () => {
         console.log('undefined')
         setShowAuthorization(!showAuthorization);
      }

      const updateUserData = (user) => {
         console.log(user)
         setUserData(user);
      };

      const updateListUsers = (users) => {
         setUsersData(users);
      };
      const updateMessages = (exportMessage) => {
         setMessages((prevMessages) => [...prevMessages, exportMessage]);
      };

      Socket.on('undefined', switchOff);
      Socket.on('userData', updateUserData);
      Socket.on('usersOnline', updateListUsers);
      Socket.on('sendEveryoneMessage', updateMessages);
      return () => {
         Socket.off('undefined', switchOff);
         Socket.off('userData', updateUserData);
         Socket.off('usersOnline', updateListUsers);
         Socket.off('sendEveryoneMessage', updateMessages);

         Socket.close();
      };
   }, [setSocket]);


   const sendMessage = (message) => {
      if (message !== '') {
         socket.emit('sendMessage', message);
      }
   }

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

   return (
      <div className='lobby'>
         <LobbyChat newMessages={messages} handleSubmit={handleSubmit} handleMessageInputChange={handleMessageInputChange} />
         <LobbyList user={userData} users={usersData} />
      </div >
   )
}

export default Lobby;

// user={userData}
// const socket = io({
//    transportOptions: {
//       polling: {
//          extraHeaders: {
//             'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//          },
//       },
//    },
// });