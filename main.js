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

// globala variabler i main

let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");

let registerBtn = document.querySelector("#register");
let loginBtn = document.querySelector("#logIn");
let logOutBtn = document.querySelector("#logOut");
let logInRegisterContent = document.querySelector("#userDetails");

let content = document.querySelector("#content")
let createTodoBtn = document.querySelector("#createTask");

let statusMsg = document.querySelector("#statusMsg");

const greeting = document.querySelector("#greeting");



let users = [];

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
