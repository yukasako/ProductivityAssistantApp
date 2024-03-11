//CALENDAR
//If Arr don exist
//Make an array to store happening
if(!localStorage.getItem('happeningsArr')){
    const happeningsArr = [];
    const happeningsArrString = JSON.stringify(happeningsArr);
    localStorage.setItem('happeningsArr', happeningsArrString);
  }
  
let createHappeningArticles = () =>{
      //Create Happening Article
  const article = document.createElement('article');
  article.id = 'happeningsContent';
  
  const heading = document.createElement('h2');
  heading.textContent = 'Events';
  
  const container = document.createElement('div');
  container.id = 'happeningsContainer';
  
  const showOld = document.createElement("i");
  showOld.classList.add("fa-solid", "fa-angle-down");
  container.appendChild(showOld);
  
  showOld.addEventListener("click", ()=>{
    passedDiv.classList.toggle("displayNone");
    showOld.classList.toggle("fa-angle-up");
  })
  
  const passedDiv = document.createElement('ul');
  passedDiv.id = 'happeningsPassed';
  passedDiv.classList.add("displayNone");
  
  
  const upcomingDiv = document.createElement('ul');
  upcomingDiv.id = 'happeningsUpcoming';
  
  const addHappeningBtn = document.createElement('button');
  addHappeningBtn.type = 'button';
  addHappeningBtn.id = 'addHappening';
  
  
  const addHappeningSpan = document.createElement('span');
  addHappeningSpan.innerText = "New Event";
  addHappeningBtn.appendChild(addHappeningSpan);
  
  
  const addHappeningIcon = document.createElement("i");
  addHappeningIcon.classList.add("fa-solid", "fa-plus");
  addHappeningIcon.setAttribute("aria-hidden", "true");
  addHappeningBtn.appendChild(addHappeningIcon);
  
  
  container.appendChild(passedDiv);
  container.appendChild(upcomingDiv);
  container.appendChild(addHappeningBtn);
  
  article.appendChild(heading);
  article.appendChild(container);
  
  appScreen.appendChild(article);
}

createHappeningArticles();
  
  //Append Happenings (also sorts them first)
  
  //Happening template
  const happening = {
    text: null,
    date: null,
    time: null,
    end: null,
  };
  
    //Delete Happening
    let deleteHappening = ()=>{
      const happeningLis = document.getElementById("happeningsContainer").querySelectorAll("li");
      happeningLis.forEach((e)=>{
        e.addEventListener("click", ()=>{
          createModal();
          //Add Delete Button & h2
          const deleteHappeningH2 = document.createElement("h2");
          deleteHappeningH2.innerText = "Delete Event";
          document.getElementById("modal").appendChild(deleteHappeningH2);
  
          const deleteBtn = document.createElement("button");
          deleteBtn.innerText = "Delete";
          deleteBtn.setAttribute("type", "button");
          deleteBtn.setAttribute("id", "happeningDeleteBtn");
          document.getElementById("modal").appendChild(deleteBtn);
  
            let happeningsArr = JSON.parse(localStorage.getItem("happeningsArr"));
            document.getElementById("happeningDeleteBtn").addEventListener("click", ()=>{
              e.parentNode.removeChild(e);
              
              const searchDate = e.children[0].innerText;
              const searchTime = e.children[1].innerText;
  
              happeningsArr = happeningsArr.filter(item => !(item.date === searchDate && item.time === searchTime));
  
              localStorage.setItem('happeningsArr', JSON.stringify(happeningsArr));
  
              appendHappenings();
              destroyModal();
            })
        })
      })
    }
  
  let appendHappenings = () => {
    document.getElementById("happeningsPassed").innerHTML = "";
    document.getElementById("happeningsUpcoming").innerHTML = "";
  
    const happenings = JSON.parse(localStorage.getItem('happeningsArr'));
    const passedHappenings = [];
    const upcomingHappenings = [];
  
    // Sort the array based on time and date
    happenings.sort((a, b) => {
      // Compare dates
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) {
          return dateComparison;
      }
  
      // If dates are equal, compare times
      const timeA = a.time.split(':');
      const timeB = b.time.split(':');
      const timeComparison = new Date(0, 0, 0, timeA[0], timeA[1]) - new Date(0, 0, 0, timeB[0], timeB[1]);
      return timeComparison;
    });
  
    //Separate old and new
    //Get today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    //Split passed and upcoming
    happenings.forEach(function(obj) {
      var dateParts = obj.date.split('-');
      var year = parseInt(dateParts[0], 10);
      var month = parseInt(dateParts[1], 10) - 1;
      var day = parseInt(dateParts[2], 10);
      
      var objDate = new Date(year, month, day);
      
      if (objDate < today) {
          passedHappenings.push(obj);
      } else {
          upcomingHappenings.push(obj);
      }
    });
  
    //Append Happenings 
    passedHappenings.forEach((e)=>{
      const happening = document.createElement("li");
      const time = document.createElement("span");
      const date = document.createElement("span");
      const text = document.createElement("p");
    
  
      date.innerText = e.date +",";
      time.innerText = e.time + " - " + e.end;
      text.innerText = e.text;
  
      happening.appendChild(date);
      happening.appendChild(time);
      happening.appendChild(text);
      
      document.getElementById("happeningsPassed").appendChild(happening);
    })
  
    upcomingHappenings.forEach((e)=>{
      const happening = document.createElement("li");
      const time = document.createElement("span");
      const date = document.createElement("span");
      const text = document.createElement("p");
  
      date.innerText = e.date;
      time.innerText = e.time;
      text.innerText = e.text;
  
      happening.appendChild(date);
      happening.appendChild(time);
      happening.appendChild(text);
  
      document.getElementById("happeningsUpcoming").appendChild(happening);
    })
    
    deleteHappening();
  };
  appendHappenings();
  
  //Create Happening Modal
  const addHappeningModal = ()=> {
    const form = document.createElement('form');
    form.id = 'createHappeningForm';
  
    const happeningH2 = document.createElement("h2");
    happeningH2.innerText = "New Event";
    form.appendChild(happeningH2);
  
    const happeningWarning = document.createElement("span");
    form.appendChild(happeningWarning);
  
    const dateWrapper = document.createElement("div");
    dateWrapper.setAttribute("id", "dateWrapper");
    form.appendChild(dateWrapper);
  
    const timeWrapper = document.createElement("div");
    timeWrapper.setAttribute("id", "timeWrapper");
    form.appendChild(timeWrapper);
  
    const descriptionWrapper = document.createElement("div");
    descriptionWrapper.setAttribute("id", "descriptionWrapper");
    form.appendChild(descriptionWrapper);
  
  
    const dateLabel = document.createElement('label');
    dateLabel.setAttribute('for', 'happeningDate');
    dateLabel.textContent = 'Date';
    dateWrapper.appendChild(dateLabel);
    const dateInput = document.createElement('input');
    dateInput.setAttribute('type', 'date');
    dateInput.id = 'happeningDate';
    dateInput.name = 'date';
    dateWrapper.appendChild(dateInput);
  
    const timeLabel = document.createElement('label');
    timeLabel.setAttribute('for', 'happeningTime');
    timeLabel.textContent = 'Start';
    timeWrapper.appendChild(timeLabel);
    const timeInput = document.createElement('input');
    timeInput.setAttribute('type', 'time');
    timeInput.id = 'happeningTime';
    timeInput.name = 'time';
    timeWrapper.appendChild(timeInput);

    const timeEndLabel = document.createElement('label');
    timeEndLabel.setAttribute('for', 'happeningEnd');
    timeEndLabel.textContent = 'End';
    timeWrapper.appendChild(timeEndLabel);
    const timeEndInput = document.createElement('input');
    timeEndInput.setAttribute('type', 'time');
    timeEndInput.id = 'happeningEnd';
    timeEndInput.name = 'end';
    timeWrapper.appendChild(timeEndInput);

    const descriptionLabel = document.createElement('label');
    descriptionLabel.setAttribute('for', 'happeningText');
    descriptionLabel.textContent = 'Event';
    descriptionWrapper.appendChild(descriptionLabel);
    const descriptionInput = document.createElement('textarea');
    descriptionInput.id = 'happeningText';
    descriptionInput.name = 'description';
    descriptionInput.maxLength = '250'; 
    descriptionWrapper.appendChild(descriptionInput);
  
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'button');
    submitButton.id = 'happeningAddBtn';
    submitButton.textContent = 'Save';
    form.appendChild(submitButton);
  
    modal.appendChild(form);
  }
  
  //Open Modal and submit happening
  const happeningAddBtn = document.getElementById("addHappening");
  happeningAddBtn.addEventListener("click", ()=>{
    createModal();
    addHappeningModal();
    const submitHappeningBtn = document.querySelector("#happeningAddBtn");
    let happeningsArr = JSON.parse(localStorage.getItem('happeningsArr')) || [];
  
    //Submit click event
    submitHappeningBtn.addEventListener("click", ()=>{
      const searchDate = document.getElementById("happeningDate").value;
      const searchTime = document.getElementById("happeningTime").value;
      const searchEnd = document.getElementById("happeningEnd").value
      const searchText = document.getElementById("happeningText").value;
  
      const duplicateExists = happeningsArr.some(e => 
        e.date === searchDate && 
        e.time >= searchTime && 
        e.time <= searchEnd
    );
  
    const warningSpan = document.getElementById("createHappeningForm").children[1];
  
      if (duplicateExists) {
        warningSpan.innerText = "Event already exist on select date and time";
      } 
  
      else if(searchDate === "" || searchTime === "" || searchText === ""){
        warningSpan.innerText = "All fields are requried";
      }
        
      else {
          happening.date = document.getElementById("happeningDate").value;
          happening.time = document.getElementById("happeningTime").value;
          happening.end = document.getElementById("happeningTime").value;
          happening.text = document.getElementById("happeningText").value;
          //Push to local storage
          
          happeningsArr.push(happening);
          localStorage.setItem('happeningsArr', JSON.stringify(happeningsArr));
      
          appendHappenings();
          destroyModal();
        } 
    })
  })