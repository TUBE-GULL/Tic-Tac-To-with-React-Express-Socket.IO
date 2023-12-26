import handleCellClick from "/script/users.js";

const GameStart = ({ senderName, senderTime, receiverName, receiverTime }) => {

   const content = React.createElement('div', { className: 'content' },
      React.createElement('div', { className: 'inform' },
         React.createElement('div', { className: 'userOne' },
            React.createElement('p', { className: 'userOne_name' }, senderName),
            React.createElement('p', { className: 'userOne_time' }, `Best time  ${senderTime}`)
         ),
         React.createElement('div', { className: 'timers' },
            React.createElement('h1', {}, 'Таймер'),
            React.createElement('p', { id: 'timer' }, '00:00:00')
         ),
         React.createElement('div', { className: 'userTwo' },
            React.createElement('p', { className: 'userTwo_name' }, receiverName),
            React.createElement('p', { className: 'userTwo_time' }, `Best time ${receiverTime}`)
         )
      ),
      React.createElement('table', { className: 'table' },
         React.createElement('tbody', { className: 'tbody' },
            React.createElement('tr', { className: 'stroke' },
               React.createElement('th', { className: 'cell', id: 'cell0', onClick: () => handleCellClick(0) }),
               React.createElement('th', { className: 'cell', id: 'cell1', onClick: () => handleCellClick(1) }),
               React.createElement('th', { className: 'cell', id: 'cell2', onClick: () => handleCellClick(2) })
            ),
            React.createElement('tr', { className: 'stroke' },
               React.createElement('th', { className: 'cell', id: 'cell3', onClick: () => handleCellClick(3) }),
               React.createElement('th', { className: 'cell', id: 'cell4', onClick: () => handleCellClick(4) }),
               React.createElement('th', { className: 'cell', id: 'cell5', onClick: () => handleCellClick(5) })
            ),
            React.createElement('tr', { className: 'stroke' },
               React.createElement('th', { className: 'cell', id: 'cell6', onClick: () => handleCellClick(6) }),
               React.createElement('th', { className: 'cell', id: 'cell7', onClick: () => handleCellClick(7) }),
               React.createElement('th', { className: 'cell', id: 'cell8', onClick: () => handleCellClick(8) })
            )
         )
      )
   );

   return content;
};

export default GameStart; 