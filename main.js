

// exempeldata
// let user = {
//   id: 1,
//   username: "test",
//   password: "test123",
//   loggedIn: true,
//   habits: [
//     {
//       userId: 1,
//       title: "title",
//       streak: 6,
//       priority: "high",
//     },
//   ],
//   todos: [
//     {
//       userId: 1,
//       title: "title",
//       description: "loremloremlorem",
//       completed: true,
//       deadline: "2024-04-04",
//       timeEstimate: {
//         hours: 0,
//         minutes: 40,
//       },
//       category: "pleasure",
//     },
//   ],
// };

import("/todo.js");
import("/habit.js");

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

let statusMsg = document.querySelector("#statusMsg");

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


//Quote Functionality
let quote;

//Retrieve quote and create greeting
const getQuote = async () => {
  console.log("working");
  try {
    const res = await fetch("https://api.quotable.io/random?maxLength=75?");
    const data = await res.json();
    if (!data || !data.content) {
      throw new Error("Could not retrieve data.");
    }

    else{
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

content.append(todoContent, habitsContent);

let todoContentH2 = document.createElement("h2");
todoContentH2.innerText = "Things To Do";
todoContent.append(todoContentH2);

let habitsContentH2 = document.createElement("h2");
habitsContentH2.innerText = "Routine";
habitsContent.append(habitsContentH2);

let createNewTodoDiv = document.createElement("div");
createNewTodoDiv.id = "createNewTodoDiv";
let createTodoBtn = document.createElement("button");
createTodoBtn.innerText = "New Todo";
createNewTodoDiv.append(createTodoBtn);

let todoContainer = document.createElement("article");
todoContainer.id = "todoContainer";
let todoList = document.createElement("ul");
todoList.classList.add("todoList");

let createNewHabitDiv = document.createElement("div");
let createHabitBtn = document.createElement("button");
createHabitBtn.innerText = "New Habit";
createNewHabitDiv.append(createHabitBtn);

let habitContainer = document.createElement("article");
habitContainer.id = "habitContainer";
let habitList = document.createElement("ul");
habitList.classList.add("habitList");

// creating other elements

// todo-filtering
let todosFilterSection = document.createElement("div"); //append this to top of todo list

todosFilterSection.classList.add("flex", "flex-column", "todosFilters");
let filterTodosBtn = document.createElement("button");
filterTodosBtn.id = "filterTodos";
filterTodosBtn.innerText = "Filter";
let todoStatusSelect = document.createElement("div");
let todosFilterSelect = document.createElement("select");
todoStatusSelect.append(todosFilterSelect);
todosFilterSelect.id = "todosFilterSelect";
todosFilterSelect.innerHTML =
  "<option value='' selected='selected'>Status</option><option value='false'>Not Completed</option><option value='true'>Completed</option>";
let todoCheckboxes = document.createElement("div");
todoCheckboxes.classList.add("flex");
todoCategories.forEach((cat) => {
  todoCheckboxes.innerHTML += `<div><input type="checkbox" id="${cat}Filter" name="category" value="${cat}"/>
    <label for="${cat}Filter">${cat}</label></div>`;
});
todosFilterSection.append(todoCheckboxes, todoStatusSelect, filterTodosBtn);
todoContainer.append(todosFilterSection);

// habits filtering
let habitsFilterSection = document.createElement("div"); //append this to top of todo list

habitsFilterSection.classList.add("flex", "habitsFilters");
let filterHabitsBtn = document.createElement("button");
filterHabitsBtn.id = "filterHabits";
filterHabitsBtn.innerText = "Filter";

let habitsPrioSelect = document.createElement("select");
habitsPrioSelect.id = "priorityFilter";
habitsPrioSelect.innerHTML =
  "<option value='' selected='selected'>Priority</option>" +
  "<option value='0'>0</option>" +
  "<option value='1'>1</option>" +
  "<option value='2'>2</option>" +
  "<option value='3'>3</option>" +
  "<option value='4'>4</option>" +
  "<option value='5'>5</option>";

habitsFilterSection.append(habitsPrioSelect, filterHabitsBtn);
habitContainer.append(habitsFilterSection);

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
  statusMsg.innerText = "";
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
        };
        users.push(newUser);

        let newUserList = [...users];

        localStorage.setItem("users", JSON.stringify(newUserList));
      } else {
        statusMsg.innerText = "User already exists!";
      }
    } else {
      let newUser = {
        id: Math.floor(Math.random() * 1000),
        username,
        password,
        loggedIn: false,
        habits: [],
        todos: [],
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
    }
  }

  // clearing input fields
  usernameInput.value = "";
  passwordInput.value = "";
};

const logInUser = async () => {
  statusMsg.innerText = "";
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
        statusMsg.innerText = "User with matching credentials not found!";
      }
    } else {
      statusMsg.innerText = "User with matching credentials not found!";
    }
  }

  // clearing input fields
  usernameInput.value = "";
  passwordInput.value = "";
};

registerBtn.addEventListener("click", () => {
  registerUser();
});

// log out logic
const logOutUser = () => {
  statusMsg.innerText = "";
  users = JSON.parse(localStorage.getItem("users"));

  users.forEach((user) => {
    user.loggedIn = false;
  });

  let newUserList = [...users];

  //   updating local storage
  localStorage.setItem("users", JSON.stringify(newUserList));
  localStorage.removeItem("loggedInUser");
  toggleUserActions(1500, "Bye for now!");
  toggleContent();
};

logOutBtn.addEventListener("click", () => {
  logOutUser();
});

const toggleUserActions = (ms = 0, msg = "") => {
  if (localStorage.getItem("loggedInUser")) {
    logOutBtn.classList.remove("displayNone");
    logInRegisterContent.style.display = "none";
  } else {
    logOutBtn.classList.add("displayNone");
    statusMsg.innerText = msg;
    setTimeout(() => {
      statusMsg.innerText = "";
      logInRegisterContent.style.display = "block";
    }, ms);
  }
};

// hiding / showing locked content based on log in status
const toggleContent = async () => {
  if (localStorage.getItem("loggedInUser")) {
    todoContent.append(createNewTodoDiv, todoContainer);
    habitsContent.append(createNewHabitDiv, habitContainer);

    appScreen.append(highlights, content);

    //cycle from login screen -> loadin screen -> app screen
      loginScreen.classList.add("displayNone");
      setTimeout(()=>{
        loadingScreen.classList.remove("displayNone");
        setTimeout(() => {
          loadingScreen.classList.add("displayNone");
          appScreen.classList.remove("displayNone");
        }, 5000);
      }, 1000)


    // renderTodoCards();
  } else {
    content.innerHTML = "";
    appScreen.innerHTML = "";

    //Cycle back to login screen
    setTimeout(() => {
      appScreen.classList.add("displayNone");
      loginScreen.classList.remove("displayNone");
    }, 2000);
  }
};

toggleUserActions();
toggleContent();

//Create a Modal or Destroy Modal Functions
const modal = document.createElement("article");
const createModal = () => {
  const modalScreen = document.createElement("section");
  modalScreen.setAttribute("id", "modalScreen");
  modalScreen.classList.add("flex");

  modal.setAttribute("id", "modal");

  modalScreen.appendChild(modal);

  main.appendChild(modalScreen);
};
const destroyModal = () => {
  document.getElementById("modalScreen").remove();
};


loginBtn.addEventListener("click", () => {
  logInUser();
});

const getCurrentUser = () => {
  let users = JSON.parse(localStorage.getItem("users"));
  let currentUserId = localStorage.getItem("loggedInUser");
  let currentUser = users.find((user) => +user.id === +currentUserId);

  return currentUser;
};

