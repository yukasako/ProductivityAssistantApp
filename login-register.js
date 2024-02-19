console.log("login-register.js");

const createNewUser = (username, password) => {};

registerBtn.addEventListener("click", () => {
  let username = usernameInput.value;
  let password = passwordInput.value;
  let id;

  if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));

    let existingUser = users.find((user) => user.username === username);

    if (!existingUser) {
      statusMsg.innerText = "";
      id = users.length + 1;
      let newUser = { id, username, password };
      users.push(newUser);

      let newUserList = [...users];

      localStorage.setItem("users", JSON.stringify(newUserList));
    } else {
      statusMsg.innerText = "User already exists!";
    }
  } else {
    statusMsg.innerText = "";
    let newUser = { id: 1, username, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  }
});

loginBtn.addEventListener("click", () => {
  if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
  }
});
