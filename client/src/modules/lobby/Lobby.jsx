import './Lobby.scss'
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { EntranceLobby } from '../../App';

import LobbyChat from './controller/chat/LobbyChat';
import LobbyList from './controller/list/LobbyList';

function Lobby() {
   const { showAuthorization, setShowAuthorization } = useContext(EntranceLobby);

   const { SocketFormData } = useContext(EntranceLobby);
   const [socket, setSocket] = useState(null);
   const [userData, setUserData] = useState('');

   useEffect(() => {

      const Socket = io('');
      setSocket(Socket);

      const switchOff = () => {
         setShowAuthorization(!showAuthorization);
      }

      const handleToGetUserData = ({ user }) => {
         console.log(user)
         // return setUserData(user);
      };

      Socket.on('undefined', switchOff)
      Socket.on('userData', handleToGetUserData);
      return () => {
         Socket.off('userData', handleToGetUserData);
         Socket.off('undefined', switchOff)
      }
   }, []);


   return (
      <div className='lobby'>
         <LobbyChat />
         <LobbyList />
      </div>
   )
};
// user={userData}
export default Lobby;




// const socket = io({
//    transportOptions: {
//       polling: {
//          extraHeaders: {
//             'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//          },
//       },
//    },
// });