// function that creates habit card
// called upon in both renderHabitList function and createHabitBtn event listener
const createHabitCard = (habit, index) => {
  let li = document.createElement("li");
  li.style.border = "1px solid lightblue";
  li.classList.add("habit");
  li.dataset.index = index;

  let streak = document.createElement("p");
  streak.innerText = `Streak: ${habit.streak}`;

  let completedBtn = document.createElement("button");
  completedBtn.innerText = "Complete";
  completedBtn.addEventListener("click", (e) => {
    // (Data)Get current user from local storage
    let users = JSON.parse(localStorage.getItem("users"));
    let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
    let user = users.find((user) => user.id === loggedInUser);
    // Get the streak of the habit and +1
    let streak = parseInt(user.habits[index].streak);
    user.habits[index].streak = streak + 1;
    // Save updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));

    //(DOM)Get streakDOM and update to the same as data.
    let streakElement = li.querySelector("p");
    streakElement.innerText = `Streak: ${user.habits[index].streak}`;

    // Set timer on completeBtn
    completedBtn.disabled = true;
    let timer = 43200000;
    setTimeout(() => {
      completedBtn.disabled = false;
    }, timer);
  });

  // Edit habit
  let editHabitField = document.createElement("div");
  let editHabitBtn = document.createElement("button");
  editHabitBtn.innerText = "Edit";
  editHabitBtn.addEventListener("click", () => {
    // Empty the card and make edit-input-field.
    li.innerText = "";
    editHabitField.innerHTML = `<h2>Edit Habit</h2>
    <label for="habitTitle">Title</label>
    <input type="text" name="habitTitle" id="habitTitle" value=${habit.title}><br>
    <label for="priority">Priority</label>
    <input type="number" min="0" name="priority" id="priority" value=${habit.priority}><br>
    <label for="streak">Streak</label>
    <input type="number" min="0" name="priority" id="priority" value=${habit.streak}>`;

    // SaveBtn to edit update.
    let saveEditBtn = document.createElement("button");
    saveEditBtn.innerText = "Save edit";
    li.append(editHabitField, saveEditBtn);
    saveEditBtn.addEventListener("click", () => {
      // 1, Save the input data to local storage.
      let inputHabitTitle = document.querySelector("#habitTitle").value;
      let inputPriority = document.querySelector("#priority").value;
      // Create habit object
      let habit = {
        title: inputHabitTitle,
        streak: 0,
        priority: inputPriority,
      };
      // Get users array from local storage
      let users = JSON.parse(localStorage.getItem("users"));
      // Get logged users ID
      let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
      // Find the logged-in user by ID and push habit to their habits array
      let user = users.find((user) => user.id === loggedInUser);
      user.habits[index] = habit;
      // Save updated users array back to local storage
      localStorage.setItem("users", JSON.stringify(users));

      // 2, Updated info to DOM.
      li.innerHTML = "";
      editHabitField.innerHTML = "";
      li.append(
        habit.title,
        ", Priority: " + habit.priority,
        completedBtn,
        editHabitBtn,
        streak,
        editHabitField
      );

      return li;
    });
  });

  li.append(
    habit.title,
    ", Priority: " + habit.priority,
    completedBtn,
    editHabitBtn,
    streak,
    editHabitField
  );

  return li;
};

let habitInput = document.createElement("div");
createHabitBtn.addEventListener("click", () => {
  // Create input form
  habitInput.innerHTML = `
    <h2>Input New Habit</h2>
    <label for="habitTitle">Title</label>
    <input type="text" name="habitTitle" id="habitTitle"><br>
    <label for="priority">Priority</label>
    <input type="number" min="0" name="priority" id="priority"><br>
  `;

  let saveHabitBtn = document.createElement("button");
  saveHabitBtn.innerText = "Save";

  habitInput.append(saveHabitBtn);
  createNewHabitDiv.append(habitInput);

  saveHabitBtn.addEventListener("click", () => {
    // 1, Save the input data to local storage.
    let inputHabitTitle = document.querySelector("#habitTitle").value;
    let inputPriority = document.querySelector("#priority").value;

    // Create habit object
    let habit = {
      title: inputHabitTitle,
      streak: 0,
      priority: inputPriority,
    };

    // Get users array from local storage
    let users = JSON.parse(localStorage.getItem("users"));
    // Get logged users ID
    let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
    // Find the logged-in user by ID and push habit to their habits array
    let user = users.find((user) => user.id === loggedInUser);
    user.habits.push(habit);

    // Save updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));
    habitInput.innerHTML = "";

    // 2, Generate a habit card to DOM.
    let habitCard = createHabitCard(habit, user.habits.length - 1);
    habitList.prepend(habitCard);
  });
});

// Generate habit-cards based on localStorage
const renderHabitCards = (habitArr = [], onload = false) => {
  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  // Find the logged-in user by ID and push habit to their habits array
  let user = users.find((user) => user.id === loggedInUser);

  if (habitArr.length === 0 && onload) {
    user.habits.forEach((habit, i) => {
      habitList.append(createHabitCard(habit, i));
    });
  } else {
    habitArr.forEach((habit, i) => {
      habitList.append(createHabitCard(habit, i));
    });
  }

  habitContainer.append(habitList);
};

const filterHabits = () => {
  let chosenPriority = document.querySelector("#priorityFilter").value;

  // getting current logged in user
  let currentUserId = localStorage.getItem("loggedInUser");

  // getting list of users
  users = JSON.parse(localStorage.getItem("users"));

  // matching current user
  let currentUser = users.find((user) => +user.id === +currentUserId);

  // array to hold the habits that match chosen filters
  let chosenHabits = [];

  // populating the chosenHabits array using filter method
  chosenHabits = currentUser.habits.filter((habit) => {
    return habit.priority === chosenPriority || chosenPriority === "";
  });

  // clearing the current ul
  habitList.innerHTML = "";
  // generating new list based on new habit list
  renderHabitCards(chosenHabits, false);
};

filterHabitsBtn.addEventListener("click", () => {
  filterHabits();
});

renderHabitCards(emptyArr, true);
