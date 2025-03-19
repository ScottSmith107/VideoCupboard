let url = "http://192.168.1.124:3000/";
let video;
let userID;
const urlParams = new URLSearchParams(window.location.search);
// Function to get URL parameters
function onload() {
    videoID = urlParams.get("videoID");
    userID = urlParams.get("userID");
    console.log("videoID: ",videoID);
    console.log("userID: ",userID);

    //sets the params of the home button
    document.getElementById("home").href = "home.html?userID="+userID;
    video = getVideo(videoID);
}

//gets the user from the db
function getVideo(videoID){

    searchUrl = new URL(url+"path");
    searchUrl.searchParams.append("videoIndex",videoID);

    fetch(searchUrl)
    .then(response => response.json())
    .then(displayVideo)
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });

}

//displays the user
function displayVideo(video){
    video = video[0];
    console.log(video);

    let name = document.getElementById("videoName");
    name.value  = video.Name;
    name.innerText  = video.Name;

    desc = document.getElementById("videoDesc");
    desc.value  = video.Description;
    desc.innerText  = video.Description;

    //addign icon
    icon = document.getElementById("icon")
    icon.src = url + video.icon;
}

// updates user //fix\\
function update(){
    formData = new FormData();
    videoName = document.getElementById("videoName").value;
    desc = document.getElementById("videoDesc").value;

    //check if user has opted to change the icon
    newIcon = document.getElementById("fileInput")
    if(newIcon.files.length > 0){
        formData.append("files",newIcon.files[0]);
    }

    formData.append("videoName",videoName);
    formData.append("desc",desc);
    formData.append("videoID",videoID);
    
    fetch(url+"updateVideo", {
        method: "PUT",
        body: formData,
    })
    .then(response => response.json())
    .then()
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });

    location.replace("home.html?userID="+userID);

}

function remove(){
    if(confirm("Are you sure you want to delete this video?")){
        id = urlParams.get("videoID");

        deletUrl = new URL(url+"remove");
        deletUrl.searchParams.append("id", id);
        fetch(deletUrl, {method: "DELETE"})
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });

        //go to home screen
        location.replace("home.html?userID="+userID);
    }

}
