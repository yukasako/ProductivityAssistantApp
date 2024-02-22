let todoInput = document.createElement("div");
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
    <label for="title">Title</label>
    <input type="text" name="title" id="title"><br>
    <label for="description">Description</label>
    <input type="text" name="description" id="description"><br>
    <label for="status">Status</label>
    <select name="status" id="status">
      <option value="false">Uncompleted</option>
      <option value="true">Completed</option>
    </select>
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
  content.append(todoInput);

  saveTodoBtn.addEventListener("click", () => {
    // 1, Save the input data to local storage.
    let inputTitle = document.querySelector("#title").value;
    let inputDescription = document.querySelector("#description").value;
    let inputStatus = document.querySelector("#status").value;
    let inputDeadline = document.querySelector("#deadline").value;
    let inputTimeEstimate = document.querySelector("#timeEstimate").value;
    let inputCategory = document.querySelector("#categorySelect").value;

    // Extract hours and minutes from inputTimeEstimate
    let [hours, minutes] = inputTimeEstimate
      .split(":")
      .map((num) => parseInt(num));

    // Create todo object
    let todo = {
      title: inputTitle,
      description: inputDescription,
      completed: inputStatus,
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
    todoListUncompleted.append(todoCard);
  });
});

// function that creates todo card
// called upon in both renderTodoList function and createTodoBtn event listener
const createTodoCard = (todo, index) => {
  let li = document.createElement("li");
  li.dataset.index = index;

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
  }
  return icon;
};

// Generate Todo-cards based on localStorage
const renderTodoCards = () => {
  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  // Find the logged-in user by ID and push todo to their todos array
  let user = users.find((user) => user.id === loggedInUser);

  user.todos.forEach((todo, i) => {
    if(todo.completed){
      todoListCompleted.append(createTodoCard(todo, i))
    }else{
      todoListUncompleted.append(createTodoCard(todo, i))

    }
  })

  todoContainer.append(todoListUncompleted, todoListCompleted)
};

renderTodoCards();
