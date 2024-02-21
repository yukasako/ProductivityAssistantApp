registerBtn.addEventListener("click", () => {
  statusMsg.innerText = "";
  let username = usernameInput.value;
  let password = passwordInput.value;
  let id;

  // checking if user entered values
  if (username && password) {
    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));

      let existingUser = users.find((user) => user.username === username);

      if (!existingUser) {
        id = users.length + 1;
        let newUser = {
          id,
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
        id: 1,
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
});

loginBtn.addEventListener("click", () => {
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
});

toggleUserActions();
toggleContent();
