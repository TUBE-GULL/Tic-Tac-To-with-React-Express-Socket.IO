import React, { useContext, useRef, useState } from 'react';

function LobbyChat({ newMessages, handleSubmit }) {
   const contentChatRef = useRef(null);
   const [messageInput, setMessageInput] = useState('');

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
               <div className='message' key={index}>
                  <h2>{sms.userName}</h2>
                  <p>{sms.message}</p>
               </div>
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