const minutesDisplay = document.getElementById('minutesDisplay');
const secondsDisplay = document.getElementById('secondsDisplay');
const millisecondsDisplay = document.getElementById('millisecondsDisplay');
const startStopButton = document.getElementById('startStopButton');
const resetLapButton = document.getElementById('resetLapButton');
let startTime = 0;
let savedTime = 0;
let timerRef = null;

const initialise = () => {
    resetLapButton.onclick = resetTimer;
    startStopButton.onclick = startTimer;
    const freshTime = {
        milliseconds: 0,
        seconds: 0,
        minutes: 0
    }
    setClockTime(freshTime);
}

const setClockTime = (newTime) => {
    let displayString = "";
    if(newTime.milliseconds < 100) {
        displayString = "0";
    }
    millisecondsDisplay.innerHTML = displayString + Math.round(newTime.milliseconds/10);
    displayString = "";
    if(newTime.seconds < 10) {
        displayString = "0";
    }
    secondsDisplay.innerHTML = displayString + newTime.seconds + ".";
    displayString = "";
    if(newTime.minutes < 10) {
        displayString = "0";
    }
    minutesDisplay.innerHTML = displayString + newTime.minutes + ":";
}

const startTimer = () => {
    startTime = Date.now();
    timerRef = setInterval(() => {
        const newTime = {};
        const currentTime = Date.now();
        const timeElapsed = new Date(savedTime + currentTime - startTime);
        newTime.minutes = timeElapsed.getMinutes();
        newTime.seconds = timeElapsed.getSeconds();
        newTime.milliseconds = timeElapsed.getMilliseconds();
        setClockTime(newTime);
    })
    changeButton("Stop", stopTimer, startStopButton);
    changeButton("Lap", null, resetLapButton);
}

changeButton = (label, func, el) => {
    el.childNodes[0].innerHTML = label;
    el.onclick = func;
}

const stopTimer = () => {
    savedTime = Date.now() - startTime + savedTime;
    clearInterval(timerRef);
    changeButton("Start", startTimer, startStopButton);
    changeButton("Reset", resetTimer, resetLapButton);
}

const resetTimer = () => {
    savedTime += 0;
    clearInterval(timerRef);
    const freshTimer = {
        milliseconds: 0,
        seconds: 0,
        minutes: 0
    }
    setClockTime(freshTimer);
}

const resetClockDisplay = () => {
    setClockTime(clockTime);
}

initialise();