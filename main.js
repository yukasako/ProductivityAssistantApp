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

import("/login-register.js");
import("/loggedin.js");
// import("/quote.js");
import("/logout.js");
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

let container = document.querySelector("#container");

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
let onLoad = true;

console.log("hejhej");
let greeting = document.createElement("article");
greeting.id = "greeting";
let highlights = document.createElement("article");
highlights.id = "highlights";
let content = document.createElement("article");
content.id = "content";

// todo filters and sorting + all todos here¨
let todoContent = document.createElement("section");
todoContent.classList.add("todoContent");
// habit filters and sorting + all habits here
let habitsContent = document.createElement("section");
habitsContent.classList.add("habitsContent");

content.append(todoContent, habitsContent);

let createNewTodoDiv = document.createElement("div");
let createTodoBtn = document.createElement("button");
createTodoBtn.innerText = "New Todo";
createNewTodoDiv.append(createTodoBtn);

let todoContainer = document.createElement("article");
todoContainer.id = "todoContainer";
let todoList = document.createElement("ul");
todoList.classList.add("todoList");

let createHabitDiv = document.createElement("div");
let createHabitBtn = document.createElement("button");
createHabitBtn.innerText = "New Habit";
createHabitDiv.append(createHabitBtn);

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
let todosFilterSelect = document.createElement("select");
todosFilterSelect.innerHTML =
  "<option value='' selected>All</option><option value='false'>Not Completed</option><option value='true'>Completed</option>";
let todoCheckboxes = document.createElement("div");
todoCheckboxes.classList.add("flex");
todoCategories.forEach((cat) => {
  todoCheckboxes.innerHTML += `<div><input type="checkbox" name="category" value="${cat}"/>
    <label>${cat}</label></div>`;
});
todosFilterSection.append(todoCheckboxes, todosFilterSelect, filterTodosBtn);
todoContainer.append(todosFilterSection);

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

const getQuote = async () => {
  try {
    const res = await fetch("https://api.quotable.io/random?maxLength=75?");
    const data = await res.json();
    if (!data || !data.content) {
      throw new Error("Could not retrieve data.");
    }
    const quote = data.content;

    let quoteH2 = document.createElement("h2");
    quoteH2.innerText = quote;
    greeting.appendChild(quoteH2);
  } catch (error) {
    console.error("Error fetching quote:", error);
  }
};

// hiding / showing locked content based on log in status
const toggleContent = () => {
  if (localStorage.getItem("loggedInUser")) {
    todoContent.append(createNewTodoDiv, todoContainer);
    habitsContent.append(createHabitDiv, habitContainer);

    appScreen.append(highlights, content);
    loadingScreen.append(greeting);

    //create a quote
    getQuote();

    //cycle from login screen -> loadin screen -> app screen
    loginScreen.classList.add("displayNone");
    loadingScreen.classList.remove("displayNone");
    setTimeout(() => {
      loadingScreen.classList.add("displayNone");
      appScreen.classList.remove("displayNone");
    }, 5000);

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
const createModal = () => {
  const modalScreen = document.createElement("section");
  modalScreen.setAttribute("id", "modalScreen");
  modalScreen.classList.add("flex");

  const modal = document.createElement("article");
  modal.setAttribute("id", "modal");

  modalScreen.appendChild(modal);

  main.appendChild(modalScreen);
};
const destroyModal = () => {
  document.getElementById("modalScreen").remove();
};
