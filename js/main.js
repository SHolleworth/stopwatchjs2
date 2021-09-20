const mainTimerDisplay = document.getElementById('main-timer-display');
const startStopButton = document.getElementById('start-stop-button');
const resetLapButton = document.getElementById('reset-lap-button');
const lapView = document.getElementById('lap-view');
let emptyLapBoxes = [];
let lapTimerDateObject = new Date();
const zeroDate = new Date();
zeroDate.setMilliseconds(0);
zeroDate.setSeconds(0);
zeroDate.setMinutes(0);
let mainStartTime = 0;
let lapStartTime = 0;
let mainSavedTime = 0;
let activeLapSavedTime = 0;
let fastestLapTime = Infinity;
let slowestLapTime = -Infinity;
let lapCounter = 0;
let animationRequestId = null;
let laps = [];
let running = false;
const buttonNames = {
    START: 0,
    STOP: 1,
    RESET: 2,
    LAP: 3
};
Object.freeze(buttonNames);

startStopButton.onclick = () => { running ? stopTimer() : startTimer() }
resetLapButton.onclick = () => { running ? createLap() : resetTimer() }

const initialise = () => {
    createEmptyLapBoxes()
    setMainTimerDisplay(formatDateToString(zeroDate));
}

const createEmptyLapBoxes = () => {
    emptyLapBoxes.length ? clearRemainingEmptyLapBoxes() : null;
    for(let i = 0; i < 7; i++) {
        const emptyLapBox = document.createElement('div');
        emptyLapBox.classList.add('lap-box', 'lap-box--empty');
        lapView.appendChild(emptyLapBox);
    }
    emptyLapBoxes = document.getElementsByClassName('lap-box--empty');
}

const clearRemainingEmptyLapBoxes = () => {
    Array.from(emptyLapBoxes).forEach((emptyLapBox) => {
        lapView.removeChild(emptyLapBox);
    })
}

const getElapsedMainTimeInMilliseconds = () => {
    return Date.now() + mainSavedTime - mainStartTime;
}

const getElapsedLapTimeInMilliseconds = () => {
    return Date.now() + activeLapSavedTime - lapStartTime;
}

const setMainTimerDisplay = (timerDisplayString) => {
    mainTimerDisplay.innerHTML = timerDisplayString;
}

const setActiveLapTimeDisplay = (lapTimeElapsed) => {
    document.getElementsByClassName('lap-box__active-time')[0].innerHTML = lapTimeElapsed;
}

const formatDateToString = (dateObject) => {
    return `${padTime(dateObject.getMinutes() + '')}:${padTime(dateObject.getSeconds() + '')}.${padTime(Math.floor(dateObject.getMilliseconds()/10) + '')}`;
}

const padTime = (time) => {
    return time.padStart(2, '0');
}

const startTimer = () => {
    running = true;
    mainStartTime = Date.now();
    lapStartTime = Date.now();
    if(!laps.length)
        createLap();
    animationRequestId = runTimerAnimation();
    changeButton(buttonNames.START);
    changeButton(buttonNames.RESET);
}

const runTimerAnimation = () => {
    const mainTimerDateObject = new Date(getElapsedMainTimeInMilliseconds());
    lapTimerDateObject = new Date(getElapsedLapTimeInMilliseconds());
    setMainTimerDisplay(formatDateToString(mainTimerDateObject));                
    setActiveLapTimeDisplay(formatDateToString(lapTimerDateObject));
    animationRequestId = requestAnimationFrame(runTimerAnimation);
}

const changeButton = (buttonName) => {
    switch(buttonName) {
        case(buttonNames.START) :
            setButton(startStopButton, "Stop", "button--start-color", "button--stop-color");
            break
        case(buttonNames.STOP):
            setButton(startStopButton, "Start", "button--stop-color", "button--start-color");
            break
        case(buttonNames.RESET):
            setButton(resetLapButton, "Lap");
            break
        case(buttonNames.LAP):
            setButton(resetLapButton, "Reset");
            break
    }
}

const setButton = (button, newLabel, oldClass, newClass) => {
    button.children[0].innerHTML = newLabel;
    button.classList.replace(oldClass, newClass);
}

const stopTimer = () => {
    running = false;
    mainSavedTime = getElapsedMainTimeInMilliseconds();
    activeLapSavedTime = getElapsedLapTimeInMilliseconds();
    cancelAnimationFrame(animationRequestId);
    changeButton(buttonNames.STOP);
    changeButton(buttonNames.LAP);
}

const resetTimer = () => {
    mainSavedTime = 0;
    laps.forEach((lap) => {lapView.removeChild(lap.lapBox)});
    laps.length = 0;
    lapCounter = 0;
    resetFastestAndSlowestLaps();
    setMainTimerDisplay(formatDateToString(zeroDate));
    createEmptyLapBoxes();
}

const resetFastestAndSlowestLaps = () => {
    fastestLapTime = Infinity;
    slowestLapTime = -Infinity;
}

const createLap = () => {
    if(laps.length) {
        fixPreviousLapTime();
        updateFastestAndSlowestLaps();
    }
    removeEmptyLapBox();
    lapStartTime = Date.now();
    const lapBox = createLapBox()
    laps.unshift({splitTime: null, lapBox: lapBox});
    lapView.prepend(lapBox);
    lapCounter++;
    activeLapSavedTime = 0;
}

const removeEmptyLapBox = () => {
    emptyLapBoxes.length ? lapView.removeChild(emptyLapBoxes[0]) : null;
}

const createLapBox = () => {
    const lapBox = document.createElement('div');
    const lapLabelParagraph = document.createElement('p');
    const lapTimeParagraph = document.createElement('p');
    const lapLabelText = document.createTextNode("Lap " + (lapCounter + 1));
    const lapTimeText = document.createTextNode('00:00.00');

    lapLabelParagraph.appendChild(lapLabelText);
    lapTimeParagraph.appendChild(lapTimeText);

    lapTimeParagraph.classList.add('lap-box__text', 'lap-box__active-time');
    lapLabelParagraph.classList.add('lap-box__text');

    lapBox.appendChild(lapLabelParagraph);
    lapBox.appendChild(lapTimeParagraph);
    lapBox.classList.add('lap-box');

    return lapBox;
}

const fixPreviousLapTime = () => {
    laps[0].splitTime = getElapsedLapTimeInMilliseconds();
    document.getElementsByClassName('lap-box__active-time')[0].classList.remove('lap-box__active-time');
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
        });
    }
}

initialise();