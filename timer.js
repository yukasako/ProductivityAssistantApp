let openTimerBtn = document.createElement("button");
openTimerBtn.id = "openTimerBtn";
openTimerBtn.classList.add("clickable");
let timerBtnSpan = document.createElement("span");
timerBtnSpan.classList.add("flex", "iconBtn");
let openBtnIcon = document.createElement("i");
openBtnIcon.classList.add("fa-solid", "fa-clock");
let openBtnText = document.createElement("span");
openBtnText.innerHTML = "<span>Focus Timer</span>";
timerBtnSpan.append(openBtnIcon, openBtnText);
openTimerBtn.append(timerBtnSpan);

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

// get custom time from user input
const getCustomeTime = () => {
  let customTimeInput = document.querySelector("#customTime");

  customTimeInput.addEventListener("keyup", () => {
    let minutes = customTimeInput.value;
    setTimer(minutes);
    setTimeContent.dataset.time = minutes;
    setTimer(minutes);
    return minutes;
  });
};

let buttonsSet = document.createElement("div");
buttonsSet.classList.add("flex", "flex-row", "timerOptions");

let timerOptions = ["short", "medium", "long", "custom"];

timerOptions.forEach((option) => {
  let button = document.createElement("button");
  button.classList.add("timerOptionBtn");
  if (option === "short") {
    button.innerText = "Short";
    button.addEventListener("click", () => {
      setTimeContent.dataset.time = breakOptions.short;
      setTimer(breakOptions.short);
    });
  } else if (option === "medium") {
    button.innerText = "Medium";
    button.addEventListener("click", () => {
      setTimeContent.dataset.time = breakOptions.medium;
      setTimer(breakOptions.medium);
    });
  } else if (option === "long") {
    button.innerText = "Long";
    button.addEventListener("click", () => {
      setTimeContent.dataset.time = breakOptions.long;
      setTimer(breakOptions.long);
    });
  } else {
    button.innerHTML = `<span class="flex customBtn"><i class="fa-solid fa-gear"></i><span>Custom</span></span>`;
    button.addEventListener("click", () => {
      buttonsSet.after(customTimeDiv);
      getCustomeTime();
    });
  }
  buttonsSet.append(button);
});

let customTimeDiv = document.createElement("div");
customTimeDiv.classList.add("flex", "customTimeDiv");
customTimeDiv.innerHTML =
  "<input id='customTime' type='number' min='1' max='60'><label for='customTime'>minutes</label>";

let setTimeContent = document.createElement("p");
setTimeContent.classList.add("timeDisplay");
setTimeContent.dataset.time = 5;
let defaultTime = 5 * 60 * 1000;
setTimeContent.innerText = extractMinutesAndSeconds(defaultTime);
let timerContent = document.createElement("div");
timerContent.id = "timerModal";
timerContent.classList.add("flex", "flex-column");

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
  //   document.querySelector("#timerModal").innerHTML = "";
  viewTimer();
});

const viewTimer = () => {
  if (timerIsActive) {
    stopTimer();
  }
  // creating modal content

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

let myTimer;

const startTimer = (time) => {
  let optionBtns = buttonsSet.querySelectorAll("button");
  let timeInput = document.querySelector("#customTime");
  if (timeInput) {
    timeInput.value = "";
  }
  customTimeDiv.remove();
  if (!time) {
    // change buttons
    timerContent.append(buttonDiv);

    timerBtn.remove();
    buttonDiv.prepend(pauseBtn, stopBtn);

    let minutes = setTimeContent.dataset.time;
    let ms = minutes * 60 * 1000;

    let currentTime = new Date().getTime();
    let goalTime = currentTime + ms;

    optionBtns.forEach((button) => {
      button.disabled = true;
    });

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
        optionBtns.forEach((button) => {
          button.disabled = false;
        });
      }
    }, 1000);

    timerIsActive = true;
  } else {
    // change buttons
    timerContent.append(buttonDiv);

    timerBtn.remove();
    buttonDiv.prepend(pauseBtn, stopBtn);

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
        optionBtns.forEach((button) => {
          button.disabled = false;
        });
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

  let optionBtns = buttonsSet.querySelectorAll("button");
  optionBtns.forEach((button) => {
    button.disabled = false;
  });
  playBtn.remove();
  pauseBtn.remove();
  stopBtn.remove();
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
