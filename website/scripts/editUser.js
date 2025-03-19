<<<<<<< HEAD
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
                img.className = "icon";
                img.id = data[i].iconID;
                img.onclick = function(){   

                    //resets icon that has been selected 
                    allIcons = document.querySelectorAll(".iconChecked")
                    if(allIcons.length>0){
                        allIcons[0].className="icon";
                    }

                    //selects new icon
                    id = data[i].iconID;
                    icon = document.getElementById(id);
                    if(icon.className === "icon"){
                        icon.className="iconChecked";
                    }else{
                        icon.className="icon";
                    }
                }
                
                div = document.getElementById("otherIcon");
                div.appendChild(img);
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
    allIcons = document.querySelectorAll(".iconChecked")
    if(allIcons[0]){
        iconID = allIcons[0].id;
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
=======
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
                img.className = "icon";
                img.id = data[i].iconID;
                img.onclick = function(){   

                    //resets icon that has been selected 
                    allIcons = document.querySelectorAll(".iconChecked")
                    if(allIcons.length>0){
                        allIcons[0].className="icon";
                    }

                    //selects new icon
                    id = data[i].iconID;
                    icon = document.getElementById(id);
                    if(icon.className === "icon"){
                        icon.className="iconChecked";
                    }else{
                        icon.className="icon";
                    }
                }
                
                div = document.getElementById("otherIcon");
                div.appendChild(img);
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
    allIcons = document.querySelectorAll(".iconChecked")
    if(allIcons[0]){
        iconID = allIcons[0].id;
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
>>>>>>> 5f108183f1a777aeb5d002bc2a116c1972b6971e
