const GameStart = () => {
   return React.createElement('div', { className: 'content' },
      React.createElement('div', { className: 'inform' },
         React.createElement('div', { className: 'userOne' },
            React.createElement('p', { className: 'userOne_name' }, 'name one'),
            React.createElement('p', { className: 'userOne_time' }, 'best time')
         ),
         React.createElement('div', { className: 'timers' },
            React.createElement('h1', {}, 'Timer'),
            React.createElement('p', { id: 'timer' }, '00:00:00')
         ),
         React.createElement('div', { className: 'userTwo' },
            React.createElement('p', { className: 'userTwo_name' }, 'name two'),
            React.createElement('p', { className: 'userTwo_time' }, 'best time')
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
}

export default GameStart;
