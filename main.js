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
import("/quote.js");
import("/logout.js");
import("/todo.js");
import("/filtertodos.js");

// globala variabler i main
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
  "Pleasure",
  "Work",
  "Workout",
  "Health",
  "Studying",
  "Home",
];

// creating articles
let greeting = document.createElement("article");
greeting.id = "greeting";
let highlights = document.createElement("article");
highlights.id = "highlights";
let content = document.createElement("article");
content.id = "content";
let createTodoBtn = document.createElement("button");
createTodoBtn.innerText = "New Todo";

// creating other elements

// todo-filtering
let todosFilterSection = document.createElement("div"); //append this to top of todo list

todosFilterSection.classList.add("flex", "flex-column");
let filterTodosBtn = document.createElement("button");
filterTodosBtn.id = "filterTodos";
filterTodosBtn.innerText = "Filter";
let todosFilterSelect = document.createElement("select");
todosFilterSelect.innerHTML =
  '<option value="" selected>All</option><option value="false">Not Completed</option><option value="true">Completed</option>';
let todoCheckboxes = document.createElement("div");
todoCheckboxes.classList.add("flex");
todoCategories.forEach((cat) => {
  todoCheckboxes.innerHTML += `<div><input type="checkbox" name="category" value="${cat}"/>
    <label>${cat}</label></div>`;
});
todosFilterSection.append(todoCheckboxes, todosFilterSelect, filterTodosBtn);

const toggleUserActions = (ms = 0, msg = "") => {
  if (localStorage.getItem("loggedInUser")) {
    logOutBtn.style.display = "block";
    logInRegisterContent.style.display = "none";
  } else {
    logOutBtn.style.display = "none";
    statusMsg.innerText = msg;
    setTimeout(() => {
      statusMsg.innerText = "";
      logInRegisterContent.style.display = "block";
    }, ms);
  }
};

// hiding / showing locked content based on log in status
const toggleContent = () => {
  if (localStorage.getItem("loggedInUser")) {
    content.append(createTodoBtn);
    container.append(highlights, content);
    loadingScreen.append(greeting);
    
  } else {
    content.innerHTML = "";
    container.innerHTML = "";
  }
};
