import React, { useContext, useEffect, useState } from 'react';
import User from './modules/User';

const searchTime = (time) => {
   return time === '' ? '0:00' : time;
};

function LobbyList({ user, users, onButtonClick }) {

   // console.log(user)
   // console.log(users)

   const userList = Object.entries(users).map(([userId, userData]) => ({
      id: userId,
      ...userData
   }));

   return (
      <div className="listLobby">
         <h1 className="listLobbyH1">Users Online</h1>
         <div className="UsersList">
            <div className='Profile'>
               <h2>{`${user.Nickname},${searchTime(user.Time)}`}</h2>
            </div>
            {userList.map(us => (
               us.Nickname !== user.Nickname ? (
                  <button className='ProfileButton' key={us.id} onClick={() => onButtonClick(us.socketId, us.id, us.Nickname, us.Time)}>
                     <div className='Profile'>
                        <h2>{`${us.Nickname}, ${searchTime(us.Time)}`}</h2>
                     </div>
                  </button>
               ) : null
            ))}
         </div>
      </div >
   );

}

export default LobbyList;
