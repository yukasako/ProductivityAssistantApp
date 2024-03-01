let todoInput = document.createElement("div");
todoInput.id = "createTodoModal";
const createNewTodo = () => {
  requiredMsg.innerText = "";
  if (todoInput.innerHTML === "") {
    // Create input form

    let categoryDiv = document.createElement("div");
    categoryDiv.classList.add("flex");
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
    <h2>New Todo</h2>
    <div class="flex requiredField"><label for="todoTitle">Title</label>
    <input type="text" name="todoTitle" id="todoTitle"><span class="required">*</span></div>
    <div class="flex>"<label for="description">Description</label>
    <textarea name="description" id="description"></textarea>
    </div>
    <div class="flex"><label for="deadline">Deadline</label>
    <input type="date" name="deadline" id="deadline" min="${getToday()}">
    </div>
    <div class="flex"><label for="timeEstimate">Time Estimate</label>
    <input type="time" name="timeEstimate" id="timeEstimate">
    </div>
    `;

    let saveTodoBtn = document.createElement("button");
    saveTodoBtn.innerText = "Save";

    todoInput.append(categoryDiv, saveTodoBtn);
    modal.append(todoInput);

    let required = todoInput.querySelector(".requiredField");
    required.before(requiredMsg);

    createModal();

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
  let [hours, minutes] = inputTimeEstimate.split(":").map((num) => num);

  let timeEstimate;
  if (!inputTimeEstimate) {
    timeEstimate = { hours: "00", minutes: "00" };
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

    renderTodoCards(user.todos, false);
    resetTodoFilterAndSorting();
    destroyModal();
  } else {
    requiredMsg.innerText = "Title is required";
  }
};

createTodoBtn.addEventListener("click", () => {
  createNewTodo();
});

// function that creates todo card
// called upon in both renderTodoList function and createTodoBtn event listener
const createTodoCard = (todo, id) => {
  let li = document.createElement("li");
  li.dataset.id = id;
  li.classList.add("todo", "clickable", "flex");

  // icon + title html
  let todoInfo = document.createElement("div");
  todoInfo.classList.add("flex", "todoInfo");
  let icon = setIcon(todo.category);
  todoInfo.append(icon);
  todoInfo.innerHTML += `<h3 class="todoTitle">${todo.title}</h3>`;

  // complete checkbox and archive icon (if completed)
  let actionDiv = document.createElement("div");
  actionDiv.classList.add("flex", "todoActions");

  let completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  if (todo.completed == true || todo.completed == "true") {
    li.classList.add("disabled");
    completedCheckbox.checked = true;
  }
  actionDiv.append(completedCheckbox);

  let archiveIcon = document.createElement("i");
  archiveIcon.classList.add("fa-solid", "fa-box-archive", "clickable");

  archiveIcon.addEventListener("click", () => {
    verifyArchiving(todo);
  });
  archiveIcon.setAttribute("title", "Click to Archive Todo");

  completedCheckbox.addEventListener("change", () => {
    completedCheckbox.checked ? completeTodo(todo) : unCompleteTodo(todo);
  });

  li.addEventListener("click", (e) => {
    if (
      e.target !== completedCheckbox &&
      (todo.completed == "false" || todo.completed == false)
    ) {
      editTodo(id);
    }
  });

  li.append(todoInfo, actionDiv);
  if (todo.completed.toString() === "true") {
    actionDiv.append(archiveIcon);
  }

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
  // Get current user's array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  let user = users.find((user) => user.id === loggedInUser);

  if (todoArr.length === 0 && onload) {
    // Generate from local storage
    let userTodos = [...user.todos];
    // sorting array by status
    userTodos.sort(compareStatus);
    // iterating through array to create cards
    userTodos.forEach((todo) => {
      todoList.append(createTodoCard(todo, todo.id));
    });
  } else {
    // For editing and filtering
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
  requiredMsg.innerText = "";

  // getting current user
  let users = JSON.parse(localStorage.getItem("users"));
  let currentLoggedInId = localStorage.getItem("loggedInUser");
  let user = users.find((user) => +user.id === +currentLoggedInId);

  let todo = user.todos.find((todo) => todo.id === i);

  let editForm = document.createElement("div");
  editForm.classList.add("flex", "flex-column");
  editForm.id = "editTodoModal";
  editForm.innerHTML =
    `<h2>Edit Todo</h2>` +
    `<div class="flex flex-column requiredField"><label for="editTodoTitle">Title</label><input id="editTodoTitle" value="${todo.title}"type="text"/><span class="required">*</span></div>` +
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
  <input type="date" min="${getToday()}" name="editDeadline" id="editDeadline" value="${
      todo.deadline == "9999-12-31" ? "" : todo.deadline
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
    deleteTodo(todo);
  });

  actionButtons.append(saveEditsBtn, deleteBtn);

  editForm.append(actionButtons);

  modal.append(editForm);

  let required = editForm.querySelector(".requiredField");
  required.before(requiredMsg);

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
  let [hours, minutes] = inputTimeEstimate.split(":").map((num) => num);

  let timeEstimate;
  if (!inputTimeEstimate) {
    timeEstimate = { hours: "00", minutes: "00" };
  } else {
    timeEstimate = { hours, minutes };
  }

  if (inputTodoTitle) {
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
  } else {
    requiredMsg.innerText = "Title is required";
  }
};

const deleteTodo = (todo) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = localStorage.getItem("loggedInUser");

  let user = users.find((user) => +user.id === +loggedInUser);

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

const unCompleteTodo = (todo) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = +localStorage.getItem("loggedInUser");

  let user = users.find((user) => user.id === loggedInUser);

  for (let item of user.todos) {
    if (item.id === todo.id) {
      item.completed = false;
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

const saveTodoToArchive = (todo) => {
  // getting current user
  users = JSON.parse(localStorage.getItem("users"));
  let loggedInUser = +localStorage.getItem("loggedInUser");
  let user = users.find((user) => user.id === loggedInUser);

  // matching todo
  let todoToArchive = user.todos.find((item) => item.id === todo.id);

  let indexOfTodo = user.todos.indexOf(todoToArchive);
  // removing todo from main todo array
  user.todos.splice(indexOfTodo, 1);

  // adding todo to archived todos array
  user.archivedTodos.push(todoToArchive);

  // updating local storage
  localStorage.setItem("users", JSON.stringify(users));

  renderTodoCards(user.todos, false);

  // close modal
  destroyModal();
};

const verifyArchiving = (todo) => {
  let proceedBtn = document.createElement("button");
  proceedBtn.classList.add("modalBtn");
  proceedBtn.innerText = "Archive";

  proceedBtn.addEventListener("click", () => {
    saveTodoToArchive(todo);
  });

  let actionButtons = document.createElement("div");
  actionButtons.classList.add("flex", "actionButtons");
  actionButtons.append(proceedBtn);

  let archivingContent = document.createElement("div");
  archivingContent.classList.add("flex", "flex-column");
  archivingContent.id = "archiveTodoModal";

  archivingContent.innerHTML = `<h2>Are you sure you want to archive this task?</h2>
  <p>${todo.title}</p>`;

  archivingContent.append(actionButtons);

  modal.append(archivingContent);

  createModal();
};

const resetTodoFilterAndSorting = () => {
  todoStatusSelect.querySelector("[value='']").selected = true;
  todoSortingSelect.querySelector("[value='']").selected = true;
  todoCheckboxes.querySelectorAll("[name='category']").forEach((checkbox) => {
    checkbox.checked = false;
  });
};

if (localStorage.getItem("loggedInUser")) {
  renderTodoCards(emptyArr, true);
}
