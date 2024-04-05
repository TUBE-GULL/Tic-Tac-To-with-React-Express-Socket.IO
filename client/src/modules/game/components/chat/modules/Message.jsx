function Messages(props) {
   const { Nickname, sms, index } = props;
   return (
      <div className={sms.userName === Nickname ? 'messageSender' : 'messageGet'} key={index}>
         <h1>{sms.userName}</h1>
         <p>{sms.message}</p>
      </div>
   );
}

export default Messages;