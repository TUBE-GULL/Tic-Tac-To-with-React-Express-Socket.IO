import './Lobby.scss'
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { EntranceLobby } from '../../App';

import LobbyChat from './controller/chat/LobbyChat';
import LobbyList from './controller/list/LobbyList';

function Lobby() {
   const { SocketFormData } = useContext(EntranceLobby);
   const [socket, setSocket] = useState(null);
   const [userData, setUserData] = useState('');

   useEffect(() => {

      const newSocket = io('');
      setSocket(newSocket);

      // const socket = io({
      //    transportOptions: {
      //       polling: {
      //          extraHeaders: {
      //             'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //          },
      //       },
      //    },
      // });

      const handleToGetUserData = ({ user }) => {
         console.log(user)
         return setUserData(user);
      };

      newSocket.on('userData', handleToGetUserData);

      return () => {
         newSocket.off('userData', handleToGetUserData);
      }
   }, []);


   return (
      <div className='lobby'>
         <LobbyChat />
         <LobbyList />
      </div>
   )
};

export default Lobby;