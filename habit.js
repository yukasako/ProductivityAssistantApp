// function that creates habit card
// called upon in both renderHabitList function and createHabitBtn event listener
const createHabitCard = (habit, id) => {
  let li = document.createElement("li");
  li.style.border = "1px solid lightblue";
  li.classList.add("habit", "clickable");
  li.dataset.id = id;

  let streak = document.createElement("p");
  streak.innerText = `Streak: ${habit.streak.length} day/s`;

  let completedBtn = document.createElement("button");
  completedBtn.innerText = "Complete";
  completedBtn.addEventListener("click", (e) => {
    // (Data)Get current user from local storage
    let users = JSON.parse(localStorage.getItem("users"));
    let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
    let user = users.find((user) => user.id === loggedInUser);
    let currentHabit = user.habits.find((item) => item.id === habit.id);
    streakIncrementer(currentHabit);
  });

  li.addEventListener("click", (e) => {
    if (e.target !== completedBtn) {
      editHabit(id);
    }
  });

  li.append(habit.title, ", Priority: " + habit.priority, completedBtn, streak);

  return li;
};

const createNewHabit = () => {
  if (habitInput.innerHTML === "") {
    // Create input form
    habitInput.innerHTML = `
 <h2>Input New Habit</h2>
 <label for="habitTitle">Title</label>
 <input type="text" name="habitTitle" id="habitTitle"><br>
 <label for="priority">Priority</label>
 <select id="priority">
 <option value="low" selected="selected">Low</option>
 <option value="medium">Medium</option>
 <option value="high">High</option>
 </select><br>
`;

    let saveHabitBtn = document.createElement("button");
    saveHabitBtn.innerText = "Save";

    habitInput.append(saveHabitBtn);
    createNewHabitDiv.append(habitInput);

    saveHabitBtn.addEventListener("click", () => {
      saveNewHabit();
    });
  } else {
    habitInput.innerHTML = "";
  }
};

const saveNewHabit = () => {
  // Save the input data to local storage.
  let inputHabitTitle = document.querySelector("#habitTitle").value;
  let inputPriority = document.querySelector("#priority").value;

  // check if user entered a title
  if (inputHabitTitle) {
    // Get users array from local storage
    let users = JSON.parse(localStorage.getItem("users"));
    // Get logged users ID
    let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
    // Find the logged-in user by ID and push habit to their habits array
    let user = users.find((user) => user.id === loggedInUser);

    // generate random id
    let habitId = generateId(user.habits);

    // Create habit object
    let habit = {
      id: habitId,
      title: inputHabitTitle,
      streak: [],
      priority: inputPriority,
    };

    user.habits.push(habit);

    // Save updated users array back to local storage
    localStorage.setItem("users", JSON.stringify(users));
    habitInput.innerHTML = "";

    //Generate a habit card to DOM.
    let habitCard = createHabitCard(habit, habit.id);
    habitList.prepend(habitCard);
  }
};

let habitInput = document.createElement("div");
createHabitBtn.addEventListener("click", () => {
  createNewHabit();
});

// Generate habit-cards based on localStorage
const renderHabitCards = (habitArr = [], onload = false) => {
  // clear previous content
  habitList.innerHTML = "";
  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  // Find the logged-in user by ID and push habit to their habits array
  let user = users.find((user) => user.id === loggedInUser);

  if (habitArr.length === 0 && onload) {
    user.habits.forEach((habit) => {
      habitList.append(createHabitCard(habit, habit.id));
    });
  } else {
    habitArr.forEach((habit) => {
      habitList.append(createHabitCard(habit, habit.id));
    });
  }

  habitContainer.append(habitList);
};

habitsSortSelect.addEventListener("change", () => {
  filterAndSortHabits();
});

habitsPrioSelect.addEventListener("change", () => {
  filterAndSortHabits();
});

const filterAndSortHabits = () => {
  let chosenPriority = document.querySelector("#priorityFilter").value;
  let selectedSortingOption = habitsSortSelect.value;

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

  let priorityValues = [
    { name: "low", value: 1 },
    { name: "medium", value: 2 },
    { name: "high", value: 3 },
  ];

  switch (selectedSortingOption) {
    case "":
      break;
    case "streakDesc":
      chosenHabits.sort((a, b) => {
        let aStreak = a.streak.length;
        let bStreak = b.streak.length;
        return aStreak > bStreak ? 1 : bStreak > aStreak ? -1 : 0;
      });
      break;
    case "streakAsc":
      chosenHabits.sort((a, b) => {
        let aStreak = a.streak.length;
        let bStreak = b.streak.length;
        return aStreak < bStreak ? 1 : bStreak < aStreak ? -1 : 0;
      });
      break;
    case "prioDesc":
      chosenHabits.sort((a, b) => {
        let aPrio = priorityValues.find((prio) => prio.name === a.priority);
        aPrio = aPrio.value;
        let bPrio = priorityValues.find((prio) => prio.name === b.priority);
        bPrio = bPrio.value;

        return aPrio - bPrio;
      });
      break;
    case "prioAsc":
      chosenHabits.sort((a, b) => {
        let aPrio = priorityValues.find((prio) => prio.name === a.priority);
        aPrio = aPrio.value;
        let bPrio = priorityValues.find((prio) => prio.name === b.priority);
        bPrio = bPrio.value;

        return bPrio - aPrio;
      });
      break;
  }

  // clearing the current ul
  habitList.innerHTML = "";
  // generating new list based on new habit list
  renderHabitCards(chosenHabits, false);
};

// filterHabitsBtn.addEventListener("click", () => {
//   filterAndSortHabits();
// });

const editHabit = (i) => {
  // priority options
  let priorityLevels = ["Low", "Medium", "High"];
  // getting current user
  let users = JSON.parse(localStorage.getItem("users"));
  let currentLoggedInId = localStorage.getItem("loggedInUser");
  let user = users.find((user) => +user.id === +currentLoggedInId);

  let habit = user.habits.find((habit) => habit.id === i);

  let modalContent = document.createElement("div");
  modalContent.classList.add("modalContent");
  modal.append(modalContent);

  let editForm = document.createElement("div");
  editForm.classList.add("editForm", "flex", "flex-column");
  editForm.innerHTML = `<div class="flex flex-column"><label for="editHabitTitle">Title</label><input id="editHabitTitle" value="${habit.title}"type="text"/></div>`;

  let prioDiv = document.createElement("div");
  prioDiv.classList.add("flex");
  prioDiv.innerHTML = "<label for='editHabitPrio'>Priority</label>";
  let prioSelect = document.createElement("select");
  prioSelect.id = "editHabitPrio";
  priorityLevels.forEach((level) => {
    if (level.toLowerCase() === habit.priority) {
      prioSelect.innerHTML += `<option value="${habit.priority}" selected="selected">${level}</option>`;
    } else {
      prioSelect.innerHTML += `<option value="${level.toLowerCase()}">${level}</option>`;
    }
  });

  prioDiv.append(prioSelect);

  editForm.append(prioDiv);

  editForm.innerHTML += `<div class="flex><label for="editHabitStreak">Streak</label><input type="number" min="0" id="editHabitStreak"/></div>`;
  // buttons
  let actionButtons = document.createElement("div");
  actionButtons.classList.add("actionButtons", "flex");

  // save edits button
  let saveEditsBtn = document.createElement("button");
  saveEditsBtn.id = "saveHabitEdits";
  saveEditsBtn.classList.add("modalBtn");
  saveEditsBtn.innerText = "Save";
  saveEditsBtn.addEventListener("click", () => {
    // save changes
    saveHabitEdits(habit);
  });

  // delete habit button
  let deleteBtn = document.createElement("button");
  deleteBtn.id = "deleteHabit";
  deleteBtn.classList.add("modalBtn", "danger");
  deleteBtn.innerText = "Delete Habit";
  deleteBtn.addEventListener("click", () => {
    //delete habit
    deleteHabit(habit);
  });

  actionButtons.append(saveEditsBtn, deleteBtn);

  editForm.append(actionButtons);

  modalContent.append(editForm);

  createModal();
};

const saveHabitEdits = (habit) => {
  // 1, Save the input data to local storage.
  let inputHabitTitle = document.querySelector("#editHabitTitle").value;
  let inputPriority = document.querySelector("#editHabitPrio").value;
  let inputStreak = document.querySelector("#editHabitStreak").value;

  // logic for increasing, resetting or increasing streak
  inputStreak === 0
    ? (habit.streak = [])
    : inputStreak > 0
    ? addToStreak(habit)
    : subtractFromStreak(habit);

  // Create habit object
  let editedHabit = {
    id: habit.id,
    title: inputHabitTitle,
    streak: habit.streak,
    priority: inputPriority,
  };

  // Get users array from local storage
  let users = JSON.parse(localStorage.getItem("users"));
  // Get logged users ID
  let loggedInUser = parseInt(localStorage.getItem("loggedInUser"));
  // Find the logged-in user by ID and push habit to their habits array
  let user = users.find((user) => user.id === loggedInUser);
  let activeHabit = user.habits.find((item) => +item.id === +habit.id);
  let index = user.habits.indexOf(activeHabit);
  user.habits[index] = editedHabit;
  // Save updated users array back to local storage
  localStorage.setItem("users", JSON.stringify(users));

  let updatedList = user.habits;

  renderHabitCards(updatedList, false);
  destroyModal();
};

const deleteHabit = (habit) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = localStorage.getItem("loggedInUser");

  let user = users.find((user) => +user.id === +loggedInUser);

  let habitToDelete = user.habits.find((item) => +item.id === +habit.id);

  // finding index of item
  let index = user.habits.indexOf(habitToDelete);

  // removing from array
  user.habits.splice(index, 1);

  localStorage.setItem("users", JSON.stringify(users));

  renderHabitCards(user.habits, false);
  destroyModal();
};

const getToday = () => {
  let today = new Date();
  let year = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  // Add leading zero if the day is less than 10
  if (dd < 10) {
    dd = "0" + dd;
  }

  // Add leading zero if the month is less than 10
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = `${year}-${mm}-${dd}`;

  return today;
};

const streakIncrementer = (habit) => {
  users = JSON.parse(localStorage.getItem("users"));

  let loggedInUser = +localStorage.getItem("loggedInUser");
  let user = users.find((user) => user.id === loggedInUser);
  let currentHabit = user.habits.find((item) => item.id === habit.id);
  let indexOfHabit = user.habits.indexOf(currentHabit);

  let streakArray = currentHabit.streak;

  let today = new Date(getToday());

  let latestDayInStreak = new Date(streakArray[streakArray.length - 1]);

  let previousDay = new Date(today);
  previousDay.setDate(today.getDate() - 1);

  if (
    previousDay.getTime() === latestDayInStreak.getTime() ||
    streakArray.length === 0
  ) {
    today = getToday();
    user.habits[indexOfHabit].streak.push(today);
  }

  // updating local storage
  localStorage.setItem("users", JSON.stringify(users));
  // refreshing the list
  renderHabitCards(user.habits, false);
};

const resetStreak = () => {
  users = JSON.parse(localStorage.getItem("users"));
  let loggedInUSer = +localStorage.getTime("loggedInUser");
  let user = users.find((user) => user.id === loggedInUSer);

  let today = new Date(getToday());
  let previousDay = new Date(today);
  previousDay.setDate(today.getDate() - 1);

  user.habits.forEach((habit) => {
    let latestDayInStreak = new Date(habit.streak[streakArray.length - 1]);

    // setting streak to zero if one day missed
    if (previousDay.getTime() !== latestDayInStreak.getTime()) {
      habit.streak = [];
    }
  });

  // updating local storage
  localStorage.setItem("users", JSON.stringify(users));
};

renderHabitCards(emptyArr, true);
