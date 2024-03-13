





//Delete Happening Function
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
  
  
  
            document.getElementById("happeningDeleteBtn").addEventListener("click", ()=>{
              let userNoC = JSON.parse(localStorage.getItem("loggedInUser"));
              let userListC = JSON.parse(localStorage.getItem("users"));
              let userObjIndexC = userListC.findIndex(obj => obj.id === userNoC);
              let userObjC = userListC[userObjIndexC];
              let userHappeningsC = userObjC.happenings;
  
              const searchDate = e.children[0].innerText;
              const searchTime = e.children[1].innerText;
              
              userHappeningsC = userHappeningsC.filter(item => !(item.date === searchDate && item.time === searchTime));
  
              userObjC.happenings = userHappeningsC;
              userListC[userObjIndexC] = userObjC;
    
              localStorage.setItem("users", JSON.stringify(userListC));
              destroyModal();
            })
        })
      })
}
  
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
  let happeningsArr = userHappenings || [];

  //Submit click event
  submitHappeningBtn.addEventListener("click", ()=>{
    const searchDate = document.getElementById("happeningDate").value;
    const searchTime = parseInt(document.getElementById("happeningTime").value.replace(":", ""));
    const searchEnd = parseInt(document.getElementById("happeningEnd").value.replace(":", ""));
    const searchText = document.getElementById("happeningText").value;
    
    const duplicateExists = happeningsArr.some((e) => {
      const time = parseInt(e.time.replace(":", ""));
      const end = parseInt(e.end.replace(":", ""));
    
      if (e.date === searchDate) {
        if (time <= searchTime && end >= searchEnd) {
          return true;
        }
      }
      return false;
    });

    console.log(duplicateExists);
    
    const warningSpan = document.getElementById("createHappeningForm").children[1];
    
    if (duplicateExists) {
      warningSpan.innerText = "Event already exists on selected date and time";
    }

    if (duplicateExists) {
      warningSpan.innerText = "Event already exist on select date and time";
    } 

    else if(searchDate === "" || searchTime === "" || searchEnd === "" || searchText === ""){
      warningSpan.innerText = "All fields are requried";
    }
      
    else {
        happening.date = document.getElementById("happeningDate").value;
        happening.time = document.getElementById("happeningTime").value;
        happening.end = document.getElementById("happeningEnd").value;
        happening.text = document.getElementById("happeningText").value;
        //Push to local storage
        let userNoC = JSON.parse(localStorage.getItem("loggedInUser"));
        let userListC = JSON.parse(localStorage.getItem("users"));
        let userObjC = userListC.find(obj => obj.id === userNoC);
        let userHappeningsC = userObjC.happenings;

        userHappeningsC.push(happening);

        localStorage.setItem("users", JSON.stringify(userListC));

        
        destroyModal();
        appendHappenings();
      } 
  })
})
