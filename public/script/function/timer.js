const timerElement = document.getElementById('timer')

const timer = {
   minutes: 0,
   seconds: 0,
   miniSeconds: 0,
}

const timers = () => {
   timer.miniSeconds++
   if (timer.miniSeconds === 60) {
      timer.seconds++
      timer.miniSeconds = 0
   }
   if (timer.seconds === 60) {
      timer.minutes++
      timer.seconds = 0
   }
   if (timer.minutes === 60) {
      timer.minutes = 0;
      timer.seconds = 0;
      timer.miniSeconds = 0;
   }

   const formattedMinutes = timer.minutes.toString().padStart(2, '0');
   const formattedSeconds = timer.seconds.toString().padStart(2, '0');
   const formattedMiniSeconds = timer.miniSeconds.toString().padStart(2, '0');

   return `${formattedMinutes}:${formattedSeconds}:${formattedMiniSeconds}`
}

const timerInterval = setInterval(() => {
   timerElement.textContent = timers()
}, 10);


// let currentTime = 0;

// const formatTime = (seconds) => {
//    const minutes = Math.floor((seconds % 60000) / 60)

//    const Seconds = Math.floor((seconds % 3600) / 60)
//    const miniSeconds = seconds % 60

//    const formattedMinutes = minutes.toString().padStart(2, '0');
//    const formattedSeconds = Seconds.toString().padStart(2, '0');
//    const formattedMiniSeconds = miniSeconds.toString().padStart(2, '0');

//    return `${formattedMinutes}:${formattedSeconds}.${formattedMiniSeconds}`
// }


// const timerInterval = setInterval(() => {
//    currentTime++;
//    timerElement.textContent = formatTime(currentTime);
// }, 10);
