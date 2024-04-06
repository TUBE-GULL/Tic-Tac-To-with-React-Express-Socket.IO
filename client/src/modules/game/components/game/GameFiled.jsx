import './gameFiled.module.scss'
import { useContext, useState } from 'react';
import { StartGame } from '../../controller';

function GameFiled({ clickCell, data }) {
   const { cells } = useContext(StartGame);
   // const [leftUserTime, setLeftUserTime] = useState('00:00:00');
   // const [rightUserTime, setRightUserTime] = useState('00:00:00');

   return (
      <div className="gameFiled">
         <div className="inform">
            <div className="informLeft">
               <h3 className="userLeftUserName">{data.userSender.Nickname} symbol:{data.userSender.Symbol}</h3>
               <p className="userLeftUserTime">{`Best time: ${data.userSender.Time === '' ? '00:00' : data.userSender.Time}`}</p>
            </div>
            <div className="informTimers">
               <h2>Timer</h2>
               <p className="timer">'00:00:00'</p>
            </div>
            <div className="informRight">
               <h3 className="userRightUserName">{data.userRival.Nickname} symbol:{data.userRival.Symbol}</h3>
               <p className="userRightUserTime">{`Best time: ${data.userRival.Time === '' ? '00:00' : data.userRival.Time}`}</p>
            </div>
         </div>
         <table className="gameTable">
            <tbody className="tbody">
               <tr className="stroke">
                  {cells.slice(0, 3).map((value, index) => (
                     <th className="cell" key={index} onClick={() => clickCell(index)}>{value}</th>
                  ))}
               </tr>
               <tr className="stroke">
                  {cells.slice(3, 6).map((value, index) => (
                     <th className="cell" key={index + 3} onClick={() => clickCell(index + 3)}>{value}</th>
                  ))}
               </tr>
               <tr className="stroke">
                  {cells.slice(6, 9).map((value, index) => (
                     <th className="cell" key={index + 6} onClick={() => clickCell(index + 6)}>{value}</th>
                  ))}
               </tr>
            </tbody>
         </table>
      </div>
   )
}

export default GameFiled;
