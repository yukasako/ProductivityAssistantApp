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
// let content = document.querySelector("#content");
// let createTodoBtn = document.querySelector("#createTask");

let statusMsg = document.querySelector("#statusMsg");

let users = [];

// creating articles
let greeting = document.createElement("article");
greeting.id = "greeting";
let highlights = document.createElement("article");
highlights.id = "highlights";
let content = document.createElement("article");
content.id = "content";
let createTodoBtn = document.createElement("button");
createTodoBtn.innerText = "New Todo";

const toggleUserActions = (ms = 0, msg = "") => {
  if (localStorage.getItem("loggedInUser")) {
    logOutBtn.style.display = "block";
    logInRegisterContent.style.display = "none";
  } else {
    logOutBtn.style.display = "none"; //ändra till classList.add?
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
}

// hiding / showing locked content based on log in status
const toggleContent = () => {
  if (localStorage.getItem("loggedInUser")) {
    content.append(createTodoBtn);
    container.append(highlights, content);
    loadingScreen.append(greeting);
    
    //create a quote
    getQuote();

    //cycle from login screen -> loadin screen -> app screen
    loginScreen.classList.add("displayNone");
    loadingScreen.classList.remove("displayNone");
    setTimeout(()=>{
      loadingScreen.classList.add("displayNone");
      appScreen.classList.remove("displayNone");
    }, 4000)
    
    
  } else {
    content.innerHTML = "";
    container.innerHTML = "";

    //Cycle back to login screen
    setTimeout(()=>{
      appScreen.classList.add("displayNone");
      loginScreen.classList.remove("displayNone");
    }, 2000)
  }
};
