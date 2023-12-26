let arrayCells

// const handleCellClick = (cellNumber) => {
//    console.log(`Clicked on cell ${cellNumber}`);
// };

const userData = {}

socket.on('start', ({ user }) => {
   userData = user

   // определяю поля после перерисовки старницы 
   const cells = document.getElementsByClassName('cell');
   arrayCells = [...cells];

   console.log('connection server')

})


const handleCellClick = (cellNumber) => {
   console.log(`Clicked on cell ${cellNumber}`);


};

export default handleCellClick;






