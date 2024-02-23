let todoInput = document.createElement("div");
todoInput.classList.add("todoInputs");

createTodoBtn.addEventListener("click", () => {
  // Create input form

  let categoryDiv = document.createElement("div");
  let categoryLabel = document.createElement("label");
  categoryLabel.innerText = "Category";
  categoryLabel.setAttribute("for", "category");
  let categorySelect = document.createElement("select");
  categorySelect.name = "category";
  categorySelect.id = "categorySelect";

  todoCategories.forEach((cat) => {
    categorySelect.innerHTML += `<option value="${cat.toLowerCase()}">${cat}</option>`;
  });

  categorySelect.append(todoCategories);
  categoryDiv.append(categoryLabel, categorySelect);
  todoInput.innerHTML = `
    <h2>Input New Todo</h2>
    <label for="title">Title</label>
    <input type="text" name="todoTitle" id="todoTitle"><br>
    <label for="description">Description</label>
    <input type="text" name="description" id="description">
    <br>
    <label for="deadline">Deadline</label>
    <input type="date" name="deadline" id="deadline">
    <br>
    <label for="timeEstimate">Time Estimate</label>
    <input type="time" name="timeEstimate" id="timeEstimate">
    <br>
    `;

  let saveTodoBtn = document.createElement("button");
  saveTodoBtn.innerText = "Save";

  todoInput.append(categoryDiv, saveTodoBtn);
  createNewTodoDiv.append(todoInput);

  saveTodoBtn.addEventListener("click", () => {
    // 1, Save the input data to local storage.
    let inputTitle = document.querySelector("#todoTitle").value;
    let inputDescription = document.querySelector("#description").value;
    let inputDeadline = document.querySelector("#deadline").value;
    let inputTimeEstimate = document.querySelector("#timeEstimate").value;
    let inputCategory = document.querySelector("#categorySelect").value;

    // if user didnt chose a category, set it to the first one
    if (!inputCategory) {
      inputCategory = document.querySelector("#categorySelect option").value;
    }

    // Extract hours and minutes from inputTimeEstimate
    let [hours, minutes] = inputTimeEstimate
      .split(":")
      .map((num) => parseInt(num));

    // 2, Generate a todo card to DOM.

    //ensure user entered a title before creating new todo
    if (inputTitle) {
      // Create todo object
      let todo = {
        title: inputTitle,
        description: inputDescription,
        completed: false,
        deadline: inputDeadline,
        timeEstimate: {
          hours: hours,
          minutes: minutes,
        },
        category: inputCategory,
      };

      // Get users array from local storage
      let users = JSON.parse(localStorage.getItem("users"));

      // Get logged users ID
      let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));

      // Find the logged-in user by ID and push todo to their todos array
      let user = users.find((user) => user.id === loggedInUser);

      user.todos.push(todo);

      // Save updated users array back to local storage
      localStorage.setItem("users", JSON.stringify(users));
      todoInput.innerHTML = "";

      let todoCard = createTodoCard(todo, user.todos.length - 1);
      todoList.append(todoCard);
    }
  });
});

// function that creates todo card
// called upon in both renderTodoList function and createTodoBtn event listener
const createTodoCard = (todo, index) => {
  let li = document.createElement("li");
  li.style.border = "1px solid lightpink";
  li.dataset.index = index;
  li.classList.add("todo");

  let icon = setIcon(todo.category);

  let completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";

  completedCheckbox.addEventListener("click", (e) => {});

  li.append(icon, todo.title, completedCheckbox);

  return li;
};

// function that assigns icon based on category
const setIcon = (cat) => {
  let icon = document.createElement("i");

  switch (cat.toLowerCase()) {
    case "work":
      icon.classList.add("fa-solid", "fa-briefcase");
      break;
    case "workout":
      icon.classList.add("fa-solid", "fa-dumbbell");
      break;
    case "health":
      icon.classList.add("fa-solid", "fa-heart-pulse");
      break;
    case "studying":
      icon.classList.add("fa-solid", "fa-graduation-cap");
      break;
    case "home":
      icon.classList.add("fa-solid", "fa-house-chimney");
      break;
    case "leasure":
      icon.classList.add("fa-solid", "fa-icons");
      break;
  }
  return icon;
};

// Generate Todo-cards based on localStorage
const renderTodoCards = (todoArr = [], onload = false) => {
  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  // Find the logged-in user by ID and push todo to their todos array
  let user = users.find((user) => user.id === loggedInUser);

  if (todoArr.length === 0 && onload) {
    user.todos.forEach((todo, i) => {
      todoList.append(createTodoCard(todo, i));
    });
  } else {
    todoArr.forEach((todo, i) => {
      todoList.append(createTodoCard(todo, i));
    });
  }

  todoContainer.append(todoList);
};

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

  let currentUser = users.find((user) => +user.id === +currentUserId);

  let categoryMatches = false;
  let statusMatches = false;
  let chosenTodos = currentUser.todos.filter((todo) => {
    if (
      chosenCategories.includes(todo.category) ||
      chosenCategories.length === 0
    ) {
      categoryMatches = true;
    }

    if (todo.completed === status || status === "" || status === null) {
      statusMatches = true;
    }

    return categoryMatches && statusMatches;
  });

  console.log(chosenTodos);

  todoList.innerHTML = "";
  renderTodoCards(chosenTodos, false);
});

renderTodoCards(emptyArr, onLoad);
