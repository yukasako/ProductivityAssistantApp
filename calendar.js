






  

  
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
