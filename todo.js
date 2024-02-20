createTodoBtn.addEventListener("click", () => {
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
    <button id="saveTodo">Save</button>
  </div>
    `;
  document.body.append(todoInput);
});
