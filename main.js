// exempeldata

// let todo = {
// userId: 1
//   title: "title",
//   description: "loremloremlorem",
//   completed: true,
//   deadline: "2024-04-04",
//   timeEstimate: {
//     hours: 0,
//     minutes: 40,
//   },
//   category: "pleasure",
// };

// let habit = {
// userId: 1,
//   title: "title",
//   streak: 6,
//   priority: "high",
// };

// let user = {
//     id: 1,
//     username: "test",
//     password: "test123",
//     loggedIn: true
// }

import("/login-register.js");
import("/loggedin.js");

// globala variabler i main

let usernameInput = document.querySelector("#username");
let passwordInput = document.querySelector("#password");

let registerBtn = document.querySelector("#register");
let loginBtn = document.querySelector("#logIn");

let statusMsg = document.querySelector("#statusMsg");

let users = [];
