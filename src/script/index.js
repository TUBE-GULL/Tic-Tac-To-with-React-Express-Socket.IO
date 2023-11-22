const cells = document.querySelectorAll('.cell')


let currentSim = ''

const X = () => {
   currentSim = 'X'
   console.log('x')
}

const O = () => {
   currentSim = 'O'
   console.log('o')
}



cells.forEach(cell => {
   cell.addEventListener('click', function () {
      clickCell(cell)
   })
});


const clickCell = (cell) => {
   if (cell.textContent !== 'X' && cell.textContent !== 'O') {
      cell.textContent = currentSim
   }
   if (funCheckWin()) {
      alert('победил!');
   }
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
