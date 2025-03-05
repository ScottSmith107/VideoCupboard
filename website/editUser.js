let url = "http://192.168.1.124:3000/";
let user;
// Function to get URL parameters
function getQueryParam() {

    title = document.getElementById("title");
    const urlParams = new URLSearchParams(window.location.search);
    userID = urlParams.get("userID");
    console.log("userID: ",userID);

    user = getUser(userID);
}

//gets the user from the db
function getUser(userID){

    formData = new FormData();
    formData.append("userID",userID);
    
    fetch(url+"getUser", {
        method: "PUT",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        user = data[0];
        displayUser(user);
        getIcons();
    })
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });

}

//displays the user
function displayUser(user){
    input = document.getElementById("username");
    input.value  = user.name;
    input.innerText  = user.name;
}

//gets all the icons from the db and displays them
function getIcons(){
    fetch(url+"allIcons")
    .then(response => response.json())
    .then(data => {
        icons = data;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            console.log(user);
            if(data[i].iconID == user.icon){
                mainDiv = document.getElementById("mainIcon");
                
                //setting up image
                img = document.createElement("img");
                img.src = url + data[i].fullPath;
                img.className = "userIcon";

                mainDiv.appendChild(img);
            }else{
                img = document.createElement("img");
                img.src = url + data[i].fullPath;
                img.className = "otherIcon";
                img.onclick = function(){   
                    radioButton = document.getElementById(data[i].iconID);
                    radioButton.checked = true;
                }
                
                div = document.getElementById("otherIcon");
                div.appendChild(img);
                //create radio button to select icon
                radioButton = document.createElement("input");
                radioButton.type = "radio";
                radioButton.name = "icons";
                radioButton.id = data[i].iconID;
                div.appendChild(radioButton);
            }
        }
    })
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
}
 
// updates user //fix\\
function updateUser(){
    formData = new FormData();
    username = document.getElementById("username").value;

    //check if user has opted to change the icon
    if(document.querySelector('input[name="icons"]:checked')){
        selectedRadio = document.querySelector('input[name="icons"]:checked');
        iconID = selectedRadio.id;
        formData.append("iconID",iconID);

    }

    formData.append("userID",user.userID);
    formData.append("username",username);
    
    fetch(url+"updateUser", {
        method: "PUT",
        body: formData,
    })
    .then(response => response.json())
    .then()
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });

    location.replace("index.html");

}

// updates user //fix\\
function deleteUser(){
    formData = new FormData();
    formData.append("userID",user.userID);
    
    if(confirm("are you sure")){

        fetch(url+"deleteUser", {
            method: "DELETE",
            body: formData,
        })
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
    
        location.replace("index.html");
    }

}