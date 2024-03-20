import style from './Notice.module.scss';

function NoticeLobby(user) {

   return (
      <div className={style.Notice}>
         <h1 className={style.NoticeH1}>{`${user.Nickname}`}</h1>
      </div>
   );
};

export default NoticeLobby;