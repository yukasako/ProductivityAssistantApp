let todoInput = document.createElement("div");
todoInput.classList.add("todoInputs");

const createNewTodo = () => {
  if (todoInput.innerHTML === "") {
    // Create input form

    let categoryDiv = document.createElement("div");
    let categoryLabel = document.createElement("label");
    categoryLabel.innerText = "Category";
    categoryLabel.setAttribute("for", "categorySelect");
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
    <label for="todoTitle">Title</label>
    <input type="text" name="todoTitle" id="todoTitle"><br>
    <label for="description">Description</label>
    <input type="text" name="description" id="description">
    <br>
    <label for="deadline">Deadline</label>
    <input type="date" name="deadline" id="deadline" min="${new Date()}">
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
      saveNewTodo();
    });
  } else {
    todoInput.innerHTML = "";
  }
};

const saveNewTodo = () => {
  // Save the input data to local storage.
  let inputTitle = document.querySelector("#todoTitle").value;
  let inputDescription = document.querySelector("#description").value;
  let inputDeadline = document.querySelector("#deadline").value;
  let inputTimeEstimate = document.querySelector("#timeEstimate").value;
  let inputCategory = document.querySelector("#categorySelect").value;

  // if user didnt chose a category, set it to the first one
  if (!inputCategory) {
    inputCategory = document.querySelector("#categorySelect option").value;
  }

  // setting default date value if none entered
  if (!inputDeadline) {
    inputDeadline = "9999-12-31";
  }

  // Extract hours and minutes from inputTimeEstimate
  let [hours, minutes] = inputTimeEstimate
    .split(":")
    .map((num) => parseInt(num));

  let timeEstimate;
  if (!inputTimeEstimate) {
    timeEstimate = { hours: 0, minutes: 0 };
  } else {
    timeEstimate = { hours, minutes };
  }

  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));

  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));

  // Find the logged-in user by ID and push todo to their todos array
  let user = users.find((user) => user.id === loggedInUser);

  // generate random id
  let todoId = generateId(user.todos);

  // Generate a todo card to DOM.

  //ensure user entered a title before creating new todo
  if (inputTitle) {
    // Create todo object
    let todo = {
      id: todoId,
      title: inputTitle,
      description: inputDescription,
      completed: false,
      deadline: inputDeadline,
      timeEstimate,
      category: inputCategory,
    };

    user.todos.push(todo);

    // Save updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));
    todoInput.innerHTML = "";

    let todoCard = createTodoCard(todo, todo.id);
    todoList.prepend(todoCard);
  }
};

createTodoBtn.addEventListener("click", () => {
  createNewTodo();
});

// function that creates todo card
// called upon in both renderTodoList function and createTodoBtn event listener
const createTodoCard = (todo, id) => {
  let li = document.createElement("li");
  li.style.border = "1px solid lightpink";
  li.dataset.id = id;
  li.classList.add("todo");

  let icon = setIcon(todo.category);

  let completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  if (todo.completed == true || todo.completed == "true") {
    li.classList.add("disabled");
    completedCheckbox.checked = true;
    completedCheckbox.disabled = true;
  }

  completedCheckbox.addEventListener("change", () => {
    completeTodo(todo);
  });

  li.addEventListener("click", (e) => {
    if (
      e.target !== completedCheckbox &&
      (todo.completed == "false" || todo.completed == false)
    ) {
      editTodo(id);
    }
  });

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
  // clear previous content
  todoList.innerHTML = "";
  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  // Find the logged-in user by ID and push todo to their todos array
  let user = users.find((user) => user.id === loggedInUser);

  if (todoArr.length === 0 && onload) {
    let userTodos = [...user.todos];
    // sorting array by status
    userTodos.sort(compareStatus);
    // iterating through array to create cards
    userTodos.forEach((todo) => {
      todoList.append(createTodoCard(todo, todo.id));
    });
  } else {
    // sorting array by status
    todoArr.sort(compareStatus);
    // iterating through array to create cards
    todoArr.forEach((todo) => {
      todoList.append(createTodoCard(todo, todo.id));
    });
  }

  todoContainer.append(todoList);
};

const filterAndSortTodos = () => {
  let status = document.querySelector("#todosFilterSelect").value;
  let checkedCategories = document.querySelectorAll(
    "[name='category']:checked"
  );

  // array to hold values for chosen categories
  let chosenCategories = [];

  // retrieving the values from checked boxes
  checkedCategories.forEach((checkbox) =>
    chosenCategories.push(checkbox.value.toLowerCase())
  );

  // getting current logged in user
  let currentUserId = localStorage.getItem("loggedInUser");

  // getting list of users
  users = JSON.parse(localStorage.getItem("users"));

  // matching current user
  let currentUser = users.find((user) => +user.id === +currentUserId);

  // array to hold the todos that match chosen filters
  let chosenTodos = [];

  // populating the chosenTodos array using filter method
  chosenTodos = currentUser.todos.filter((todo) => {
    return (
      (chosenCategories.includes(todo.category) ||
        chosenCategories.length === 0) &&
      (todo.completed.toString() === status || status === "")
    );
  });

  let selectedSortingOption = todoSortingSelect.value;

  switch (selectedSortingOption) {
    case "":
      break;
    case "deadlineDesc":
      chosenTodos.sort((a, b) => {
        let aDeadline = new Date(a.deadline).getTime();
        let bDeadline = new Date(b.deadline).getTime();
        return aDeadline < bDeadline ? 1 : bDeadline < aDeadline ? -1 : 0;
      });
      break;
    case "deadlineAsc":
      chosenTodos.sort((a, b) => {
        let aDeadline = new Date(a.deadline).getTime();
        let bDeadline = new Date(b.deadline).getTime();
        return aDeadline > bDeadline ? 1 : bDeadline > aDeadline ? -1 : 0;
      });
      break;
    case "timeDesc":
      chosenTodos.sort((a, b) => {
        let aTime =
          a.timeEstimate.hours.toString() + a.timeEstimate.minutes.toString();
        let bTime =
          b.timeEstimate.hours.toString() + b.timeEstimate.minutes.toString();

        aTime = +aTime;
        bTime = +bTime;

        return aTime < bTime ? 1 : bTime < aTime ? -1 : 0;
      });
      break;
    case "timeAsc":
      chosenTodos.sort((a, b) => {
        let aTime =
          a.timeEstimate.hours.toString() + a.timeEstimate.minutes.toString();
        let bTime =
          b.timeEstimate.hours.toString() + b.timeEstimate.minutes.toString();

        aTime = +aTime;
        bTime = +bTime;

        return bTime < aTime ? 1 : aTime < bTime ? -1 : 0;
      });
      break;
  }

  // clearing the current ul
  todoList.innerHTML = "";
  // generating new list based on new todo list
  renderTodoCards(chosenTodos, false);
};

todosFilterSelect.addEventListener("change", () => {
  filterAndSortTodos();
});

let categoryCheckboxes = document.querySelectorAll("[name='category']");

categoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    filterAndSortTodos();
  });
});

const editTodo = (i) => {
  // getting current user
  let users = JSON.parse(localStorage.getItem("users"));
  let currentLoggedInId = localStorage.getItem("loggedInUser");
  let user = users.find((user) => +user.id === +currentLoggedInId);

  let todo = user.todos.find((todo) => todo.id === i);

  let modalContent = document.createElement("div");
  modalContent.classList.add("modalContent");
  modal.append(modalContent);

  let editForm = document.createElement("div");
  editForm.classList.add("editForm", "flex", "flex-column");
  editForm.innerHTML =
    `<div class="flex flex-column"><label for="editTodoTitle">Title</label><input id="editTodoTitle" value="${todo.title}"type="text"/></div>` +
    `<div class="flex flex-column"><label for="editTodoDesc">Description</label><textarea id="editTodoDesc">${todo.description}</textarea></div>`;

  let editStatusDiv = document.createElement("div");
  editStatusDiv.classList.add("flex");
  let statusLabel = document.createElement("label");
  statusLabel.setAttribute("for", "editTodoStatus");
  statusLabel.innerText = "Status";
  let editStatus = document.createElement("select");
  editStatus.id = "editTodoStatus";
  if (todo.completed === true) {
    editStatus.innerHTML += `<option value="${todo.completed}" selected="selected">Completed</option><option value="false">Uncompleted</option>`;
  } else {
    editStatus.innerHTML += `<option value="${todo.completed}" selected="selected">Uncompleted</option><option value="true">Completed</option>`;
  }
  editStatusDiv.append(statusLabel, editStatus);

  editForm.append(editStatusDiv);

  editForm.innerHTML +=
    `<div class="flex"><label for="editDeadline">Deadline</label>
  <input type="date" name="editDeadline" id="editDeadline" value="${
    todo.deadline == "9999:12:31" ? "" : todo.deadline
  }"></div>` +
    `<div class="flex"><label for="editTimeEstimate">Time Estimate</label>
  <input type="time" name="editTimeEstimate" id="editTimeEstimate" value="${todo.timeEstimate.hours}:${todo.timeEstimate.minutes}"></div>`;

  let editCategoryDiv = document.createElement("div");
  editCategoryDiv.classList.add("flex");
  editCategoryDiv.innerHTML += "<label for='editCategory'>Category</label>";
  let categorySelect = document.createElement("select");
  categorySelect.name = "editCategory";
  categorySelect.id = "editCategory";

  todoCategories.forEach((cat) => {
    if (todo.category === cat.toLowerCase()) {
      categorySelect.innerHTML += `<option value="${cat.toLowerCase()}" selected="selected">${cat}</option>`;
    } else {
      categorySelect.innerHTML += `<option value="${cat.toLowerCase()}">${cat}</option>`;
    }
  });

  editCategoryDiv.append(categorySelect);

  editForm.append(editCategoryDiv);

  // buttons
  let actionButtons = document.createElement("div");
  actionButtons.classList.add("actionButtons", "flex");

  // save edits button
  let saveEditsBtn = document.createElement("button");
  saveEditsBtn.id = "saveTodoEdits";
  saveEditsBtn.classList.add("modalBtn");
  saveEditsBtn.innerText = "Save";
  saveEditsBtn.addEventListener("click", () => {
    // save changes
    saveTodoEdits(todo);
  });

  // delete todo button
  let deleteBtn = document.createElement("button");
  deleteBtn.id = "deleteTodo";
  deleteBtn.classList.add("modalBtn", "danger");
  deleteBtn.innerText = "Delete Todo";
  deleteBtn.addEventListener("click", () => {
    //delete todo
    console.log(todo);
    deleteTodo(todo);
  });

  actionButtons.append(saveEditsBtn, deleteBtn);

  editForm.append(actionButtons);

  modalContent.append(editForm);

  createModal();
};

const saveTodoEdits = (todo) => {
  // 1, Save the input data to local storage.
  let inputTodoTitle = document.querySelector("#editTodoTitle").value;
  let inputTodoDesc = document.querySelector("#editTodoDesc").value;
  let inputStatus = document.querySelector("#editTodoStatus").value;
  let inputDeadline = document.querySelector("#editDeadline").value;
  let inputTimeEstimate = document.querySelector("#editTimeEstimate").value;
  let inputCategory = document.querySelector("#editCategory").value;

  inputDeadline == ""
    ? (inputDeadline = "9999-12-31")
    : (inputDeadline = inputDeadline);

  // Extract hours and minutes from inputTimeEstimate
  let [hours, minutes] = inputTimeEstimate
    .split(":")
    .map((num) => parseInt(num));

  let timeEstimate;
  if (!inputTimeEstimate) {
    timeEstimate = { hours: 0, minutes: 0 };
  } else {
    timeEstimate = { hours, minutes };
  }
  // Create todo object
  let editedTodo = {
    id: todo.id,
    title: inputTodoTitle,
    description: inputTodoDesc,
    completed: inputStatus,
    deadline: inputDeadline,
    timeEstimate,
    category: inputCategory,
  };

  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  // Find the logged-in user by ID and push todo to their todos array
  let user = users.find((user) => user.id === loggedInUser);
  let activeTodo = user.todos.find((item) => +item.id === +todo.id);
  let index = user.todos.indexOf(activeTodo);
  user.todos[index] = editedTodo;
  // Save updated users array back to local storage
  localStorage.setItem("users", JSON.stringify(users));

  let updatedList = user.todos;

  renderTodoCards(updatedList, false);
  destroyModal();
};

const deleteTodo = (todo) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = localStorage.getItem("loggedInUser");

  let user = users.find((user) => +user.id === +loggedInUser);

  console.log("User: ", user.id);
  let todoToDelete = user.todos.find((item) => +item.id === +todo.id);

  // finding index of item
  let index = user.todos.indexOf(todoToDelete);

  // removing from array
  user.todos.splice(index, 1);

  localStorage.setItem("users", JSON.stringify(users));

  renderTodoCards(user.todos, false);
  destroyModal();
};

const completeTodo = (todo) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = +localStorage.getItem("loggedInUser");

  let user = users.find((user) => user.id === loggedInUser);

  for (let item of user.todos) {
    if (item.id === todo.id) {
      item.completed = true;
    }
  }
  localStorage.setItem("users", JSON.stringify(users));

  renderTodoCards(user.todos, false);
};

const compareStatus = (a) => {
  if (a.completed.toString() === "true") {
    return 1;
  }
  if (a.completed.toString() === "false") {
    return -1;
  }
  return 0;
};

// sorting todos

todoSortingSelect.addEventListener("change", (e) => {
  filterAndSortTodos();
});

const sortTodos = (option) => {
  users = JSON.parse(localStorage.getItem("users"));
  let loggedInUser = +localStorage.getItem("loggedInUser");

  let user = users.find((user) => user.id === loggedInUser);

  let userTodos = [...user.todos];
  switch (option) {
    case "":
      renderTodoCards(userTodos, false);
      break;
    case "deadlineDesc":
      userTodos.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      break;
    case "deadlineAsc":
      userTodos.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
      break;
    case "timeDesc":
      userTodos.sort((a, b) => {
        let aTime =
          a.timeEstimate.hours.toString() + a.timeEstimate.minutes.toString();
        let bTime =
          b.timeEstimate.hours.toString() + b.timeEstimate.minutes.toString();

        aTime = +aTime;
        bTime = +bTime;

        return aTime < bTime ? 1 : bTime < aTime ? -1 : 0;
      });
      break;
    case "timeAsc":
      userTodos.sort((a, b) => {
        let aTime =
          a.timeEstimate.hours.toString() + a.timeEstimate.minutes.toString();
        let bTime =
          b.timeEstimate.hours.toString() + b.timeEstimate.minutes.toString();

        aTime = +aTime;
        bTime = +bTime;

        return bTime < aTime ? 1 : aTime < bTime ? -1 : 0;
      });
      break;
  }

  renderTodoCards(userTodos, false);
};

renderTodoCards(emptyArr, true);
