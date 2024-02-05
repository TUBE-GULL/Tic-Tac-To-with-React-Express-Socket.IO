import React, { useContext, useEffect, useState, useRef } from 'react';
import Messages from './modules/Message';

function lobbyChat() {
   const contentChatRef = useRef(null);
   const [messageInput, setMessageInput] = useState('');
   const [messages, setMessages] = useState([]);


   const handleChange = (e) => {
      const { value } = e.target;
      setMessageInput(value);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const message = {
         sender: [userInfo.firstName, userInfo.lastName],
         message: messageInput
      };
      // socket.emit('sendMessage', message);

      setMessageInput('');
   };


   const scrollToBottom = () => {
      contentChatRef.current.scrollTop = contentChatRef.current.scrollHeight;
   };


   useEffect(() => {
      scrollToBottom();
   });

   return (
      <div className="lobbyChat">
         <h1>Chat Lobby</h1>

         <div className="contentChat" ref={contentChatRef}>

         </div>

         <form className="FormChat" onSubmit={handleSubmit}>
            <button className="buttonSmaile">😌</button>

            <input
               className="InputChat"
               type='text'
               name='textMessage'
               value={messageInput}
               onChange={(e) => handleChange(e, 'textMessage')}
               placeholder='write !'
            ></input>
            <button className="buttonChat">Send</button>
         </form>
      </div>
   )
}

export default lobbyChat;