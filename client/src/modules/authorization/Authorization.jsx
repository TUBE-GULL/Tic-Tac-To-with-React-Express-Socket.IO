import './Authorization.scss';
import React, { useContext, useState } from "react"
import { useCookies } from 'react-cookie';
import ComponentAuthorization from './components/Component_authorization'
import Notice from "../notice/Notice";
import { EntranceLobby } from '../../App';

//module
import { inputArraySignIn, inputArraySignUp } from './modules/inputArray'

export default function Authorization() {
   const [Registering, setRegistering] = useState(true);


   return (
      <div className="AuthorizationBlock">

         <div className="loginBlock">
            {showNotice && <Notice message={NoticeMessage} />}

            <form onSubmit={handleSubmit} className="loginForm">
               <div className="formInside">
                  <h1>{Registering ? 'ACCOUNT SIGN IN' : 'CREATE AN ACCOUNT'}</h1>

                  {Registering
                     ? inputArraySignIn.map((el, index) => (
                        <ComponentAuthorization key={index} {...el} />
                     ))
                     : inputArraySignUp.map((el, index) => (
                        <ComponentAuthorization key={index} {...el} />
                     ))}
                  <button type="submit">{Registering ? 'SIGN IN' : 'CREATE ACCOUNT'}</button>
               </div>

               <h2>
                  {Registering ? textHTwoSignIn[0] : textHTwoSignUp[0]}
                  <a onClick={handleToggleForm}>
                     {Registering ? textHTwoSignIn[1] : textHTwoSignUp[1]}
                  </a>
               </h2>

            </form>
         </div>
      </div>
   )
};