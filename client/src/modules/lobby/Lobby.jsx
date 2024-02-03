import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { EntranceLobby } from '../../App';


export default function Lobby() {
   const { SocketFormData } = useContext(EntranceLobby);

   return (
      < h1 > hi in Lobby</h1 >
   )
}