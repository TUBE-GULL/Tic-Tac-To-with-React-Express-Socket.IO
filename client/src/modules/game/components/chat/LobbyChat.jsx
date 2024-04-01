import React, { useContext, useRef, useState } from 'react';

function LobbyChat({ newMessages, handleSubmit, handleMessageInputChange }) {
   const contentChatRef = useRef(null);
   const [MessageInputChat, setMessageInputChat] = useState('')

   const scrollToBottom = () => {
      contentChatRef.current.scrollTop = contentChatRef.current.scrollHeight;
   };

   return (
      <div className="lobbyChat">
         <h1>Chat Lobby</h1>

         <div className="contentChat" ref={contentChatRef}>
            <div className='message'>
               <h2></h2>
               <p></p>
            </div>

         </div>

         <form className="FormChat" onSubmit={handleSubmit}>
            <input
               className="InputChat"
               type='text'
               name='textMessage'
               onChange={handleMessageInputChange}
               placeholder='write !'
            ></input>
            <button className="buttonChat">Send</button>
         </form>
      </div>
   )
}

export default LobbyChat;



// const handleChange = (e) => {
//    const { value } = e.target;
//    setMessageInput(value);
// };

// const handleSubmit = (e) => {
//    e.preventDefault();
//    // console.log(messageInput)

//    setMessage(messageInput)
//    // const message = {
//    //    sender: [userData.Nickname, userData.time],
//    //    message: messageInput
//    // };
//    setMessageInput('');
// };