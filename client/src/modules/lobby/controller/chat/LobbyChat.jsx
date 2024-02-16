import React, { useContext, useEffect, useState, useRef } from 'react';
import Messages from './modules/Message';
import io from 'socket.io-client';

function lobbyChat() {
   const contentChatRef = useRef(null);
   const [message, setMessage] = useState('');
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
      setMessageInput('');
   };


   const scrollToBottom = () => {
      contentChatRef.current.scrollTop = contentChatRef.current.scrollHeight;
   };

   // const sender = user === message.sender[0];

   // useEffect(() => {
   //    const newSocket = io('');
   //    setSocket(newSocket);

   //    const handleConnectServer = ({ data }) => {
   //       console.log(data)
   //    };

   //    const handleReceiveMessage = (data) => {
   //       console.log('Сервер прислал сообщение:', data);
   //    };

   //    const handleDisconnect = () => {
   //       console.log('Отключение от сервера');
   //    };

   //    newSocket.on('message', handleReceiveMessage);
   //    newSocket.on('disconnect', handleDisconnect);
   //    newSocket.on('connectServer', handleConnectServer)
   //    return () => {
   //       newSocket.off('message', handleReceiveMessage);
   //       newSocket.off('disconnect', handleDisconnect);
   //    };
   // }, []);

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