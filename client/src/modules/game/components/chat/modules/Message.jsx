function Messages(props) {
   const { Nickname, sms, index } = props;
   return (
      <div className="messagerecipient">
         <div className={sms.userName === Nickname.Nickname ? 'messagesender' : 'messagerecipient'} key={index}>
            <h1>{sms.userName}</h1>
            <p>{sms.message}</p>
         </div>
      </div>
   );
}

export default Messages;