logOutBtn.addEventListener("click", () => {
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
});
