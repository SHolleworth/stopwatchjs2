const minutesDisplay = document.getElementById('minutesDisplay');
const secondsDisplay = document.getElementById('secondsDisplay');
const millisecondsDisplay = document.getElementById('millisecondsDisplay');
const startStopButton = document.getElementById('startStopButton');
const resetLapButton = document.getElementById('resetLapButton');
const zeroDate = new Date();
zeroDate.setMilliseconds(0);
zeroDate.setSeconds(0);
zeroDate.setMinutes(0);
let startTime = 0;
let savedTime = 0;
let lapCounter = 0;
let laps = [];
let timerRef = null;

const initialise = () => {
    resetLapButton.onclick = resetTimer;
    startStopButton.onclick = startTimer;
    setClockTime(zeroDate);
    createLap();
    createLap();
}

const setClockTime = (timeElapsed) => {
    let displayString = "";
    const milliseconds = timeElapsed.getMilliseconds();
    const seconds = timeElapsed.getSeconds();
    const minutes = timeElapsed.getMinutes();
    if(milliseconds < 100) {
        displayString = "0";
    }
    millisecondsDisplay.innerHTML = displayString + Math.round(milliseconds/10);
    displayString = "";
    if(seconds < 10) {
        displayString = "0";
    }
    secondsDisplay.innerHTML = displayString + seconds + ".";
    displayString = "";
    if(minutes < 10) {
        displayString = "0";
    }
    minutesDisplay.innerHTML = displayString + minutes + ":";
}

const startTimer = () => {
    startTime = Date.now();
    timerRef = setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = new Date(savedTime + currentTime - startTime);
        setClockTime(timeElapsed);
    })
    changeButton("Stop", stopTimer, startStopButton);
    changeButton("Lap", createLap, resetLapButton);
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
    savedTime = 0;
    clearInterval(timerRef);
    laps.forEach((lap) => {lapView.removeChild(lap)});
    laps.length = 0;
    lapCounter = 0;
    setClockTime(zeroDate);
}

const createLap = () => {
    lapCounter++;
    const lapView = document.getElementById('lapView');
    const lapBox = document.createElement('div');
    const lapLabelParagraph = document.createElement('p');
    const lapTimeParagraph = document.createElement('p');
    const lapLabelText = document.createTextNode("Lap " + lapCounter);
    const lapTimeText = document.createTextNode('00:00.00');
    lapLabelParagraph.appendChild(lapLabelText);
    lapTimeParagraph.appendChild(lapTimeText);
    lapBox.appendChild(lapLabelParagraph);
    lapBox.appendChild(lapTimeParagraph);
    laps.push(lapBox);
    lapView.appendChild(lapBox);
}

initialise();