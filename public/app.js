document.addEventListener('DOMContentLoaded', function () {
const socket = io();
const startButton = document.getElementById('startButton');
const setPenaltyButton = document.getElementById('setPenaltyButton');
const daysInput = document.getElementById('daysInput');
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const penaltyInput = document.getElementById('penaltyInput');
const viewRemainingTimeButton = document.getElementById('viewRemainingTimeButton');
const timer = document.getElementById('timer');

let isTimerRunning = false;

daysInput.addEventListener('input', updateStartButtonState);
hoursInput.addEventListener('input', updateStartButtonState);
minutesInput.addEventListener('input', updateStartButtonState);
penaltyInput.addEventListener('input', updatePenaltyButtonState);

function updateStartButtonState() {
    const days = parseInt(daysInput.value) || 0;
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;

    if (days > 0 || hours > 0 || minutes > 0) {
        startButton.removeAttribute('disabled');
    } else {
        startButton.setAttribute('disabled', true);
    }
}

function updatePenaltyButtonState() {
    const penaltyMinutes = parseInt(penaltyInput.value) || 0;

    if (penaltyMinutes > 0) {
        setPenaltyButton.removeAttribute('disabled');
    } else {
        setPenaltyButton.setAttribute('disabled', true);
    }
}

var view = 0;
socket.on('timerState', (countdown) => {
    if (view) {
        // 將倒數計時轉換為天時分
        const daysRemaining = Math.floor(countdown / 86400);
        const hoursRemaining = Math.floor((countdown % 86400) / 3600);
        const minutesRemaining = Math.floor((countdown % 3600) / 60);
        const sceondRemaining = Math.floor((countdown % 60));
        
        timer.textContent = `${daysRemaining} days ${hoursRemaining} hours ${minutesRemaining} minutes ${sceondRemaining} sceonds`;
    } else {
        timer.textContent = '*****';
    }

    daysInput.setAttribute('disabled', true);
    hoursInput.setAttribute('disabled', true);
    minutesInput.setAttribute('disabled', true);
    penaltyInput.setAttribute('disabled', true);
    setPenaltyButton.setAttribute('disabled', true);

    if (countdown <= 0) {
        daysInput.removeAttribute('disabled');
        hoursInput.removeAttribute('disabled');
        minutesInput.removeAttribute('disabled');
        penaltyInput.removeAttribute('disabled');
        setPenaltyButton.removeAttribute('disabled');
    }
});

setPenaltyButton.addEventListener('click', () => {
    const penaltyMinutes = parseInt(penaltyInput.value) || 0;
    socket.emit('setPenalty', penaltyMinutes);
});

startButton.addEventListener('click', () => {
    const days = parseInt(daysInput.value) || 0;
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const initialTimeInSeconds = (days * 86400) + (hours * 3600) + (minutes * 60);

    socket.emit('startTimer', initialTimeInSeconds);
    isTimerRunning = true;
});

viewRemainingTimeButton.addEventListener('click', () => {
    socket.emit('viewRemainingTime');
    viewRemainingTimeButton.setAttribute('disabled', true);
    view = 1;
});

});