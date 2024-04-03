// import React from 'react';
// import { useEffect, useState } from 'react';
function Messages(sms, index) {

   return (
      // <div className="messagerecipient">
      <div className='message' key={index}>
         <h1>{sms.userName}</h1>
         <p>{sms.message}</p>
      </div>
      // </div>
   );
}

export default Messages;