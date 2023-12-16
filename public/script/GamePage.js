import React from 'react';

const GamePage = () => (
   <body>
      <div className="content">
         <div className="inform">
            <div className="timers">
               <h1>Timer</h1>
               <p id="timer">00:00:00</p>
            </div>
            <div className="inform_user">
               <h2 id="user">name</h2>
            </div>
         </div>

         <table className="table">
            <tbody className="tbody">
               <tr className="stroke">
                  <th className="cell"></th>
                  <th className="cell"></th>
                  <th className="cell"></th>
               </tr>
               <tr className="stroke">
                  <th className="cell"></th>
                  <th className="cell"></th>
                  <th className="cell"></th>
               </tr>
               <tr className="stroke">
                  <th className="cell"></th>
                  <th className="cell"></th>
                  <th className="cell"></th>
               </tr>
            </tbody>
         </table>
      </div>
   </body>
);

export default GamePage;
