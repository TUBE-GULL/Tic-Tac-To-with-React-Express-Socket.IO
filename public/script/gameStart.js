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
               React.createElement('th', { className: 'cell' }),
               React.createElement('th', { className: 'cell' }),
               React.createElement('th', { className: 'cell' })
            ),
            React.createElement('tr', { className: 'stroke' },
               React.createElement('th', { className: 'cell' }),
               React.createElement('th', { className: 'cell' }),
               React.createElement('th', { className: 'cell' })
            ),
            React.createElement('tr', { className: 'stroke' },
               React.createElement('th', { className: 'cell' }),
               React.createElement('th', { className: 'cell' }),
               React.createElement('th', { className: 'cell' })
            )
         )
      )
   );

   return content;
};

export default GameStart; 