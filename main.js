// exempeldata
// let user = {
//   id: 326,
//   username: "test",
//   password: "test123",
//   loggedIn: true,
//   habits: [
//     {
//       id: 673,
//       title: "title",
//       streak: ["2024-03-04", "2024-03-05"],
//       priority: "high",
//     },
//   ],
//   todos: [
//     {
//       id: 659,
//       title: "title",
//       description: "loremloremlorem",
//       completed: true,
//       deadline: "2024-04-04",
//       timeEstimate: {
//         hours: "01",
//         minutes: "10",
//       },
//       category: "pleasure",
//     },
//   ],
// archivedTodos: []
// };

import("/todo.js");
import("/habit.js");
import("/weather.js");
import("/timer.js");
import("/calendar.js");

// globala variabler i main
const main = document.querySelector("main");

let loginScreen = document.querySelector("#loginScreen");
let loadingScreen = document.querySelector("#loadingScreen");
let appScreen = document.querySelector("#appScreen");

let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");

let registerBtn = document.querySelector("#register");
let loginBtn = document.querySelector("#logIn");
let logOutBtn = document.querySelector("#logOut");
let logInRegisterContent = document.querySelector("#userDetails");
let userDetailsMsg = logInRegisterContent.querySelector(".statusMsg");

let navBtnGroup = document.querySelector("nav .btnGroup");
let openTimerBtn = document.createElement("button");
let weatherDiv = document.createElement("div");

let requiredMsg = document.createElement("span");

let users = [];
let todoCategories = [
  "Leasure",
  "Work",
  "Workout",
  "Health",
  "Studying",
  "Home",
];

let emptyArr = [];

//Retrieve quote and create greeting
let quote;
const getQuote = async () => {
  try {
    const res = await fetch("https://api.quotable.io/random?maxLength=75?");
    const data = await res.json();
    if (!data || !data.content) {
      throw new Error("Could not retrieve data.");
    } else {
      quote = data.content;
      let greeting = document.createElement("article");
      greeting.id = "greeting";
      let quoteH1 = document.createElement("h1");
      quoteH1.innerText = quote;
      loadingScreen.append(greeting);
      greeting.appendChild(quoteH1);
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
};
getQuote();

let highlights = document.createElement("article");
highlights.id = "highlights";
let content = document.createElement("div");
content.id = "content";
content.classList.add("flex");
content.classList.add("flex-column");

// todo filters and sorting + all todos here
let todoContent = document.createElement("article");
todoContent.classList.add("todoContent");
// habit filters and sorting + all habits here
let habitsContent = document.createElement("article");
habitsContent.classList.add("habitsContent");

content.append(habitsContent, todoContent);

let todoContentH2 = document.createElement("h2");
todoContentH2.innerText = "Things To Do";
todoContent.append(todoContentH2);

let habitWrapper = document.createElement("div");
habitsContent.append(habitWrapper);
habitWrapper.id = "habitWrapper";

let habitsContentH2 = document.createElement("h2");
habitsContentH2.innerText = "Routines";
habitWrapper.append(habitsContentH2);

let createTodoBtn = document.createElement("button");
createTodoBtn.classList.add("addNew");
createTodoBtn.innerHTML =
  "<span>New Todo</span><i class='fa-solid fa-plus'></i>";
let todoContainer = document.createElement("article");
todoContainer.id = "todoContainer";
let todoList = document.createElement("ul");
todoList.classList.add("todoList");

let createNewHabitDiv = document.createElement("div");
let createHabitBtn = document.createElement("button");
createHabitBtn.classList.add("addNew");
createHabitBtn.innerHTML =
  "<span>New Habit</span><i class='fa-solid fa-plus'></i>";
createNewHabitDiv.append(createHabitBtn);

let habitContainer = document.createElement("article");
habitContainer.id = "habitContainer";
let habitList = document.createElement("ul");
habitList.classList.add("habitList");

// creating other elements

// todo filtering
let todosFilterSection = document.createElement("div"); //append this to top of todo list

todosFilterSection.classList.add("flex", "flex-column", "todosFilters");
let todoStatusSelect = document.createElement("div");
let todosFilterSelect = document.createElement("select");
todoStatusSelect.append(todosFilterSelect);
todosFilterSelect.id = "todosFilterSelect";
todosFilterSelect.innerHTML =
  "<option value='' selected='selected'>Status</option><option value='false'>Not Completed</option><option value='true'>Completed</option>";
let todoCheckboxes = document.createElement("div");
todoCheckboxes.classList.add("flex");
todoCategories.forEach((cat) => {
  todoCheckboxes.innerHTML += `<div class="flex"><input type="checkbox" id="${cat}Filter" name="category" value="${cat}"/>
    <label for="${cat}Filter">${cat}</label></div>`;
});
todosFilterSection.append(todoCheckboxes, todoStatusSelect);

// todo sorting
let todosSortingSection = document.createElement("div");
todosSortingSection.classList.add("flex", "todosSorting");
let todoSortingSelect = document.createElement("select");
todoSortingSelect.id = "todoSorter";
todoSortingSelect.innerHTML +=
  "<option value='' selected='selected'>Sort By</option>";
todoSortingSelect.innerHTML +=
  "<option value='deadlineDesc'>Deadline / Earliest</option>";
todoSortingSelect.innerHTML +=
  "<option value='deadlineAsc'>Deadline / Latest</option>";
todoSortingSelect.innerHTML +=
  "<option value='timeDesc'>Time Estimate / Least</option>";
todoSortingSelect.innerHTML +=
  "<option value='timeAsc'>Time Estimate / Most</option>";

todosSortingSection.append(todoSortingSelect);

// appending filters and sorting
todoContainer.append(todosFilterSection, todosSortingSection);

// habits filtering
let habitsFilterSection = document.createElement("div"); //append this to top of todo list

habitsFilterSection.classList.add("flex", "habitsFilters");

let habitsPrioSelect = document.createElement("select");
habitsPrioSelect.id = "priorityFilter";
habitsPrioSelect.innerHTML =
  "<option value='' selected='selected'>Priority</option>" +
  "<option value='low'>Low</option>" +
  "<option value='medium'>Medium</option>" +
  "<option value='high'>High</option>";

habitsFilterSection.append(habitsPrioSelect);

// habits sorting
let habitsSortingSection = document.createElement("div");
habitsSortingSection.classList.add("flex");
let habitsSortSelect = document.createElement("select");
habitsSortSelect.id = "habitsSorter";
habitsSortSelect.innerHTML += `<option value="">Sort By</option>`;
habitsSortSelect.innerHTML += `<option value="streakDesc">Streak / Lowest</option>`;
habitsSortSelect.innerHTML += `<option value="streakAsc">Streak / Highest</option>`;
habitsSortSelect.innerHTML += `<option value="prioDesc">Priority / Lowest</option>`;
habitsSortSelect.innerHTML += `<option value="prioAsc">Priority / Highest</option>`;
habitsSortingSection.append(habitsSortSelect);
habitContainer.append(habitsFilterSection, habitsSortingSection);

// generating random id:s
const generateId = (arr) => {
  // generate random id
  let id = Math.floor(Math.random() * 1000);

  let idExists = arr.find((item) => item.id === id);

  //   check if id already exists
  while (idExists) {
    id = Math.floor(Math.random() * 1000);
  }

  return id;
};

// register and log in user logic
const registerUser = () => {
  userDetailsMsg.innerText = "";
  let username = usernameInput.value;
  let password = passwordInput.value;

  // checking if user entered values
  if (username && password) {
    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));

      let existingUser = users.find((user) => user.username === username);

      if (!existingUser) {
        let newUser = {
          id: generateId(users),
          username,
          password,
          loggedIn: false,
          habits: [],
          todos: [],
          happeings: [],
          archivedTodos: [],
        };
        users.push(newUser);

        let newUserList = [...users];

        localStorage.setItem("users", JSON.stringify(newUserList));
      } else {
        userDetailsMsg.innerText = "User already exists!";
        userDetailsMsg.classList.remove("hidden");
        setTimeout(() => {
          userDetailsMsg.classList.add("hidden");
        }, 2500);
      }
    } else {
      let newUser = {
        id: Math.floor(Math.random() * 1000),
        username,
        password,
        loggedIn: false,
        habits: [],
        todos: [],
        happenings: [],
        archivedTodos: [],
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
    }
  } else {
    userDetailsMsg.innerText = "Please enter username and password";
    userDetailsMsg.classList.remove("hidden");
    setTimeout(() => {
      userDetailsMsg.classList.add("hidden");
    }, 2500);
  }

  // clearing input fields
  usernameInput.value = "";
  passwordInput.value = "";
};

const logInUser = () => {
  userDetailsMsg.innerText = "";
  let username = usernameInput.value;
  let password = passwordInput.value;

  //checking if user entered values
  if (username && password) {
    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));

      // finding a match if there is one
      let matchingUser = users.find(
        (user) => user.username === username && user.password === password
      );

      if (matchingUser) {
        users.forEach((user) => {
          if (user.username === matchingUser.username) {
            user.loggedIn = true;

            // updating the list in local storage
            let newUserList = [...users];
            localStorage.setItem("users", JSON.stringify(newUserList));

            localStorage.setItem("loggedInUser", matchingUser.id);

            logOutBtn.dataset.id = matchingUser.id;

            // appending the log out button
            toggleUserActions();
            toggleContent();
          }
        });
      } else {
        // if no matching user
        userDetailsMsg.innerText = "User with matching credentials not found!";
        userDetailsMsg.classList.remove("hidden");
        setTimeout(() => {
          userDetailsMsg.classList.add("hidden");
        }, 2500);
      }
    } else {
      userDetailsMsg.innerText = "User with matching credentials not found!";
      userDetailsMsg.classList.remove("hidden");
      setTimeout(() => {
        userDetailsMsg.classList.add("hidden");
      }, 2500);
    }
  }
  userDetailsMsg.innerText = "Please enter username and password";
  userDetailsMsg.classList.remove("hidden");
  setTimeout(() => {
    userDetailsMsg.classList.add("hidden");
  }, 2500);

  // clearing input fields
  usernameInput.value = "";
  passwordInput.value = "";
};

registerBtn.addEventListener("click", () => {
  registerUser();
});

// log out logic
const logOutUser = () => {
  users = JSON.parse(localStorage.getItem("users"));

  users.forEach((user) => {
    user.loggedIn = false;
  });

  let newUserList = [...users];

  //   updating local storage
  localStorage.setItem("users", JSON.stringify(newUserList));
  localStorage.removeItem("loggedInUser");
  openTimerBtn.remove();
  weatherDiv.remove();
  toggleUserActions();
  toggleContent();
};

logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("shouldQuote");
  logOutUser();
});

const toggleUserActions = (ms = 0) => {
  if (localStorage.getItem("loggedInUser")) {
    logOutBtn.classList.remove("displayNone");
    logInRegisterContent.style.display = "none";
  } else {
    logOutBtn.classList.add("displayNone");
    setTimeout(() => {
      logInRegisterContent.style.display = "block";
    }, ms);
  }
};

// hiding / showing locked content based on log in status
const toggleContent = async () => {
  if (localStorage.getItem("loggedInUser")) {
    todoContent.append(todoContainer, createTodoBtn);
    habitWrapper.append(habitContainer, createNewHabitDiv);
    navBtnGroup.prepend(weatherDiv, openTimerBtn);
    

    appScreen.append(highlights, content);

    //cycle from login screen -> loadin screen -> app screen
    if (JSON.parse(localStorage.getItem("shouldQuote")) === true) {
      loginScreen.classList.add("displayNone");
      setTimeout(() => {
        loadingScreen.classList.remove("displayNone");
        setTimeout(() => {
          loadingScreen.classList.add("displayNone");
          appScreen.classList.remove("displayNone");
        }, 5000);
      }, 1000);

      localStorage.removeItem("shouldQuote");
    } else {
      loginScreen.classList.add("displayNone");
      appScreen.classList.remove("displayNone");
    }

    //Append Habits
    renderHabitCards(emptyArr, true);
    completeRatio(false);

    //Append Calendar
    createHappeningArticles();

    //Append Todos
    renderTodoCards(emptyArr, true);
  } else {
    appScreen.innerHTML = "";
    //Cycle back to login screen
    appScreen.classList.add("displayNone");
    loginScreen.classList.remove("displayNone");
  }
};

//Create a Modal or Destroy Modal Functions
const modal = document.createElement("article");

modal.addEventListener("click", () => {
  event.stopPropagation();
});

const createModal = () => {
  const modalScreen = document.createElement("section");
  modalScreen.setAttribute("id", "modalScreen");
  modalScreen.classList.add("flex");

  modal.setAttribute("id", "modal");

  modalScreen.appendChild(modal);

  main.appendChild(modalScreen);

  const closeModal = document.createElement("button");
  closeModal.setAttribute("id", "closeModalBtn");

  const closeModalIcon = document.createElement("i");
  closeModal.appendChild(closeModalIcon);

  closeModalIcon.classList.add("fa-solid", "fa-xmark");

  modal.appendChild(closeModal);
  closeModal.appendChild(closeModalIcon);

  //To exit the modal
  document.getElementById("closeModalBtn").addEventListener("click", () => {
    destroyModal();
  });
  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 27) {
      destroyModal();
    }
  });
  const getModalScreen = document.getElementById("modalScreen");
  getModalScreen.addEventListener("click", () => {
    destroyModal();
  });

  //Scroll Lock
  document.body.classList.add("scrollLock");
};

const destroyModal = () => {
  document.getElementById("modalScreen").remove();
  modal.innerHTML = "";
  document.body.classList.remove("scrollLock");
};

//Trigger Login
loginBtn.addEventListener("click", async () => {
  localStorage.setItem("shouldQuote", true);
  logInUser();
});

document.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    localStorage.setItem("shouldQuote", true);
    logInUser();
  }
});

const getCurrentUser = () => {
  let users = JSON.parse(localStorage.getItem("users"));
  let currentUserId = localStorage.getItem("loggedInUser");
  let currentUser = users.find((user) => +user.id === +currentUserId);

  return currentUser;
};

const getToday = () => {
  let today = new Date();
  let year = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  // Add leading zero if the day is less than 10
  if (dd < 10) {
    dd = "0" + dd;
  }

  // Add leading zero if the month is less than 10
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = `${year}-${mm}-${dd}`;

  return today;
};

// Chart
let completeRatio = (toggle) => {
  // Clear the previous chart
  let previousChart = document.querySelector("#myChart");
  if (previousChart) {
    previousChart.remove();
  }
  let canvas = document.createElement("canvas");
  canvas.id = "myChart";

  if (habitList.childElementCount !== 0) {
    habitsContent.append(canvas);
  }

  let completeBtns = document.querySelectorAll(".completeBtn");
  let uncomplete = 0;
  let complete = 0;
  uncomplete = completeBtns.length;
  completeBtns.forEach((btn) => {
    if (btn.childElementCount == 2) {
      complete += 1;
    }
  });
  let completeRatio = complete / uncomplete;
  let uncompleteRatio = 1 - complete / uncomplete;

  // Text inside the chart
  let text = "";
  if (completeRatio === 1 && toggle === true) {
    text = "Routines Done!";
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  } else if (completeRatio === 0) {
    text = "Start your day";
  } else {
    text = `${Math.floor((completeRatio / 1) * 100)}% Done`;
  }

  let chartText = {
    beforeDraw(chart) {
      let {
        ctx,
        chartArea: { top, width, height },
      } = chart;
      ctx.fillStyle = "black";
      ctx.fillRect(width / 2, top + height / 2, 0, 0);
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${text}`, width / 2, top + height / 2);
    },
  };

  window.myChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["complete", "uncomplete"],
      datasets: [
        {
          label: "Habit complete ratio",
          data: [completeRatio, uncompleteRatio],
          borderWidth: 0,
          backgroundColor: ["rgb(244, 98, 92)", "rgb(254, 183, 183)"],
          hoverBackgroundColor: ["rgb(244, 98, 92)", "rgb(254, 183, 183)"],
        },
      ],
    },
    options: {
      plugins: {
        legend: false,
        tooltip: false,
      },
      animation: {
        animateRotate: true,
      },
      responsive: false,
      cutout: 120,
      tooltips: {
        enabled: false,
      },
    },
    plugins: [chartText],
  });
};

// function that creates habit card
// called upon in both renderHabitList function and createHabitBtn event listener
const createHabitCard = (habit, id) => {
  let li = document.createElement("li");
  li.classList.add("habit", "clickable", "flex");
  li.dataset.id = id;

  // div containing the habit info
  let infoDiv = document.createElement("div");
  infoDiv.classList.add("flex", "flex-column", "habitInfo");
  infoDiv.innerHTML = `<h3 class="itemTitle">${habit.title}</h3>`;
  let subInfo = document.createElement("div");
  subInfo.classList.add("subInfo", "flex");
  subInfo.innerHTML = `<p>Priority: ${
    habit.priority === "low"
      ? "Low <i class='fa-regular fa-circle'></i>"
      : habit.priority === "medium"
      ? "Medium <i class='fa-solid fa-circle-half-stroke'></i>"
      : "High <i class='fa-solid fa-circle danger'></i>"
  }</p><p>Streak: ${habit.streak.length} ${
    habit.streak.length > 1 ? "days" : habit.streak.length === 1 ? "day" : ""
  }</p>`;

  infoDiv.append(subInfo);

  let today = new Date(getToday()).getTime();
  let latestDayInStreak = new Date(
    habit.streak[habit.streak.length - 1]
  ).getTime();
  let completedToday = today === latestDayInStreak;

  let completedBtn = document.createElement("button");
  completedBtn.classList = "completeBtn";
  if (completedToday) {
    completedBtn.innerHTML = `<span>Completed</span><i class="fa-solid fa-check"></i>`;
    completedBtn.style.cursor = "default";
  } else {
    completedBtn.innerHTML = `<span>Complete</span>`;
  }
  completedBtn.addEventListener("click", (e) => {
    // (Data)Get current user from local storage
    let users = JSON.parse(localStorage.getItem("users"));
    let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
    let user = users.find((user) => user.id === loggedInUser);
    let currentHabit = user.habits.find((item) => item.id === habit.id);
    streakIncrementer(currentHabit);
    e.stopPropagation();
    completeRatio(true);
  });

  li.addEventListener("click", (e) => {
    if (e.target !== completedBtn && e.target !== completedBtn.innerHTML) {
      editHabit(id);
    }
  });

  li.append(infoDiv, completedBtn);

  return li;
};

let habitInput = document.createElement("div");
habitInput.id = "createHabitModal";
const createNewHabit = () => {
  requiredMsg.innerText = "";

  // Create input form
  habitInput.innerHTML = `
   <h2>New Habit</h2>
   <div class="flex requiredField"><label for="habitTitle">Title</label>
   <input type="text" name="habitTitle" id="habitTitle"><span class="required">*</span></div>
   <div class="flex"><label for="priority">Priority</label>
   <select id="priority">
   <option value="low" selected="selected">Low</option>
   <option value="medium">Medium</option>
   <option value="high">High</option>
   </select></div>
  `;

  let saveHabitBtn = document.createElement("button");
  saveHabitBtn.innerText = "Save";

  habitInput.append(saveHabitBtn);
  modal.append(habitInput);

  let required = habitInput.querySelector(".requiredField");
  required.before(requiredMsg);

  createModal();

  saveHabitBtn.addEventListener("click", () => {
    saveNewHabit();
    completeRatio(false);
  });
};

const saveNewHabit = () => {
  // Save the input data to local storage.
  let inputHabitTitle = document.querySelector("#habitTitle").value;
  let inputPriority = document.querySelector("#priority").value;

  // check if user entered a title
  if (inputHabitTitle) {
    // Get users array from local storage
    let users = JSON.parse(localStorage.getItem("users"));
    // Get logged users ID
    let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
    // Find the logged-in user by ID and push habit to their habits array
    let user = users.find((user) => user.id === loggedInUser);

    // generate random id
    let habitId = generateId(user.habits);

    // Create habit object
    let habit = {
      id: habitId,
      title: inputHabitTitle,
      streak: [],
      priority: inputPriority,
    };

    user.habits.push(habit);

    // Save updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));

    renderHabitCards(user.habits, false);
    resetHabitFilterAndSorting();
    destroyModal();
  } else {
    requiredMsg.innerText = "Title is required";
  }
};

createHabitBtn.addEventListener("click", () => {
  createNewHabit();
});

// Generate habit-cards based on localStorage
const renderHabitCards = (habitArr = [], onload = false) => {
  resetStreak();
  // clear previous content
  habitList.innerHTML = "";
  // Get current user's array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  let user = users.find((user) => user.id === loggedInUser);

  if (habitArr.length === 0 && onload) {
    // Generate from local storage
    user.habits.forEach((habit) => {
      habitList.append(createHabitCard(habit, habit.id));
    });
  } else {
    // For editing and filtering
    habitArr.forEach((habit) => {
      habitList.append(createHabitCard(habit, habit.id));
    });
  }

  habitContainer.append(habitList);
};

habitsSortSelect.addEventListener("change", () => {
  filterAndSortHabits();
});

habitsPrioSelect.addEventListener("change", () => {
  filterAndSortHabits();
});

const filterAndSortHabits = () => {
  let chosenPriority = document.querySelector("#priorityFilter").value;
  let selectedSortingOption = habitsSortSelect.value;

  // getting current logged in user
  let currentUserId = localStorage.getItem("loggedInUser");

  // getting list of users
  users = JSON.parse(localStorage.getItem("users"));

  // matching current user
  let currentUser = users.find((user) => +user.id === +currentUserId);

  // array to hold the habits that match chosen filters
  let chosenHabits = [];

  // populating the chosenHabits array using filter method
  chosenHabits = currentUser.habits.filter((habit) => {
    return habit.priority === chosenPriority || chosenPriority === "";
  });

  let priorityValues = [
    { name: "low", value: 1 },
    { name: "medium", value: 2 },
    { name: "high", value: 3 },
  ];

  switch (selectedSortingOption) {
    case "":
      break;
    case "streakDesc":
      chosenHabits.sort((a, b) => {
        let aStreak = a.streak.length;
        let bStreak = b.streak.length;
        return aStreak > bStreak ? 1 : bStreak > aStreak ? -1 : 0;
      });
      break;
    case "streakAsc":
      chosenHabits.sort((a, b) => {
        let aStreak = a.streak.length;
        let bStreak = b.streak.length;
        return aStreak < bStreak ? 1 : bStreak < aStreak ? -1 : 0;
      });
      break;
    case "prioDesc":
      chosenHabits.sort((a, b) => {
        let aPrio = priorityValues.find((prio) => prio.name === a.priority);
        aPrio = aPrio.value;
        let bPrio = priorityValues.find((prio) => prio.name === b.priority);
        bPrio = bPrio.value;

        return aPrio - bPrio;
      });
      break;
    case "prioAsc":
      chosenHabits.sort((a, b) => {
        let aPrio = priorityValues.find((prio) => prio.name === a.priority);
        aPrio = aPrio.value;
        let bPrio = priorityValues.find((prio) => prio.name === b.priority);
        bPrio = bPrio.value;

        return bPrio - aPrio;
      });
      break;
  }

  // clearing the current ul
  habitList.innerHTML = "";
  // generating new list based on new habit list
  renderHabitCards(chosenHabits, false);
};

// filterHabitsBtn.addEventListener("click", () => {
//   filterAndSortHabits();
// });

const editHabit = (i) => {
  requiredMsg.innerText = "";

  // priority options
  let priorityLevels = ["Low", "Medium", "High"];
  // getting current user
  let users = JSON.parse(localStorage.getItem("users"));
  let currentLoggedInId = localStorage.getItem("loggedInUser");
  let user = users.find((user) => +user.id === +currentLoggedInId);

  let habit = user.habits.find((habit) => habit.id === i);

  let editForm = document.createElement("div");
  editForm.classList.add("flex", "flex-column");
  editForm.id = "editHabitModal";
  editForm.innerHTML = `<h2>Edit Habit</h2><div class="flex flex-column requiredField"><label for="editHabitTitle">Title</label><div class="flex"><input id="editHabitTitle" value="${habit.title}"type="text"/><span class="required">*</span></div></div>`;

  let prioDiv = document.createElement("div");
  prioDiv.classList.add("flex");
  prioDiv.innerHTML = "<label for='editHabitPrio'>Priority</label>";
  let prioSelect = document.createElement("select");
  prioSelect.id = "editHabitPrio";
  priorityLevels.forEach((level) => {
    if (level.toLowerCase() === habit.priority) {
      prioSelect.innerHTML += `<option value="${habit.priority}" selected="selected">${level}</option>`;
    } else {
      prioSelect.innerHTML += `<option value="${level.toLowerCase()}">${level}</option>`;
    }
  });

  prioDiv.append(prioSelect);

  editForm.append(prioDiv);

  // container for resetting streak action
  let resetDiv = document.createElement("div");
  resetDiv.classList.add("flex");
  resetDiv.innerHTML = `<p class="currentStreak">${habit.streak.length}</p>`;
  let resetBtn = document.createElement("button");
  resetBtn.id = "resetStreak";
  resetBtn.innerText = "Reset Streak";

  resetBtn.addEventListener("click", () => {
    habit = resetActiveHabitStreak(habit);
    resetDiv.innerHTML = `<p class="currentStreak">${habit.streak.length}</p>`;
    resetDiv.append(resetBtn);
  });
  resetDiv.append(resetBtn);
  editForm.append(resetDiv);

  // buttons
  let actionButtons = document.createElement("div");
  actionButtons.classList.add("actionButtons", "flex");

  // save edits button
  let saveEditsBtn = document.createElement("button");
  saveEditsBtn.id = "saveHabitEdits";
  saveEditsBtn.classList.add("modalBtn");
  saveEditsBtn.innerText = "Save";
  saveEditsBtn.addEventListener("click", () => {
    // save changes
    saveHabitEdits(habit);
  });

  // delete habit button
  let deleteBtn = document.createElement("button");
  deleteBtn.id = "deleteHabit";
  deleteBtn.classList.add("modalBtn", "danger");
  deleteBtn.innerText = "Delete Habit";
  deleteBtn.addEventListener("click", () => {
    //delete habit
    deleteHabit(habit);
    completeRatio(false);
  });

  actionButtons.append(saveEditsBtn, deleteBtn);

  editForm.append(actionButtons);

  modal.append(editForm);
  let required = editForm.querySelector(".requiredField");
  required.before(requiredMsg);

  createModal();
};

const saveHabitEdits = (habit) => {
  // 1, Save the input data to local storage.
  let inputHabitTitle = document.querySelector("#editHabitTitle").value;
  let inputPriority = document.querySelector("#editHabitPrio").value;

  if (inputHabitTitle) {
    // Create habit object
    let editedHabit = {
      id: habit.id,
      title: inputHabitTitle,
      streak: habit.streak,
      priority: inputPriority,
    };

    // Get users array from local storage
    let users = JSON.parse(localStorage.getItem("users"));
    // Get logged users ID
    let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
    // Find the logged-in user by ID and push habit to their habits array
    let user = users.find((user) => user.id === loggedInUser);
    let activeHabit = user.habits.find((item) => +item.id === +habit.id);
    let index = user.habits.indexOf(activeHabit);
    user.habits[index] = editedHabit;
    // Save updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));

    let updatedList = user.habits;

    renderHabitCards(updatedList, false);
    completeRatio(false);
    destroyModal();
  } else {
    requiredMsg.innerText = "Title is required";
  }
};

const deleteHabit = (habit) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = localStorage.getItem("loggedInUser");

  let user = users.find((user) => +user.id === +loggedInUser);

  let habitToDelete = user.habits.find((item) => +item.id === +habit.id);

  // finding index of item
  let index = user.habits.indexOf(habitToDelete);

  // removing from array
  user.habits.splice(index, 1);

  localStorage.setItem("users", JSON.stringify(users));

  renderHabitCards(user.habits, false);
  destroyModal();
};

const streakIncrementer = (habit) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = +localStorage.getItem("loggedInUser");
  let user = users.find((user) => user.id === loggedInUser);
  let currentHabit = user.habits.find((item) => item.id === habit.id);
  let indexOfHabit = user.habits.indexOf(currentHabit);

  let streakArray = currentHabit.streak;

  let today = new Date(getToday());

  let latestDayInStreak = new Date(streakArray[streakArray.length - 1]);

  let previousDay = new Date(today);
  previousDay.setDate(today.getDate() - 1);

  if (
    previousDay.getTime() === latestDayInStreak.getTime() ||
    streakArray.length === 0
  ) {
    today = getToday();
    user.habits[indexOfHabit].streak.push(today);
  }

  // updating local storage
  localStorage.setItem("users", JSON.stringify(users));
  // refreshing the list
  renderHabitCards(user.habits, false);
};

const resetStreak = () => {
  users = JSON.parse(localStorage.getItem("users"));
  let loggedInUSer = +localStorage.getItem("loggedInUser");
  let user = users.find((user) => user.id === loggedInUSer);

  let today = new Date(getToday());
  let previousDay = new Date(today);
  previousDay.setDate(today.getDate() - 1);

  user.habits.forEach((habit) => {
    let latestDayInStreak = new Date(habit.streak[habit.streak.length - 1]);
    // setting streak to zero if one day missed
    if (
      previousDay.getTime() !== latestDayInStreak.getTime() &&
      today.getTime() !== latestDayInStreak.getTime()
    ) {
      habit.streak = [];
    }
  });

  // updating local storage
  localStorage.setItem("users", JSON.stringify(users));
};

const resetActiveHabitStreak = (habit) => {
  users = JSON.parse(localStorage.getItem("users"));
  let loggedInUSer = +localStorage.getItem("loggedInUser");
  let user = users.find((user) => user.id === loggedInUSer);

  let currentHabit = user.habits.find((item) => item.id === habit.id);
  // ressetting current habit streak
  currentHabit.streak = [];

  // updating local storage
  localStorage.setItem("users", JSON.stringify(users));

  // returning new length of habit streak
  return currentHabit;
};

const resetHabitFilterAndSorting = () => {
  habitsPrioSelect.querySelector("[value='']").selected = true;
  habitsSortSelect.querySelector("[value='']").selected = true;
};

if (localStorage.getItem("loggedInUser")) {
  renderHabitCards(emptyArr, true);
  completeRatio(false);
}

let todoInput = document.createElement("div");
todoInput.id = "createTodoModal";
const createNewTodo = () => {
  requiredMsg.innerText = "";
  if (todoInput.innerHTML === "") {
    // Create input form

    let categoryDiv = document.createElement("div");
    categoryDiv.classList.add("flex", "flex-row");
    let categoryLabel = document.createElement("label");
    categoryLabel.innerText = "Category";
    categoryLabel.setAttribute("for", "categorySelect");
    let categorySelect = document.createElement("select");
    categorySelect.name = "category";
    categorySelect.id = "categorySelect";

    todoCategories.forEach((cat) => {
      categorySelect.innerHTML += `<option value="${cat.toLowerCase()}">${cat}</option>`;
    });

    categorySelect.append(todoCategories);
    categoryDiv.append(categoryLabel, categorySelect);
    todoInput.innerHTML = `
    <h2>New Todo</h2>
    <div class="flex flex-row requiredField"><label for="todoTitle">Title</label>
    <input type="text" name="todoTitle" id="todoTitle"><span class="required">*</span></div>
    <div class="flex>"<label for="description">Description</label>
    <textarea name="description" id="description"></textarea>
    </div>
    <div class="flex flex-row"><label for="deadline">Deadline</label>
    <input type="date" name="deadline" id="deadline" min="${getToday()}">
    </div>
    <div class="flex flex-row"><label for="timeEstimate">Time Estimate</label>
    <input type="time" name="timeEstimate" id="timeEstimate">
    </div>
    `;

    let saveTodoBtn = document.createElement("button");
    saveTodoBtn.innerText = "Save";

    todoInput.append(categoryDiv, saveTodoBtn);
    modal.append(todoInput);

    let required = todoInput.querySelector(".requiredField");
    required.before(requiredMsg);

    createModal();

    saveTodoBtn.addEventListener("click", () => {
      saveNewTodo();
    });
  } else {
    todoInput.innerHTML = "";
  }
};

const saveNewTodo = () => {
  // Save the input data to local storage.
  let inputTitle = document.querySelector("#todoTitle").value;
  let inputDescription = document.querySelector("#description").value;
  let inputDeadline = document.querySelector("#deadline").value;
  let inputTimeEstimate = document.querySelector("#timeEstimate").value;
  let inputCategory = document.querySelector("#categorySelect").value;

  // if user didnt chose a category, set it to the first one
  if (!inputCategory) {
    inputCategory = document.querySelector("#categorySelect option").value;
  }

  // setting default date value if none entered
  if (!inputDeadline) {
    inputDeadline = "9999-12-31";
  }

  // Extract hours and minutes from inputTimeEstimate
  let [hours, minutes] = inputTimeEstimate.split(":").map((num) => num);

  let timeEstimate;
  if (!inputTimeEstimate) {
    timeEstimate = { hours: "00", minutes: "00" };
  } else {
    timeEstimate = { hours, minutes };
  }

  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));

  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));

  // Find the logged-in user by ID and push todo to their todos array
  let user = users.find((user) => user.id === loggedInUser);

  // generate random id
  let todoId = generateId(user.todos);

  // Generate a todo card to DOM.

  //ensure user entered a title before creating new todo
  if (inputTitle) {
    // Create todo object
    let todo = {
      id: todoId,
      title: inputTitle,
      description: inputDescription,
      completed: false,
      deadline: inputDeadline,
      timeEstimate,
      category: inputCategory,
    };

    user.todos.push(todo);

    // Save updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));
    todoInput.innerHTML = "";

    renderTodoCards(user.todos, false);
    resetTodoFilterAndSorting();
    destroyModal();
  } else {
    requiredMsg.innerText = "Title is required";
  }
};

createTodoBtn.addEventListener("click", () => {
  createNewTodo();
});

// function that creates todo card
// called upon in both renderTodoList function and createTodoBtn event listener
const createTodoCard = (todo, id) => {
  let li = document.createElement("li");
  li.dataset.id = id;
  li.classList.add("todo", "clickable", "flex");

  // icon + title html
  let todoInfo = document.createElement("div");
  todoInfo.classList.add("flex", "todoInfo");
  let icon = setIcon(todo.category);
  todoInfo.append(icon);
  todoInfo.innerHTML += `<h3 class="todoTitle">${
    todo.title
  }</h3><span class="todoDeadline">${
    todo.deadline !== "9999-12-31" ? todo.deadline : ""
  }</span>`;

  // complete checkbox and archive icon (if completed)
  let actionDiv = document.createElement("div");
  actionDiv.classList.add("flex", "todoActions");

  let completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  if (todo.completed == true || todo.completed == "true") {
    li.classList.add("disabled");
    completedCheckbox.checked = true;
  }
  actionDiv.append(completedCheckbox);

  let archiveIcon = document.createElement("i");
  archiveIcon.classList.add("fa-solid", "fa-box-archive", "clickable");

  archiveIcon.addEventListener("click", () => {
    verifyArchiving(todo);
  });
  archiveIcon.setAttribute("title", "Click to Archive Todo");

  completedCheckbox.addEventListener("change", () => {
    completedCheckbox.checked ? completeTodo(todo) : unCompleteTodo(todo);
  });

  li.addEventListener("click", (e) => {
    if (
      e.target !== completedCheckbox &&
      (todo.completed == "false" || todo.completed == false)
    ) {
      editTodo(id);
    }
  });

  li.append(todoInfo, actionDiv);
  if (todo.completed.toString() === "true") {
    actionDiv.append(archiveIcon);
  }

  return li;
};

// function that assigns icon based on category
const setIcon = (cat) => {
  let icon = document.createElement("i");

  switch (cat.toLowerCase()) {
    case "work":
      icon.classList.add("fa-solid", "fa-briefcase");
      break;
    case "workout":
      icon.classList.add("fa-solid", "fa-dumbbell");
      break;
    case "health":
      icon.classList.add("fa-solid", "fa-heart-pulse");
      break;
    case "studying":
      icon.classList.add("fa-solid", "fa-graduation-cap");
      break;
    case "home":
      icon.classList.add("fa-solid", "fa-house-chimney");
      break;
    case "leasure":
      icon.classList.add("fa-solid", "fa-icons");
      break;
  }
  return icon;
};

// Generate Todo-cards based on localStorage
const renderTodoCards = (todoArr = [], onload = false) => {
  // clear previous content
  todoList.innerHTML = "";
  // Get current user's array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  let user = users.find((user) => user.id === loggedInUser);

  if (todoArr.length === 0 && onload) {
    // Generate from local storage
    let userTodos = [...user.todos];
    // sorting array by status
    userTodos.sort(compareStatus);
    // iterating through array to create cards
    userTodos.forEach((todo) => {
      todoList.append(createTodoCard(todo, todo.id));
    });
  } else {
    // For editing and filtering
    // sorting array by status
    todoArr.sort(compareStatus);
    // iterating through array to create cards
    todoArr.forEach((todo) => {
      todoList.append(createTodoCard(todo, todo.id));
    });
  }

  todoContainer.append(todoList);
};

const filterAndSortTodos = () => {
  let status = document.querySelector("#todosFilterSelect").value;
  let checkedCategories = document.querySelectorAll(
    "[name='category']:checked"
  );

  // array to hold values for chosen categories
  let chosenCategories = [];

  // retrieving the values from checked boxes
  checkedCategories.forEach((checkbox) =>
    chosenCategories.push(checkbox.value.toLowerCase())
  );

  // getting current logged in user
  let currentUserId = localStorage.getItem("loggedInUser");

  // getting list of users
  users = JSON.parse(localStorage.getItem("users"));

  // matching current user
  let currentUser = users.find((user) => +user.id === +currentUserId);

  // array to hold the todos that match chosen filters
  let chosenTodos = [];

  // populating the chosenTodos array using filter method
  chosenTodos = currentUser.todos.filter((todo) => {
    return (
      (chosenCategories.includes(todo.category) ||
        chosenCategories.length === 0) &&
      (todo.completed.toString() === status || status === "")
    );
  });

  let selectedSortingOption = todoSortingSelect.value;

  switch (selectedSortingOption) {
    case "":
      break;
    case "deadlineDesc":
      chosenTodos.sort((a, b) => {
        let aDeadline = new Date(a.deadline).getTime();
        let bDeadline = new Date(b.deadline).getTime();
        return aDeadline < bDeadline ? 1 : bDeadline < aDeadline ? -1 : 0;
      });
      break;
    case "deadlineAsc":
      chosenTodos.sort((a, b) => {
        let aDeadline = new Date(a.deadline).getTime();
        let bDeadline = new Date(b.deadline).getTime();
        return aDeadline > bDeadline ? 1 : bDeadline > aDeadline ? -1 : 0;
      });
      break;
    case "timeDesc":
      chosenTodos.sort((a, b) => {
        let aTime =
          a.timeEstimate.hours.toString() + a.timeEstimate.minutes.toString();
        let bTime =
          b.timeEstimate.hours.toString() + b.timeEstimate.minutes.toString();

        aTime = +aTime;
        bTime = +bTime;

        return aTime < bTime ? 1 : bTime < aTime ? -1 : 0;
      });
      break;
    case "timeAsc":
      chosenTodos.sort((a, b) => {
        let aTime =
          a.timeEstimate.hours.toString() + a.timeEstimate.minutes.toString();
        let bTime =
          b.timeEstimate.hours.toString() + b.timeEstimate.minutes.toString();

        aTime = +aTime;
        bTime = +bTime;

        return bTime < aTime ? 1 : aTime < bTime ? -1 : 0;
      });
      break;
  }

  // clearing the current ul
  todoList.innerHTML = "";
  // generating new list based on new todo list
  renderTodoCards(chosenTodos, false);
};

todosFilterSelect.addEventListener("change", () => {
  filterAndSortTodos();
});

let categoryCheckboxes = todoCheckboxes.querySelectorAll("[name='category']");

categoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    filterAndSortTodos();
  });
});

const editTodo = (i) => {
  requiredMsg.innerText = "";

  // getting current user
  let users = JSON.parse(localStorage.getItem("users"));
  let currentLoggedInId = localStorage.getItem("loggedInUser");
  let user = users.find((user) => +user.id === +currentLoggedInId);

  let todo = user.todos.find((todo) => todo.id === i);

  let editForm = document.createElement("div");
  editForm.classList.add("flex", "flex-column");
  editForm.id = "editTodoModal";
  editForm.innerHTML =
    `<h2>Edit Todo</h2>` +
    `<div class="flex flex-column requiredField"><label for="editTodoTitle">Title</label><div><input id="editTodoTitle" value="${todo.title}"type="text"/><span class="required">*</span></div></div>` +
    `<div class="flex flex-column"><label for="editTodoDesc">Description</label><textarea id="editTodoDesc">${todo.description}</textarea></div>`;

  let editStatusDiv = document.createElement("div");
  editStatusDiv.classList.add("flex", "flex-row");
  let statusLabel = document.createElement("label");
  statusLabel.setAttribute("for", "editTodoStatus");
  statusLabel.innerText = "Status";
  let editStatus = document.createElement("select");
  editStatus.id = "editTodoStatus";
  if (todo.completed === true) {
    editStatus.innerHTML += `<option value="${todo.completed}" selected="selected">Completed</option><option value="false">Uncompleted</option>`;
  } else {
    editStatus.innerHTML += `<option value="${todo.completed}" selected="selected">Uncompleted</option><option value="true">Completed</option>`;
  }
  editStatusDiv.append(statusLabel, editStatus);

  editForm.append(editStatusDiv);

  editForm.innerHTML +=
    `<div class="flex flex-row"><label for="editDeadline">Deadline</label>
  <input type="date" min="${getToday()}" name="editDeadline" id="editDeadline" value="${
      todo.deadline == "9999-12-31" ? "" : todo.deadline
    }"></div>` +
    `<div class="flex flex-row"><label for="editTimeEstimate">Time Estimate</label>
  <input type="time" name="editTimeEstimate" id="editTimeEstimate" value="${todo.timeEstimate.hours}:${todo.timeEstimate.minutes}"></div>`;

  let editCategoryDiv = document.createElement("div");
  editCategoryDiv.classList.add("flex", "flex-row");
  editCategoryDiv.innerHTML += "<label for='editCategory'>Category</label>";
  let categorySelect = document.createElement("select");
  categorySelect.name = "editCategory";
  categorySelect.id = "editCategory";

  todoCategories.forEach((cat) => {
    if (todo.category === cat.toLowerCase()) {
      categorySelect.innerHTML += `<option value="${cat.toLowerCase()}" selected="selected">${cat}</option>`;
    } else {
      categorySelect.innerHTML += `<option value="${cat.toLowerCase()}">${cat}</option>`;
    }
  });

  editCategoryDiv.append(categorySelect);

  editForm.append(editCategoryDiv);

  // buttons
  let actionButtons = document.createElement("div");
  actionButtons.classList.add("actionButtons", "flex");

  // save edits button
  let saveEditsBtn = document.createElement("button");
  saveEditsBtn.id = "saveTodoEdits";
  saveEditsBtn.classList.add("modalBtn");
  saveEditsBtn.innerText = "Save";
  saveEditsBtn.addEventListener("click", () => {
    // save changes
    saveTodoEdits(todo);
  });

  // delete todo button
  let deleteBtn = document.createElement("button");
  deleteBtn.id = "deleteTodo";
  deleteBtn.classList.add("modalBtn", "danger");
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", () => {
    //delete todo
    deleteTodo(todo);
  });

  actionButtons.append(saveEditsBtn, deleteBtn);

  editForm.append(actionButtons);

  modal.append(editForm);

  let required = editForm.querySelector(".requiredField");
  required.before(requiredMsg);

  createModal();
};

const saveTodoEdits = (todo) => {
  // 1, Save the input data to local storage.
  let inputTodoTitle = document.querySelector("#editTodoTitle").value;
  let inputTodoDesc = document.querySelector("#editTodoDesc").value;
  let inputStatus = document.querySelector("#editTodoStatus").value;
  let inputDeadline = document.querySelector("#editDeadline").value;
  let inputTimeEstimate = document.querySelector("#editTimeEstimate").value;
  let inputCategory = document.querySelector("#editCategory").value;

  inputDeadline == ""
    ? (inputDeadline = "9999-12-31")
    : (inputDeadline = inputDeadline);

  // Extract hours and minutes from inputTimeEstimate
  let [hours, minutes] = inputTimeEstimate.split(":").map((num) => num);

  let timeEstimate;
  if (!inputTimeEstimate) {
    timeEstimate = { hours: "00", minutes: "00" };
  } else {
    timeEstimate = { hours, minutes };
  }

  if (inputTodoTitle) {
    // Create todo object
    let editedTodo = {
      id: todo.id,
      title: inputTodoTitle,
      description: inputTodoDesc,
      completed: inputStatus,
      deadline: inputDeadline,
      timeEstimate,
      category: inputCategory,
    };

    // Get users array from local storage
    let users = JSON.parse(localStorage.getItem("users"));
    // Get logged users ID
    let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
    // Find the logged-in user by ID and push todo to their todos array
    let user = users.find((user) => user.id === loggedInUser);
    let activeTodo = user.todos.find((item) => +item.id === +todo.id);
    let index = user.todos.indexOf(activeTodo);
    user.todos[index] = editedTodo;
    // Save updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));

    let updatedList = user.todos;

    renderTodoCards(updatedList, false);
    destroyModal();
  } else {
    requiredMsg.innerText = "Title is required";
  }
};

const deleteTodo = (todo) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = localStorage.getItem("loggedInUser");

  let user = users.find((user) => +user.id === +loggedInUser);

  let todoToDelete = user.todos.find((item) => +item.id === +todo.id);

  // finding index of item
  let index = user.todos.indexOf(todoToDelete);

  // removing from array
  user.todos.splice(index, 1);

  localStorage.setItem("users", JSON.stringify(users));

  renderTodoCards(user.todos, false);
  destroyModal();
};

const completeTodo = (todo) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = +localStorage.getItem("loggedInUser");

  let user = users.find((user) => user.id === loggedInUser);

  for (let item of user.todos) {
    if (item.id === todo.id) {
      item.completed = true;
    }
  }
  localStorage.setItem("users", JSON.stringify(users));

  renderTodoCards(user.todos, false);
};

const unCompleteTodo = (todo) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = +localStorage.getItem("loggedInUser");

  let user = users.find((user) => user.id === loggedInUser);

  for (let item of user.todos) {
    if (item.id === todo.id) {
      item.completed = false;
    }
  }
  localStorage.setItem("users", JSON.stringify(users));

  renderTodoCards(user.todos, false);
};

const compareStatus = (a) => {
  if (a.completed.toString() === "true") {
    return 1;
  }
  if (a.completed.toString() === "false") {
    return -1;
  }
  return 0;
};

// sorting todos

todoSortingSelect.addEventListener("change", (e) => {
  filterAndSortTodos();
});

const saveTodoToArchive = (todo) => {
  // getting current user
  users = JSON.parse(localStorage.getItem("users"));
  let loggedInUser = +localStorage.getItem("loggedInUser");
  let user = users.find((user) => user.id === loggedInUser);

  // matching todo
  let todoToArchive = user.todos.find((item) => item.id === todo.id);

  let indexOfTodo = user.todos.indexOf(todoToArchive);
  // removing todo from main todo array
  user.todos.splice(indexOfTodo, 1);

  // adding todo to archived todos array
  user.archivedTodos.push(todoToArchive);

  // updating local storage
  localStorage.setItem("users", JSON.stringify(users));

  renderTodoCards(user.todos, false);

  // close modal
  destroyModal();
};

const verifyArchiving = (todo) => {
  let proceedBtn = document.createElement("button");
  proceedBtn.classList.add("modalBtn");
  proceedBtn.innerText = "Archive";

  proceedBtn.addEventListener("click", () => {
    saveTodoToArchive(todo);
  });

  let actionButtons = document.createElement("div");
  actionButtons.classList.add("flex", "actionButtons");
  actionButtons.append(proceedBtn);

  let archivingContent = document.createElement("div");
  archivingContent.classList.add("flex", "flex-column");
  archivingContent.id = "archiveTodoModal";

  archivingContent.innerHTML = `<h2>Are you sure you want to archive this task?</h2>
  <p>${todo.title}</p>`;

  archivingContent.append(actionButtons);

  modal.append(archivingContent);

  createModal();
};

//Calendar
let createHappeningArticles = () =>{
  const article = document.createElement('article');
  article.id = 'happeningsContent';
  
  const heading = document.createElement('h2');
  heading.textContent = 'Events';
  
  const container = document.createElement('div');
  container.id = 'happeningsContainer';
  
  const showOld = document.createElement("i");
  showOld.classList.add("fa-solid", "fa-angle-down");
  container.appendChild(showOld);
  
  showOld.addEventListener("click", ()=>{
      passedDiv.classList.toggle("displayNone");
      showOld.classList.toggle("fa-angle-up");
  })
  
  const passedDiv = document.createElement('ul');
  passedDiv.id = 'happeningsPassed';
  passedDiv.classList.add("displayNone");
  
  const upcomingDiv = document.createElement('ul');
  upcomingDiv.id = 'happeningsUpcoming';
  
  const addHappeningBtn = document.createElement('button');
  addHappeningBtn.type = 'button';
  addHappeningBtn.id = 'addHappening';
  
  const addHappeningSpan = document.createElement('span');
  addHappeningSpan.innerText = "New Event";
  addHappeningBtn.appendChild(addHappeningSpan);
  
  const addHappeningIcon = document.createElement("i");
  addHappeningIcon.classList.add("fa-solid", "fa-plus");
  addHappeningIcon.setAttribute("aria-hidden", "true");
  addHappeningBtn.appendChild(addHappeningIcon);
  
  container.appendChild(passedDiv);
  container.appendChild(upcomingDiv);
  container.appendChild(addHappeningBtn);
  
  article.appendChild(heading);
  article.appendChild(container);
  
  document.getElementById("content").appendChild(article);

  appendHappenings();
  deleteHappening();
  submitHappening();
}

let userNo = JSON.parse(localStorage.getItem("loggedInUser"));
let userList = JSON.parse(localStorage.getItem("users"));
let userObjIndex = userList.findIndex(obj => obj.id === userNo);
let userObj = userList[userObjIndex];
let userHappenings = userObj.happenings;

//Happening template
const happening = {
  text: null,
  date: null,
  time: null,
  end: null,
};

//Delete Happening Function
let deleteHappening = ()=>{
  const happeningLis = document.getElementById("happeningsContainer").querySelectorAll("li");
  happeningLis.forEach((e)=>{
    e.addEventListener("click", ()=>{
      createModal();
      //Add Delete Button & h2
      const deleteHappeningH2 = document.createElement("h2");
      deleteHappeningH2.innerText = "Delete Event";
      document.getElementById("modal").appendChild(deleteHappeningH2);

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.setAttribute("type", "button");
      deleteBtn.setAttribute("id", "happeningDeleteBtn");
      document.getElementById("modal").appendChild(deleteBtn);

      document.getElementById("happeningDeleteBtn").addEventListener("click", ()=>{
        let userNoC = JSON.parse(localStorage.getItem("loggedInUser"));
        let userListC = JSON.parse(localStorage.getItem("users"));
        let userObjIndexC = userListC.findIndex(obj => obj.id === userNoC);
        let userObjC = userListC[userObjIndexC];
        let userHappeningsC = userObjC.happenings;
        const searchDate = e.children[0].innerText;
        const searchTime = e.children[1].innerText;
        
        userHappeningsC = userHappeningsC.filter(item => !(item.date === searchDate && item.time === searchTime));
        userObjC.happenings = userHappeningsC;
        userListC[userObjIndexC] = userObjC;
        localStorage.setItem("users", JSON.stringify(userListC));

        destroyModal();
      })
    })
  })
}

//Append Happenings To Screen
let appendHappenings = () => {
  document.getElementById("happeningsPassed").innerHTML = "";
  document.getElementById("happeningsUpcoming").innerHTML = "";

  let userHappeningsC = userObj.happenings;

  const happenings = userHappeningsC;
  const passedHappenings = [];
  const upcomingHappenings = [];

  // Sort the array based on time and date
  happenings.sort((a, b) => {
    // Compare dates
    const dateComparison = new Date(a.date) - new Date(b.date);
    if (dateComparison !== 0) {
        return dateComparison;
    }

    // If dates are equal, compare times
    const timeA = a.time.split(':');
    const timeB = b.time.split(':');
    const timeComparison = new Date(0, 0, 0, timeA[0], timeA[1]) - new Date(0, 0, 0, timeB[0], timeB[1]);
    return timeComparison;
  });

  //Separate old and new
  //Get today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  //Split passed and upcoming
  happenings.forEach(function(obj) {
    var dateParts = obj.date.split('-');
    var year = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10) - 1;
    var day = parseInt(dateParts[2], 10);
    
    var objDate = new Date(year, month, day);
    
    if (objDate < today) {
        passedHappenings.push(obj);
    } else {
        upcomingHappenings.push(obj);
    }
  });

  //Append Happenings 
  passedHappenings.forEach((e)=>{
    const happening = document.createElement("li");
    const time = document.createElement("span");
    const divide = document.createElement("span");
    const end = document.createElement("span");
    const date = document.createElement("span");
    const text = document.createElement("p");
  
    date.innerText = e.date;
    time.innerText = e.time;
    end.innerText = e.end;
    divide.innerText = "-";
    text.innerText = e.text;

    happening.appendChild(date);
    happening.appendChild(time);
    happening.appendChild(divide);
    happening.appendChild(end);
    happening.appendChild(text);

    
    document.getElementById("happeningsPassed").appendChild(happening);
  })

  upcomingHappenings.forEach((e)=>{
    const happening = document.createElement("li");
    const time = document.createElement("span");
    const divide = document.createElement("span");
    const end = document.createElement("span");
    const date = document.createElement("span");
    const text = document.createElement("p");

    date.innerText = e.date;
    time.innerText = e.time;
    end.innerText = e.end;
    divide.innerText = "-";
    text.innerText = e.text;

    happening.appendChild(date);
    happening.appendChild(time);
    happening.appendChild(divide);
    happening.appendChild(end);
    happening.appendChild(text);

    document.getElementById("happeningsUpcoming").appendChild(happening);
  })
};

//Create Happening Modal
const addHappeningModal = ()=> {
  const form = document.createElement('form');
  form.id = 'createHappeningForm';

  const happeningH2 = document.createElement("h2");
  happeningH2.innerText = "New Event";
  form.appendChild(happeningH2);

  const happeningWarning = document.createElement("span");
  form.appendChild(happeningWarning);

  const dateWrapper = document.createElement("div");
  dateWrapper.setAttribute("id", "dateWrapper");
  form.appendChild(dateWrapper);

  const timeWrapper = document.createElement("div");
  timeWrapper.setAttribute("id", "timeWrapper");
  form.appendChild(timeWrapper);

  const descriptionWrapper = document.createElement("div");
  descriptionWrapper.setAttribute("id", "descriptionWrapper");
  form.appendChild(descriptionWrapper);


  const dateLabel = document.createElement('label');
  dateLabel.setAttribute('for', 'happeningDate');
  dateLabel.textContent = 'Date';
  dateWrapper.appendChild(dateLabel);
  const dateInput = document.createElement('input');
  dateInput.setAttribute('type', 'date');
  dateInput.id = 'happeningDate';
  dateInput.name = 'date';
  dateWrapper.appendChild(dateInput);

  const timeLabel = document.createElement('label');
  timeLabel.setAttribute('for', 'happeningTime');
  timeLabel.textContent = 'Start';
  timeWrapper.appendChild(timeLabel);
  const timeInput = document.createElement('input');
  timeInput.setAttribute('type', 'time');
  timeInput.id = 'happeningTime';
  timeInput.name = 'time';
  timeWrapper.appendChild(timeInput);

  const timeEndLabel = document.createElement('label');
  timeEndLabel.setAttribute('for', 'happeningEnd');
  timeEndLabel.textContent = 'End';
  timeWrapper.appendChild(timeEndLabel);
  const timeEndInput = document.createElement('input');
  timeEndInput.setAttribute('type', 'time');
  timeEndInput.id = 'happeningEnd';
  timeEndInput.name = 'end';
  timeWrapper.appendChild(timeEndInput);

  const descriptionLabel = document.createElement('label');
  descriptionLabel.setAttribute('for', 'happeningText');
  descriptionLabel.textContent = 'Event';
  descriptionWrapper.appendChild(descriptionLabel);
  const descriptionInput = document.createElement('textarea');
  descriptionInput.id = 'happeningText';
  descriptionInput.name = 'description';
  descriptionInput.maxLength = '250'; 
  descriptionWrapper.appendChild(descriptionInput);

  const submitButton = document.createElement('button');
  submitButton.setAttribute('type', 'button');
  submitButton.id = 'happeningAddBtn';
  submitButton.textContent = 'Save';
  form.appendChild(submitButton);

  modal.appendChild(form);
}

//Open Modal and submit happening
let submitHappening = ()=>{
  const happeningAddBtn = document.getElementById("addHappening");
happeningAddBtn.addEventListener("click", ()=>{
  createModal();
  addHappeningModal();
  const submitHappeningBtn = document.querySelector("#happeningAddBtn");
  let happeningsArr = userHappenings || [];

  //Submit click event
  submitHappeningBtn.addEventListener("click", ()=>{
    const searchDate = document.getElementById("happeningDate").value;
    const searchTime = parseInt(document.getElementById("happeningTime").value.replace(":", ""));
    const searchEnd = parseInt(document.getElementById("happeningEnd").value.replace(":", ""));
    const searchText = document.getElementById("happeningText").value;
    
    const duplicateExists = happeningsArr.some((e) => {
      const time = parseInt(e.time.replace(":", ""));
      const end = parseInt(e.end.replace(":", ""));
    
      if (e.date === searchDate) {
        if (time <= searchTime && end >= searchEnd) {
          return true;
        }
      }
      return false;
    });

    console.log(duplicateExists);
    
    const warningSpan = document.getElementById("createHappeningForm").children[1];
    
    if (duplicateExists) {
      warningSpan.innerText = "Event already exists on selected date and time";
    }

    if (duplicateExists) {
      warningSpan.innerText = "Event already exist on select date and time";
    } 

    else if(searchDate === "" || searchTime === "" || searchEnd === "" || searchText === ""){
      warningSpan.innerText = "All fields are requried";
    }
      
    else {
        happening.date = document.getElementById("happeningDate").value;
        happening.time = document.getElementById("happeningTime").value;
        happening.end = document.getElementById("happeningEnd").value;
        happening.text = document.getElementById("happeningText").value;
        //Push to local storage
        let userNoC = JSON.parse(localStorage.getItem("loggedInUser"));
        let userListC = JSON.parse(localStorage.getItem("users"));
        let userObjC = userListC.find(obj => obj.id === userNoC);
        let userHappeningsC = userObjC.happenings;

        userHappeningsC.push(happening);

        localStorage.setItem("users", JSON.stringify(userListC));

        destroyModal();
      } 
  })
})
}


























const resetTodoFilterAndSorting = () => {
  todoStatusSelect.querySelector("[value='']").selected = true;
  todoSortingSelect.querySelector("[value='']").selected = true;
  todoCheckboxes.querySelectorAll("[name='category']").forEach((checkbox) => {
    checkbox.checked = false;
  });
};

toggleUserActions();
toggleContent();
