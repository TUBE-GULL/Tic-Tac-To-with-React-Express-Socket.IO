import { TimerForGameFunction } from "../types/types";

const timerForGame = (): string => {
    let minutes = 0;
    let seconds = 0;
    let miniSeconds = 0;

    miniSeconds++;
    if (miniSeconds === 100) {
        seconds++;
        miniSeconds = 0;
    }
    if (seconds === 60) {
        minutes++;
        seconds = 0;
    }
    if (minutes === 60) {
        minutes = 0;
        seconds = 0;
        miniSeconds = 0;
    }

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMiniSeconds = miniSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}:${formattedMiniSeconds}`;
};

export default timerForGame;
