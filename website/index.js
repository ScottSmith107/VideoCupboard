let url = "http://192.168.1.124:3000/";
let users = [];
let icons = [];
//get all videos from the server
let getUsers = () => {
    fetch(url+"allUsers")
        .then(response => response.json())
        .then(display)
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//places all the users into the div
function display(response){
    console.log(response);
    users = response;
    for (let index = 0; index < users.length; index++) {
        makeWidget(users[index].name, users[index].userID,users[index].icon);
    }
}

//makes widget the silly way because i dont like react
function makeWidget(name,id,icon){
    main = document.getElementById("userDiv");
    div = document.createElement("div");
    div.id = "user";
    div.className = "user";

    //user link
    content = document.createElement("a");
    content.href = "home.html?userID="+id;   
    content.innerText = name;
    content.className = "userContent";

    //edit user link
    edit = document.createElement("Button");
    edit.onclick = function(){
        location.replace("editUser.html?userID="+id);
    }    
    edit.innerText = "Edit User";
    edit.className = "userEdit";
    
    setIcon(icon,div,name);
    div.appendChild(content)
    div.appendChild(edit)
    main.appendChild(div);

}

//creates add user form 
function makeForm(){
    body = document.getElementById("body");

    div = document.createElement("div");
    div.className = "addUserDiv";

    controlesDiv = document.createElement("div");
    controlesDiv.className = "controlesDiv";

    username = document.createElement("input");
    username.id = "username";
    username.className = "addFormUsername";

    label = document.createElement("label");
    label.className = "label";
    label.setAttribute('for', 'username');
    label.innerText = "Username:";
    label.style.color = "white";

    button = document.createElement("button");
    button.innerText = "add user";
    button.id = "addButton";
    button.onclick = addUser;

    iconDiv = getIcons();

    controlesDiv.appendChild(label);
    controlesDiv.appendChild(username);
    controlesDiv.appendChild(button);
    div.appendChild(controlesDiv);

    div.appendChild(iconDiv);
    body.appendChild(div);
}

//adds made user to the db
function addUser(){

    username = document.getElementById("username").value;
    selectedRadio = document.querySelector('input[name="icons"]:checked');
    
    if(selectedRadio && username){
        iconID = selectedRadio.id;
        formData = new FormData();
        formData.append("username",username);
        formData.append("iconID",iconID);
        
        fetch(url+"addUser", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });

        location.replace("index.html");
    }else{
        alert("Please select an icon and username");
    }
    
}

//gets icon form id
function setIcon(iconID,div,name){

    formData = new FormData();
    formData.append("iconID",iconID);
    
    fetch(url+"getIcon", {
        method: "PUT",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        path = data[0].fullPath;

        img = document.createElement("img");
        img.id = "userIcon";
        img.className = "userIcon";
        img.src = url + path;
        img.onclick = function(){
            location.replace("home.html?userID="+iconID);
        }

        div.appendChild(img);
    })
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });

}

//adds made user to the db
function removeUser(){

    //get user id some way
    id = 0;

    formData = new FormData();
    formData.append("id",id);
    
    fetch(url+"removeUser", {
        method: "DELETE",
        body: formData,
    })
    .then(response => response.json())
    .then()
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
}

//goes to edit screen because i refuse to use react
function editUsers(){
    location.replace("editUser.html");
}

//gets all the icons from the db and places them all in a div
//returns the div
function getIcons(){
    let div = document.createElement("div");
    div.className = "iconsDiv";

    fetch(url+"allIcons")
    .then(response => response.json())
    .then(data => {
        icons = data;
        console.log(data);
        console.log(data[0]);
        for (let i = 0; i < data.length; i++) {
            img = document.createElement("img");
            img.src = url + data[i].fullPath;
            img.id = "icon" + data[i].iconID;
            img.className = "icon";
            img.onclick = function(){   
                radioButton = document.getElementById(data[i].iconID);
                radioButton.checked = true;
            }
            div.appendChild(img);
            //create radio button to select icon
            radioButton = document.createElement("input");
            radioButton.type = "radio";
            radioButton.name = "icons";
            radioButton.id = data[i].iconID;
            div.appendChild(radioButton);
        }
    })
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
    console.log(icons);
    return div;
}