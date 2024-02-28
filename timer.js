let openTimerBtn = document.createElement("button");
openTimerBtn.id = "openTimerBtn";
let openBtnIcon = document.createElement("i");
openBtnIcon.classList.add("fa-solid", "fa-clock");
let openBtnText = document.createElement("span");
openBtnText.innerText = "Focus Timer";

openTimerBtn.append(openBtnIcon, openBtnText);

if (localStorage.getItem("loggedInUser")) {
  navBtnGroup.prepend(openTimerBtn);
}
const extractMinutesAndSeconds = (ms) => {
  let m = Math.floor(ms % (1000 * 60 * 60)) / (1000 * 60);
  let s = Math.floor((ms % (1000 * 60)) / 1000);

  if (m < 10) {
    m = "0" + m;
  }

  if (s < 10) {
    s = "0" + s;
  }

  return `${m}:${s}`;
};

let setTimeContent = document.createElement("p");
setTimeContent.classList.add("timeDisplay");
setTimeContent.dataset.time = 5;
let defaultTime = 5 * 60 * 1000;
setTimeContent.innerText = extractMinutesAndSeconds(defaultTime);
let timerContent = document.createElement("div");
timerContent.id = "timerModal";

let timerIsActive = false;

let breakOptions = { short: 5, medium: 10, long: 15 };

openTimerBtn.addEventListener("click", () => {
  viewTimer();
});

const viewTimer = () => {
  timerContent.innerHTML = "";
  // creating modal content

  let buttonsSet = document.createElement("div");
  buttonsSet.classList.add("flex", "flex-row", "timerOptions");
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

  //   start timer button
  let timerBtn = document.createElement("button");
  timerBtn.id = "toggleTimer";
  timerBtn.innerText = "Start";

  timerBtn.addEventListener("click", () => {
    toggleTimer();
  });

  timerContent.append(timerBtn);

  modal.append(timerContent);
  createModal();
};

const setTimer = (minutes) => {
  let minutesInMs = minutes * 60 * 1000;

  setTimeContent.innerText = extractMinutesAndSeconds(minutesInMs);
};

const getCustomeTime = () => {};

const toggleTimer = () => {
  let minutes = setTimeContent.dataset.time;
  let ms = minutes * 60 * 1000;

  let currentTime = new Date().getTime();
  let goalTime = currentTime + ms;

  let countdown;

  if (countdown > 1) {
    clearInterval(countdown);
    setTimeContent.innerText = extractMinutesAndSeconds(ms);
    setTimeContent.dataset.id = minutes;
  } else {
    // Update the count down every 1 second
    countdown = setInterval(() => {
      // Get today's date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      let distance = goalTime - now;

      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeContent.innerText = `${minutes}:${seconds}`;

      if (distance < 0) {
        clearInterval(countdown);
        setTimeContent.innerText = extractMinutesAndSeconds(ms);
        setTimeContent.dataset.id = minutes;
      }
    }, 1000);
  }
};
