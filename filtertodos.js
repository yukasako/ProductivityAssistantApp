filterTodosBtn.addEventListener("click", () => {
  let status = todosFilterSelect.value;
  let checkedCategories = document.querySelectorAll(
    "[name='category']:checked"
  );
  let chosenCategories = [];

  checkedCategories.forEach((checkbox) =>
    chosenCategories.push(checkbox.value.toLowerCase())
  );

  let currentUserId = localStorage.getItem("loggedInUser");

  users = JSON.parse(localStorage.getItem("users"));

  let chosenTodos = [];

  let currentUser = users.find((user) => +user.id === +currentUserId);

  currentUser.todos.forEach((todo) => {
    if (
      (chosenCategories.includes(todo.category) ||
        chosenCategories.length === 0) &&
      (status === "" || status === todo.completed)
    ) {
      chosenTodos.push(todo);
    }
  });
});
