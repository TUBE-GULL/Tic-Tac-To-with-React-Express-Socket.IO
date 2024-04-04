import React, { useContext, useRef, useState } from 'react';
import Messages from './modules/Message';
import { StartGame } from '../../controller';

function LobbyChat({ Nickname, newMessages, handleSubmit }) {
   const contentChatRef = useRef(null);
   const [messageInput, setMessageInput] = useState('');
   const { messages } = useContext(StartGame);

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
   // console.log(newMessages)

   return (
      <div className="lobbyChat">
         <h1>Chat Lobby</h1>

         <div className="contentChat" ref={contentChatRef}>
            {newMessages.map((sms, index) => (
               < Messages key={index} Nickname={Nickname} sms={sms} index={index} />
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

{/* {newMessages.map((sms, index) => ( */ }
// console.log(sms)
// < Messages key={index} sms={sms} index={index} />
// ))}