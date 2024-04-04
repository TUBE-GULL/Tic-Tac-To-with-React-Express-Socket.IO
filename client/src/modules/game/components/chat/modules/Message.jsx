function Messages(Nickname, sms, index) {
   console.log(sms)
   console.log(Nickname)
   return (
      <div className="messagerecipient">
         <div className={sms.userName === Nickname ? 'messagesender' : 'messagerecipient'} key={index}>
            <h1>{sms.userName}</h1>
            <p>{sms.message}</p>
         </div>
      </div >
   );
}

export default Messages;