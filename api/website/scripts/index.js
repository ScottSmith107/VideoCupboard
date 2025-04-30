let url = "https://"+IP+":3000/";
// let url = "http://"+IP+":3000/";
let users = [];
let icons = [];
//get all videos from the server
let getUsers = () => {
    fetch(url+"allUsers")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const users = data;
            for (let index = 0; index < users.length; index++) {
                makeWidget(users[index].name, users[index].userID,users[index].icon);
            }
        })
        .catch(error => {
            console.error("couldnt get all users", error);
        });
}

//makes video widget //I didnt feel like using react so here it is done
function makeWidget(name,id,icon){
    const main = document.getElementById("userDiv");
    const div = document.createElement("div");
    div.id = "user";
    div.className = "user";

    //user link
    const content = document.createElement("p");
    content.href = "home.html?userID="+id;   
    content.innerText = name;
    content.className = "userContent";

    //edit user link
    const edit = document.createElement("Button");
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

//creates form to add user
function makeForm(){
    //so it doesnt double up forms
    const tmp = document.getElementById("addUserDiv");
    if(tmp){
        document.getElementById("body").removeChild(tmp);
    }

    const body = document.getElementById("body");

    const div = document.createElement("div");
    div.id = "addUserDiv";
    div.className = "addUserDiv";

    const controlesDiv = document.createElement("div");
    controlesDiv.className = "controlesDiv";

    const username = document.createElement("input");
    username.id = "username";
    username.className = "addFormUsername";

    const label = document.createElement("label");
    label.className = "label";
    label.setAttribute('for', 'username');
    label.innerText = "Username:";
    label.style.color = "black";

    const button = document.createElement("button");
    button.innerText = "add user";
    button.id = "addButton";
    button.onclick = addUser;

    const addImage = document.createElement("button");
    addImage.innerText = "Add new Icon";
    addImage.id = "addImage";
    addImage.addEventListener("click", function() {
        document.getElementById("fileInput").addEventListener("change", addIcon);
        document.getElementById("fileInput").click();
    });

    const iconDiv = getIcons();

    controlesDiv.appendChild(label);
    controlesDiv.appendChild(username);
    controlesDiv.appendChild(button);
    controlesDiv.appendChild(addImage);
    div.appendChild(controlesDiv);

    div.appendChild(iconDiv);
    body.appendChild(div);
}

//adds made user to the db
function addUser(){

    const username = document.getElementById("username").value;
    const selected = allIcons = document.querySelectorAll(".iconChecked")[0];
    
    if(selected && username){
        const iconID = selected.id;
        const formData = new FormData();
        formData.append("username",username);
        formData.append("iconID",iconID);
        
        fetch(url+"addUser", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error("couldnt add new user", error);
        });

        location.replace("index.html");
    }else{
        alert("Please select an icon and username");
    }
    
}

//gets icon from id
function setIcon(iconID,div,name){

    const formData = new FormData();
    formData.append("iconID",iconID);
    
    fetch(url+"getIcon", {
        method: "PUT",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        const path = data[0].fullPath;

        const img = document.createElement("img");
        img.id = "userIcon";
        img.className = "userIcon";
        img.src = url + path;
        img.onclick = function(){
            location.replace("home.html?userID="+iconID);
        }

        div.appendChild(img);
    })
    .catch(error => {
        console.error("couldnt set new icon", error);
    });

}

//gets all the icons from the db and places them all in a div
//returns the div
function getIcons(){
    const  div = document.createElement("div");
    div.className = "iconsDiv";

    fetch(url+"allIcons")
    .then(response => response.json())
    .then(data => {
        const icons = data;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            const img = document.createElement("img");
            img.src = url + data[i].fullPath;
            img.id = data[i].iconID;
            img.className = "iconNew";
            img.onclick = function(){   
                
                //resets icon that has been selected 
                const allIcons = document.querySelectorAll(".iconChecked")
                if(allIcons.length>0){
                    allIcons[0].className="iconNew";
                }

                //selects new icon
                const id = data[i].iconID;
                const icon = document.getElementById(id);
                if(icon.className = "iconNew"){
                    icon.className="iconChecked";
                }
            }
            div.appendChild(img);
        }
    })
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
    console.log(icons);
    return div;
}


//change event for new file input
//adds new iamge to the icon list
function addIcon(event){
    console.log(event.target.files);
    const files = event.target.files;

    const formData = new FormData();
    formData.append('icon', "icon");
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    fetch(url+"upload-icon", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(makeForm)
    .catch(error => {
        console.error("couldnt upload new video to folder", error);
    });

}