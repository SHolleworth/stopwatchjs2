const mainTimerDisplay = document.getElementById('mainTimerDisplay');
const startStopButton = document.getElementById('startStopButton');
const resetLapButton = document.getElementById('resetLapButton');
let lapTimerDateObject = new Date();
const zeroDate = new Date();
zeroDate.setMilliseconds(0);
zeroDate.setSeconds(0);
zeroDate.setMinutes(0);
let mainStartTime = 0;
let lapStartTime = 0;
let mainSavedTime = 0;
let lapSavedTime = 0;
let fastestLapTime = Infinity;
let slowestLapTime = -Infinity;
let fastLap = document.createElement('div');
fastLap.classList.add('fastLap');
let slowLap = document.createElement('div');
slowLap.classList.add('slowLap');
let lapCounter = 0;
let laps = [];
let timerRef = null;

const initialise = () => {
    resetLapButton.onclick = resetTimer;
    startStopButton.onclick = startTimer;
    setMainTimerDisplay(formatDateToString(zeroDate))
}

const getElapsedMainTimeInMilliseconds = () => {
    return Date.now() + mainSavedTime - mainStartTime;
}

const getElapsedLapTimeInMilliseconds = () => {
    return Date.now() + lapSavedTime - lapStartTime;
}

const setMainTimerDisplay = (timerDisplayString) => {
    mainTimerDisplay.innerHTML = timerDisplayString;
}

const formatDateToString = (dateObject) => {
    return `${padTime(dateObject.getMinutes() + '')}:${padTime(dateObject.getSeconds() + '')}.${padTime(Math.round(dateObject.getMilliseconds()/10) + '')}`
}

const padTime = (time) => {
    return time.padStart(2, '0');
}

const setActiveLapTimeParagraphNode = (lapTimeElapsed) => {
    document.getElementById('lapView').children[0].children[1].innerHTML = lapTimeElapsed;
}

const startTimer = () => {
    mainStartTime = Date.now();
    lapStartTime = Date.now();
    if(!laps.length)
        createLap();
    timerRef = setInterval(() => {
        const mainTimerDateObject = new Date(getElapsedMainTimeInMilliseconds());
        lapTimerDateObject = new Date(getElapsedLapTimeInMilliseconds());
        setMainTimerDisplay(formatDateToString(mainTimerDateObject));
        setActiveLapTimeParagraphNode(formatDateToString(lapTimerDateObject));
    }, 16)
    changeButton("Stop", stopTimer, startStopButton);
    changeButton("Lap", createLap, resetLapButton);
}

const changeButton = (label, func, button) => {
    button.childNodes[0].innerHTML = label;
    button.onclick = func;
}

const stopTimer = () => {
    mainSavedTime = getElapsedMainTimeInMilliseconds();
    lapSavedTime = getElapsedLapTimeInMilliseconds();
    clearInterval(timerRef);
    changeButton("Start", startTimer, startStopButton);
    changeButton("Reset", resetTimer, resetLapButton);
}

const resetTimer = () => {
    mainSavedTime = 0;
    clearInterval(timerRef);
    laps.forEach((lap) => {lapView.removeChild(lap.lapBox)});
    laps.length = 0;
    lapCounter = 0;
    resetFastestAndSlowestLaps();
    setMainTimerDisplay(formatDateToString(zeroDate));
}

const resetFastestAndSlowestLaps = () => {
    fastestLapTime = Infinity;
    slowestLapTime = -Infinity;
}

const createLap = () => {
    if(laps.length) {
        recordLapTime();
        updateFastestAndSlowestLaps();
    }
    lapStartTime = Date.now();
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
    lapBox.classList.add('normalLap');

    laps.unshift({time: null, lapBox: lapBox});
    lapView.prepend(lapBox);
    
    lapCounter++;
    lapSavedTime = 0;
}

const recordLapTime = () => {
    laps[0].time = getElapsedLapTimeInMilliseconds();
}

const updateFastestAndSlowestLaps = () => {
    const slowLap = document.getElementsByClassName('slowLap')[0];
    const fastLap = document.getElementsByClassName('fastLap')[0];
    if(laps[0].time > slowestLapTime) {
        if(slowLap)
            slowLap.classList.replace("slowLap", "normalLap");
        laps[0].lapBox.classList.replace("normalLap", "slowLap");
        slowestLapTime = laps[0].time;
    }
    if(laps[0].time < fastestLapTime) {
        if(fastLap)
            fastLap.classList.replace("fastLap", "normalLap");
        laps[0].lapBox.classList.replace("normalLap", "fastLap");
        fastestLapTime = laps[0].time;
    }
    if(laps.length < 2) {
        laps[0].lapBox.classList.add('mask');
    }
    else {
        Array.from(document.getElementsByClassName('mask')).forEach((lap) => {
            lap.classList.remove('mask');
        })
    }
}

initialise();