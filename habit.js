// function that creates habit card
// called upon in both renderHabitList function and createHabitBtn event listener
const createHabitCard = (habit, index) => {
  let li = document.createElement("li");
  li.style.border = "1px solid lightblue";
  li.classList.add("habit");
  li.dataset.index = index;

  let completedCheckbox = document.createElement("input");
  completedCheckbox.type = "checkbox";
  completedCheckbox.addEventListener("click", (e) => {});

  li.append(
    completedCheckbox,
    "Title: " + habit.title,
    "/ Priority: " + habit.priority,
    "/ Streak: " + habit.streak
  );

  return li;
};

let habitInput = document.createElement("div");
createHabitBtn.addEventListener("click", () => {
  // Create input form
  habitInput.innerHTML = `
    <label for="habitTitle">Title</label>
    <input type="text" name="habitTitle" id="habitTitle"><br>
    <label for="streak">Streak</label>
    <input type="number" min="0" name="streak" id="streak"><br>
    <label for="priority">Priority</label>
    <input type="number" min="0" name="priority" id="priority"><br>
    `;

  let saveHabitBtn = document.createElement("button");
  saveHabitBtn.innerText = "Save";

  habitInput.append(saveHabitBtn);
  content.append(habitInput);

  saveHabitBtn.addEventListener("click", () => {
    // 1, Save the input data to local storage.
    let inputHabitTitle = document.querySelector("#habitTitle").value;
    let inputStreak = document.querySelector("#streak").value;
    let inputPriority = document.querySelector("#priority").value;

    // Create todo object
    let habit = {
      title: inputHabitTitle,
      streak: inputStreak,
      priority: inputPriority,
    };

    // Get users array from local storage
    let users = JSON.parse(localStorage.getItem("users"));
    // Get logged users ID
    let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
    // Find the logged-in user by ID and push todo to their todos array
    let user = users.find((user) => user.id === loggedInUser);
    user.habits.push(habit);

    // Save updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));
    habitInput.innerHTML = "";

    // 2, Generate a todo card to DOM.
    let habitCard = createHabitCard(habit, user.habits.length - 1);
    habitList.append(habitCard);
  });
});

// Generate Todo-cards based on localStorage
const renderHabitCards = () => {
  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  // Find the logged-in user by ID and push todo to their todos array
  let user = users.find((user) => user.id === loggedInUser);

  user.habits.forEach((habit, i) => {
    habitList.append(createHabitCard(habit, i));
  });

  habitContainer.append(habitList);
};
renderHabitCards();
