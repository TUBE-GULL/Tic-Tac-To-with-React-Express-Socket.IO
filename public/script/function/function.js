const cells = document.querySelectorAll('.cell')
const user = document.getElementById('user')

const clickCell = (cell) => {
   if (cell.textContent !== 'X' && cell.textContent !== 'O') {
      cell.textContent = currentPlayer
   }
   if (funCheckLose()) {
      alert('ничья!');
      clearInterval(timerInterval)
   }
   if (funCheckWin()) {
      alert('победил!');
      clearInterval(timerInterval)
   } else {
      player = player === 'name1' ? 'name2' : 'name1'
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      user.textContent = `${player} play ${currentPlayer}`
   }
}

const funCheckLose = () => {// !!!! 
   cells.forEach(cell => {
      if (cell.textContent !== '') {
         console.log(cell.textContent)
         return true
      }
   })
   return false
}

const funCheckWin = () => {
   return checkRow(0, 1, 2) || checkRow(3, 4, 5) || checkRow(6, 7, 8) ||
      checkRow(0, 3, 6) || checkRow(1, 4, 7) || checkRow(2, 5, 8) ||
      checkRow(0, 4, 8) || checkRow(2, 4, 6)
}

const checkRow = (a, b, c) => {
   return cells[a].innerHTML !== '' &&
      cells[a].innerHTML === cells[b].innerHTML &&
      cells[b].innerHTML === cells[c].innerHTML
}


cells.forEach(cell => {
   cell.addEventListener('click', function () {
      clickCell(cell)
   })
});
