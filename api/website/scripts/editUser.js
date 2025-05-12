let url = IP;
let user;
const urlParams = new URLSearchParams(window.location.search);
// Function to get URL parameters
async function getQueryParam() {
    const userID = urlParams.get("userID");
    user = await getUser(userID);
}

//gets the user from the db
function getUser(userID){

    var formData = new FormData();
    formData.append("userID",userID);
    
    fetch(url+"getUser", {
        method: "PUT",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        user = data[0];
        displayUser(user);
        getIcons();
    })
    .catch(error => {
        console.error("couldnt get the user", error);
    });

}

//displays the user
function displayUser(user){
    let input = document.getElementById("username");
    input.value = user.name;
    input.innerText = user.name;
}

//gets all the icons from the db and displays them
function getIcons(){
    fetch(url+"allIcons")
    .then(response => response.json())
    .then(data => {
        console.log("icons");
        console.log(data);
        console.log(user);
        for (let i = 0; i < data.length; i++) {

            //checks weather this is the user or not
            if(data[i].iconID == user.icon){
                const mainDiv = document.getElementById("mainIcon");
                
                //setting up image
                const img = document.createElement("img");
                img.src = url + data[i].fullPath;
                img.className = "userIcon";
                
                mainDiv.appendChild(img);
            }else{
                //setting up image
                const img = document.createElement("img");
                img.src = url + data[i].fullPath;
                img.className = "icon";
                img.id = data[i].iconID;
                img.onclick = function(){   

                    //resets icon that has been selected 
                    const allIcons = document.querySelectorAll(".iconChecked")
                    if(allIcons.length>0){
                        allIcons[0].className="icon";
                    }

                    //selects new icon
                    const id = data[i].iconID;
                    const icon = document.getElementById(id);
                    if(icon.className === "icon"){
                        icon.className="iconChecked";
                    }else{
                        icon.className="icon";
                    }
                }
                
                const div = document.getElementById("otherIcon");
                div.appendChild(img);
            }
        }
    })
    .catch(error => {
        console.error("couldnt get icons", error);
    });
}
 
//updates user
function updateUser(){
    let formData = new FormData();
    const username = document.getElementById("username").value;

    //check if user has opted to change the icon
    const allIcons = document.querySelectorAll(".iconChecked")
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

//deletes user
function deleteUser(){
    let formData = new FormData();
    formData.append("userID",user.userID);
    
    if(confirm("are you sure")){

        fetch(url+"deleteUser", {
            method: "DELETE",
            body: formData,
        })
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error("couldnt delete user", error);
        });
    
        location.replace("index.html");
    }

}
