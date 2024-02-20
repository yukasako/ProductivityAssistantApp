createTodoBtn.addEventListener("click", () => {
  // Create input form
  let todoInput = document.createElement("div");
  todoInput.innerHTML = `
    <div>
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
    <label for="category">Category</label>
    <select name="category" id="category">
      <option value="study">Stydy</option>
      <option value="training">Training</option>
    </select>
    <br>
    <button id="saveTodoBtn">Save</button>
  </div>
    `;
  content.append(todoInput);

  // Save the input data to local storage.
  let saveTodoBtn = document.querySelector("#saveTodoBtn");
  saveTodoBtn.addEventListener("click", () => {

    let inputTitle = document.querySelector("#title").value;
    let inputDescription = document.querySelector("#description").value;
    let inputStatus = document.querySelector("#status").value;
    let inputDeadline = document.querySelector("#deadline").value;
    let inputTimeEstimate = document.querySelector("#timeEstimate").value;
    let inputCategory = document.querySelector("#category").value;

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

    // Retrieve users array from local storage
    let users = JSON.parse(localStorage.getItem('users'));

    // Push todo input to the user array.
    users[0].todos.push(todo);

    // Save updated users array back to local storage
    localStorage.setItem('users', JSON.stringify(users));
    
    todoInput.innerHTML = ""
  });
});

// この４つだけ使うよ
// localStorage.setItem("data", "My local Data");
// localStorage.getItem("data");
// sessionStorage.setItem("data", "My local Data");
// sessionStorage.getItem("data");

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
