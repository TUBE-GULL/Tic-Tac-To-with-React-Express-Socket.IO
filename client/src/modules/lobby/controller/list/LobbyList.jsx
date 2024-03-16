import React, { useContext, useEffect, useState } from 'react';
import User from './modules/User';

const searchTime = (time) => {
   return time === '' ? '0:00' : time;
};

function LobbyList({ user, users }) {

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
               <h2>{`${user.Nickname},${searchTime(user.time)}`}</h2>
            </div>
            {userList.map(user => (
               <div className='Profile' key={user.id}>
                  <h2>{`${user.Nickname}, ${searchTime(user.Time)}`}</h2>
               </div>
            ))}
         </div>
      </div>
   )
}

export default LobbyList;


{/* <form onSubmit={handleSubmit} className="loginForm">
               <div className="formInside">
                  <h1>{registering ? textSignIn[1] : textSignUp[1]}</h1>

                  {registering
                     ? inputArraySignIn(loginFormData, handleChange).map((el, index) => <ComponentAuthorization key={index} {...el} />)
                     : inputArraySignUp(registeringFormData, handleChange, passwordsDoNot).map((el, index) => <ComponentAuthorization key={index} {...el} />)
                  }
                  <button type="submit">{registering ? textSignIn[3] : textSignUp[3]}</button>
               </div>

               <h2>
                  {registering ? textSignIn[2] : textSignUp[2]}
                  <a onClick={handleToggleForm}>
                     {registering ? textSignIn[0] : textSignUp[0]}
                  </a>
               </h2>

            </form> */}