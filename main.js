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

if (!JSON.parse(localStorage.getItem("shouldGetQuote") === false)) {
  getQuote();
}

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

let habitsContentH2 = document.createElement("h2");
habitsContentH2.innerText = "Routines";
habitsContent.append(habitsContentH2);

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
            localStorage.setItem("shouldGetQuote", false);

            logOutBtn.dataset.id = matchingUser.id;

            // appending the log out button
            getQuote();
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

  localStorage.removeItem("shouldGetQuote");

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
    habitsContent.append(habitContainer, createNewHabitDiv);

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
  } else {
    content.innerHTML = "";
    appScreen.innerHTML = "";

    //Cycle back to login screen
    appScreen.classList.add("displayNone");
    loginScreen.classList.remove("displayNone");
  }
};

toggleUserActions();
toggleContent();

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
  logInUser();
  localStorage.setItem("shouldQuote", true);
});

document.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    logInUser();
    localStorage.setItem("shouldQuote", true);
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
