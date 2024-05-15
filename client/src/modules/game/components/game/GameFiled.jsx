import './gameFiled.module.scss'
import { useContext } from 'react';
import { StartGame } from '../../controller';

function GameFiled({ clickCell, data, time }) {
   const { cells } = useContext(StartGame);
   return (
      <div className="gameFiled">
         <div className="inform">
            <div className="informLeft">
               <h3 className="userLeftUserName">{data.Sender.Nickname} :{data.Sender.Symbol}</h3>
               <p className="userLeftUserTime">{`Best time: ${data.Sender.Time === '' ? '00:00:00' : data.Sender.Time}`}</p>
            </div>
            <div className="informTimers">
               <h2>Timer</h2>
               <p className="timer">{time}</p>
            </div>
            <div className="informRight">
               <h3 className="userRightUserName">{data.Rival.Nickname} :{data.Rival.Symbol}</h3>
               <p className="userRightUserTime">{`Best time: ${data.Rival.Time === '' ? '00:00:00' : data.Rival.Time}`}</p>
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