import style from './Notice.module.scss';

function Notice({ message }) {

   return (
      <div className={style.Notice}>
         <h1 className={style.NoticeH1}>{message}</h1>
      </div>
   );
};

export default Notice;