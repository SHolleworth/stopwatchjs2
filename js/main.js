const mainTimerDisplay = document.getElementById('main-timer-display');
const startStopButton = document.getElementById('start-stop-button');
const resetLapButton = document.getElementById('reset-lap-button');
const lapView = document.getElementById('lap-view');
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
let lapCounter = 0;
let animationRequestId = null;
let laps = [];
let running = false;

const initialise = () => {
    resetLapButton.onclick = resetTimer;
    startStopButton.onclick = startTimer;
    setMainTimerDisplay(formatDateToString(zeroDate));
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

const setActiveLapTimeDisplay = (lapTimeElapsed) => {
    document.getElementById('lap-view').children[0].children[1].innerHTML = lapTimeElapsed;
}

const formatDateToString = (dateObject) => {
    return `${padTime(dateObject.getMinutes() + '')}:${padTime(dateObject.getSeconds() + '')}.${padTime(Math.round(dateObject.getMilliseconds()/10) + '')}`;
}

const padTime = (time) => {
    return time.padStart(2, '0');
}

const startTimer = () => {
    mainStartTime = Date.now();
    lapStartTime = Date.now();
    if(!laps.length)
        createLap();
    animationRequestId = runTimerAnimation();
    changeButton("Stop", "button--start-color", "button--stop-color", stopTimer, startStopButton);
    changeButton("Lap", null, null, createLap, resetLapButton);
}

const runTimerAnimation = () => {
    const mainTimerDateObject = new Date(getElapsedMainTimeInMilliseconds());
    lapTimerDateObject = new Date(getElapsedLapTimeInMilliseconds());
    setMainTimerDisplay(formatDateToString(mainTimerDateObject));
    setActiveLapTimeDisplay(formatDateToString(lapTimerDateObject));
    animationRequestId = requestAnimationFrame(runTimerAnimation);
}

const changeButton = (label, oldClass, newClass, func, button) => {
    button.children[0].innerHTML = label;
    button.onclick = func;
    button.classList.replace(oldClass, newClass);
}

const stopTimer = () => {
    mainSavedTime = getElapsedMainTimeInMilliseconds();
    lapSavedTime = getElapsedLapTimeInMilliseconds();
    cancelAnimationFrame(animationRequestId);
    changeButton("Start", "button--stop-color", "button--start-color", startTimer, startStopButton);
    changeButton("Reset", null, null, resetTimer, resetLapButton);
}

const resetTimer = () => {
    mainSavedTime = 0;
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
    const lapBox = createLapBox()
    laps.unshift({splitTime: null, lapBox: lapBox});
    lapView.prepend(lapBox);
    lapCounter++;
    lapSavedTime = 0;
}

const createLapBox = () => {
    const lapBox = document.createElement('div');
    const lapLabelParagraph = document.createElement('p');
    const lapTimeParagraph = document.createElement('p');
    const lapLabelText = document.createTextNode("Lap " + (lapCounter + 1));
    const lapTimeText = document.createTextNode('00:00.00');

    lapLabelParagraph.appendChild(lapLabelText);
    lapTimeParagraph.appendChild(lapTimeText);
    lapTimeParagraph.classList.add('lap-box__text');
    lapLabelParagraph.classList.add('lap-box__text');

    lapBox.appendChild(lapLabelParagraph);
    lapBox.appendChild(lapTimeParagraph);
    lapBox.classList.add('lap-box');

    return lapBox;
}

const recordLapTime = () => {
    laps[0].splitTime = getElapsedLapTimeInMilliseconds();
}

const updateFastestAndSlowestLaps = () => {
    const slowLap = document.getElementsByClassName('lap-box--slow-color')[0];
    const fastLap = document.getElementsByClassName('lap-box--fast-color')[0];
    if(laps[0].splitTime > slowestLapTime) {
        slowLap?.classList.remove("lap-box--slow-color");
        laps[0].lapBox.classList.add("lap-box--slow-color");
        slowestLapTime = laps[0].splitTime;
    }
    if(laps[0].splitTime < fastestLapTime) {
        fastLap?.classList.remove("lap-box--fast-color");
        laps[0].lapBox.classList.add("lap-box--fast-color");
        fastestLapTime = laps[0].splitTime;
    }
    if(laps.length < 2) {
        laps[0].lapBox.classList.add('lap-box--mask-color');
    }
    else {
        Array.from(document.getElementsByClassName('lap-box--mask-color')).forEach((lap) => {
            lap.classList.remove('lap-box--mask-color');
        })
    }
}

initialise();