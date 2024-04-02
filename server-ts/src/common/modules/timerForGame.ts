
const timerForGame = (roomTimers, roomName): string => {

    if (!roomTimers[roomName]) {
        roomTimers[roomName] = {
            minutes: 0,
            seconds: 0,
            miniSeconds: 0,
        };
    }
    const timer = roomTimers[roomName];

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
};



export default timerForGame;