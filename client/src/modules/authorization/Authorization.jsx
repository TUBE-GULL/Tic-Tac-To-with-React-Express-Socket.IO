import './Authorization.scss';
import React from "react"
import AuthorizationController from './controller/Authorization_Controller';

function Authorization() {

   return (
      <div className="AuthorizationBlock">
         <AuthorizationController />
      </div>
   )
};

export default Authorization