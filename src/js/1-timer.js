import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";



const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');
const startBtn = document.querySelector('[data-start]'); 

let userSelectedDate = null;
let timerInterval = null;

startBtn.disabled = true;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = days; 
  
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function startTimer() {
    startBtn.disabled = true;
    dateTime.disabled = true;

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        const msRemaining = userSelectedDate.getTime() - Date.now();

        if (msRemaining <= 0) {
            clearInterval(timerInterval); 
            updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            dateTime.disabled = false; 
            
            return;
        }
        const time = convertMs(msRemaining);
        updateTimer(time);
        
    }, 1000);
}

const dateTime = document.querySelector('#datetime-picker');
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
      console.log(selectedDates[0]);
      
      if (selectedDates[0].getTime() <= Date.now()) {
          iziToast.error({
            title: 'Error',
            message: 'Please choose a date in the future',
            position: 'topRight' 
});
          startBtn.disabled = true;
      } else {
          userSelectedDate = selectedDates[0];
          startBtn.disabled = false;
      }
  },
};

flatpickr(dateTime, options);

startBtn.addEventListener('click', startTimer);


