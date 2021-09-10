const mainTimerDisplay = document.getElementById('mainTimerDisplay');
const startStopButton = document.getElementById('startStopButton');
const resetLapButton = document.getElementById('resetLapButton');
const zeroDate = new Date();
zeroDate.setMilliseconds(0);
zeroDate.setSeconds(0);
zeroDate.setMinutes(0);
let startTime = 0;
let lapStartTime = 0;
let savedTime = 0;
let lapSavedTime = 0;
let fastestLap = 0;//TODO add slow and fast colours to lap times.
let slowestLap = 0;//////
let lapCounter = 0;
let laps = [];
let timerRef = null;

const initialise = () => {
    resetLapButton.onclick = resetTimer;
    startStopButton.onclick = startTimer;
    setClockTime(mainTimerDisplay, zeroDate);
}

const setClockTime = (clock, timeElapsed, startTime) => {
    let displayString = "";
    const milliseconds = timeElapsed.getMilliseconds();
    const seconds = timeElapsed.getSeconds();
    const minutes = timeElapsed.getMinutes();
    displayString += (minutes + ":").padStart(3, '0') + (seconds + ".").padStart(3, '0') + (Math.round(milliseconds/10) + '').padStart(2, '0');
    clock.innerHTML = displayString;
}

const getActiveLap = () => {
    return document.getElementById('lapView').children[0].children[1];
}

const startTimer = () => {
    startTime = Date.now();
    lapStartTime = Date.now();
    timerRef = setInterval(() => {
        const currentTime = Date.now();
        const timeElapsed = new Date(savedTime + currentTime - startTime);
        const lapTimeElapsed = new Date(lapSavedTime + currentTime - lapStartTime);
        setClockTime(mainTimerDisplay, timeElapsed);
        setClockTime(getActiveLap(), lapTimeElapsed);
    })
    if(!laps.length)
        createLap();
    changeButton("Stop", stopTimer, startStopButton);
    changeButton("Lap", createLap, resetLapButton);
}

changeButton = (label, func, button) => {
    button.childNodes[0].innerHTML = label;
    button.onclick = func;
}

const stopTimer = () => {
    savedTime = Date.now() - startTime + savedTime;
    lapSavedTime = Date.now() - lapStartTime;
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
    setClockTime(mainTimerDisplay, zeroDate);
}

const createLap = () => {
    lapStartTime = Date.now();
    lapSavedTime = 0;
    const lapView = document.getElementById('lapView');
    const lapBox = document.createElement('div');
    const lapLabelParagraph = document.createElement('p');
    const lapTimeParagraph = document.createElement('p');
    const lapLabelText = document.createTextNode("Lap " + (lapCounter + 1));
    const lapTimeText = document.createTextNode('00:00.00');
    lapLabelParagraph.appendChild(lapLabelText);
    lapTimeParagraph.appendChild(lapTimeText);
    lapBox.appendChild(lapLabelParagraph);
    lapBox.appendChild(lapTimeParagraph);
    laps.push(lapBox);
    lapView.prepend(lapBox);
    lapCounter++;
}

initialise();