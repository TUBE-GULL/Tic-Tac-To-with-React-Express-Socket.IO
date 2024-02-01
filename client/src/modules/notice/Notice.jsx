import style from './Notice.module.scss';

export default function Notice({ message }) {

   // const showTemporaryNotification = (message, duration = 2000) => {
   //    setNotificationMessage(message);
   //    setShowNotification(true);

   //    setTimeout(() => {
   //       setShowNotification(false);
   //       setNotificationMessage('');
   //    }, duration);
   // };

   return (
      <div className={style.Notice}>
         <h1 className={style.NoticeH1}>{message}</h1>
      </div>
   );
};
