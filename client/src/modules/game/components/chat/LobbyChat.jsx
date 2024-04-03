import React, { useContext, useRef, useState } from 'react';
// import { StartGame } from '../../controller';

function LobbyChat({ newMessages, handleSubmit }) {
   const contentChatRef = useRef(null);
   const [messageInput, setMessageInput] = useState('');
   // const { newMessages } = useContext(StartGame)

   const scrollToBottom = () => {
      contentChatRef.current.scrollTop = contentChatRef.current.scrollHeight;
   };

   const handleFormSubmit = (e) => {
      e.preventDefault();
      handleSubmit(messageInput);
      setMessageInput('');
   };

   const handleChange = (e) => {
      setMessageInput(e.target.value);
   };

   return (
      <div className="lobbyChat">
         <h1>Chat Lobby</h1>

         <div className="contentChat" ref={contentChatRef}>
            {newMessages.map((sms, index) => (
               console.log(sms)
               // <Messages key={index} sms={sms} index={index} />
            ))}
         </div>
         <form className="FormChat" onSubmit={handleFormSubmit}>
            <input
               className="InputChat"
               type='text'
               name='textMessage'
               value={messageInput}
               onChange={handleChange}
               placeholder='write !'
            ></input>
            <button className="buttonChat">Send</button>
         </form>
      </div>
   )
}

export default LobbyChat;