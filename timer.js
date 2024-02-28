let openTimerBtn = document.createElement("button");
openTimerBtn.id = "openTimerBtn";
let openBtnIcon = document.createElement("i");
openBtnIcon.classList.add("fa-solid", "fa-clock");
let openBtnText = document.createElement("span");
openBtnText.innerText = "Focus Timer";

openTimerBtn.append(openBtnIcon, openBtnText);

if (localStorage.getItem("loggedInUser")) {
  navBtnGroup.insertBefore(openTimerBtn, logOutBtn);
}
const extractMinutesAndSeconds = (ms) => {
  let m = Math.floor(ms % (1000 * 60 * 60)) / (1000 * 60);
  m = Math.floor(m);
  let s = Math.floor((ms % (1000 * 60)) / 1000);
  s = Math.floor(s);

  if (m < 10) {
    m = "0" + m;
  }

  if (s < 10) {
    s = "0" + s;
  }

  return `${m}:${s}`;
};

let buttonsSet = document.createElement("div");
buttonsSet.classList.add("flex", "flex-row", "timerOptions");

let setTimeContent = document.createElement("p");
setTimeContent.classList.add("timeDisplay");
setTimeContent.dataset.time = 5;
let defaultTime = 5 * 60 * 1000;
setTimeContent.innerText = extractMinutesAndSeconds(defaultTime);
let timerContent = document.createElement("div");
timerContent.id = "timerModal";

let timerIsActive = false;

// start timer button
let timerBtn = document.createElement("button");
timerBtn.id = "toggleTimer";
timerBtn.innerHTML = "Start";

timerBtn.addEventListener("click", () => {
  if (!timerIsActive) {
    startTimer();
  }
});

//   pause timer button
let pauseBtn = document.createElement("button");
pauseBtn.id = "pauseTimerBtn";
pauseBtn.classList.add("timerIconBtn");
pauseBtn.innerHTML = "<i class='fa-solid fa-pause'></i>";

pauseBtn.addEventListener("click", () => {
  pauseTimer();
});

// stop timer button
let stopBtn = document.createElement("button");
stopBtn.id = "stopTimerBtn";
stopBtn.classList.add("timerIconBtn");
stopBtn.innerHTML = "<i class='fa-solid fa-stop'></i>";

stopBtn.addEventListener("click", () => {
  stopTimer();
  buttonDiv.remove();
  timerContent.append(timerBtn);
});

// play timer button
let playBtn = document.createElement("button");
playBtn.id = "playTimerBtn";
playBtn.classList.add("timerIconBtn");
playBtn.innerHTML = "<i class='fa-solid fa-play'></i>";

playBtn.addEventListener("click", () => {
  resumeTimer();
});

//   place play, pause and stop buttons in div
let buttonDiv = document.createElement("div");
buttonDiv.classList.add("flex", "timerToggleButtons");
buttonDiv.append(pauseBtn, stopBtn);

let breakOptions = { short: 5, medium: 10, long: 15 };

openTimerBtn.addEventListener("click", () => {
  viewTimer();
});

const viewTimer = () => {
  timerContent.innerHTML = "";
  // creating modal content

  let options = ["short", "medium", "long", "custom"];

  options.forEach((option) => {
    let button = document.createElement("button");
    button.classList.add("timerOptionBtn");
    if (option === "short") {
      button.innerText = "Short Break";
      button.addEventListener("click", () => {
        setTimeContent.dataset.time = breakOptions.short;
        setTimer(breakOptions.short);
      });
    } else if (option === "medium") {
      button.innerText = "Medium Break";
      button.addEventListener("click", () => {
        setTimeContent.dataset.time = breakOptions.medium;
        setTimer(breakOptions.medium);
      });
    } else if (option === "long") {
      button.innerText = "Long Break";
      button.addEventListener("click", () => {
        setTimeContent.dataset.time = breakOptions.long;
        setTimer(breakOptions.long);
      });
    } else {
      button.innerHTML = `<i class="fa-solid fa-gear"></i><span>Custom</span>`;
      let minutes = getCustomeTime();
      button.addEventListener("click", () => {
        setTimeContent.dataset.time = minutes;
        setTimer(minutes);
      });
    }
    buttonsSet.append(button);
  });
  timerContent.append(buttonsSet);

  //   time display
  timerContent.append(setTimeContent);

  timerContent.append(timerBtn);

  modal.append(timerContent);
  createModal();
};

const setTimer = (minutes) => {
  let minutesInMs = minutes * 60 * 1000;

  setTimeContent.innerText = extractMinutesAndSeconds(minutesInMs);
};

// get custom time from user input
const getCustomeTime = () => {};

let myTimer;

const startTimer = (time) => {
  if (!time) {
    // change buttons
    timerContent.append(buttonDiv);
    playBtn.remove();
    timerBtn.remove();
    buttonDiv.prepend(pauseBtn);

    let minutes = setTimeContent.dataset.time;
    let ms = minutes * 60 * 1000;

    let currentTime = new Date().getTime();
    let goalTime = currentTime + ms;

    // Update the count down every 1 second
    myTimer = setInterval(() => {
      // Get today's date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      let distance = goalTime - now;

      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      setTimeContent.innerText = `${minutes}:${seconds}`;

      if (distance < 0) {
        clearInterval(myTimer);
        setTimeContent.innerText = extractMinutesAndSeconds(ms);
        setTimeContent.dataset.id = minutes;
        timerIsActive = false;
        buttonDiv.remove();
        timerContent.append(timerBtn);
      }
    }, 1000);

    timerIsActive = true;
  } else {
    playBtn.remove();

    let currentTime = new Date().getTime();
    let goalTime = currentTime + time;

    // Update the count down every 1 second
    myTimer = setInterval(() => {
      // Get today's date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      let distance = goalTime - now;

      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      setTimeContent.innerText = `${minutes}:${seconds}`;

      if (distance < 0) {
        clearInterval(myTimer);
        setTimeContent.innerText = extractMinutesAndSeconds(ms);
        setTimeContent.dataset.id = minutes;
        timerIsActive = false;
        buttonDiv.remove();
        timerContent.append(timerBtn);
      }
    }, 1000);

    timerIsActive = true;
  }
};

const stopTimer = () => {
  let time = setTimeContent.dataset.time;
  let [m, s] = time.split(":").map((num) => num);

  let minutesToMs = Math.floor(+m * 60000);
  clearInterval(myTimer);
  setTimeContent.innerText = extractMinutesAndSeconds(minutesToMs);

  timerIsActive = false;
};

const findTimeLeft = () => {
  let timeLeft = setTimeContent.innerText;

  let [minutes, seconds] = timeLeft.split(":").map((num) => num);

  let minutesToMs = Math.floor(minutes * 60000);
  let secondsToMs = Math.floor(seconds * 1000);
  let ms = minutesToMs + secondsToMs;
  return ms;
};

const pauseTimer = () => {
  let timeLeft = findTimeLeft();

  setTimeContent.innerText = extractMinutesAndSeconds(timeLeft);
  clearInterval(myTimer);

  //   let formatted = setTimeContent.innerText;
  //   let [minutes, seconds] = formatted.split(":").map((num) => num);

  //   setTimeContent.dataset.time = `${minutes}:${seconds}`;

  timerIsActive = false;

  pauseBtn.remove();
  buttonDiv.prepend(playBtn);
};

const resumeTimer = () => {
  let timeLeft = findTimeLeft();
  startTimer(timeLeft);
  playBtn.remove();
  buttonDiv.prepend(pauseBtn);
};
