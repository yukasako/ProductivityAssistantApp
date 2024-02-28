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

openTimerBtn.addEventListener("click", () => {});
