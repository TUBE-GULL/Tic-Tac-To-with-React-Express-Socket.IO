import './Lobby.scss'
import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { EntranceLobby } from '../../App';

import LobbyChat from './controller/chat/LobbyChat';
import LobbyList from './controller/list/LoddyList';

function Lobby() {
   const { SocketFormData } = useContext(EntranceLobby);

   useEffect(() => {
      const socket = io({
         transportOptions: {
            polling: {
               extraHeaders: {
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
               },
            },
         },
      });

   }, [])


   return (
      <div className='lobby'>
         <LobbyChat />
         <LobbyList />
      </div>
   )
};

export default Lobby;