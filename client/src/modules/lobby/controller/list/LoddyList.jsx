import React, { useContext, useEffect, useState } from 'react';
import User from './modules/User';

function LobbyList(user) {

   return (
      <div className="listLobby">
         <h1 className="listLobbyH1">Users Online</h1>
         <div className="UsersList">

         </div>
      </div>
   )
};

export default LobbyList;