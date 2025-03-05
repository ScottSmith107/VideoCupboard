let url = "http://192.168.1.124:3000/";
let arrayOfContents = [];
let folderID;
let videoID;
let userID;
let video;
// Function to get URL parameters
function getQueryParam() {

    title = document.getElementById("title");
    const urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get("data");
    index = urlParams.get("index");
    userID = urlParams.get("userID");
    folder = urlParams.get("folder");
    dir = urlParams.get("dir");

    console.log("name: ",name);
    console.log("index: ",index);
    console.log("dir: ",dir);
    console.log("folder: ",folder);
    title.innerText = name;

    //check if the passed name is a folder
    if(folder == 1){
        addRmoveFolderButton(index);
        findFolder(index)
    }
    else{//if not a folder then play the video
        play(index)
        findFolder(dir)
    }
}

//adds "removeFolder" button under the folder title
function addRmoveFolderButton(index){
    folderID = index;

    button = document.createElement("button");
    button.id = "removeFolder";
    button.innerText = "Remove Folder";
    button.onclick = removeFolder;

    div = document.getElementById("titleDiv");
    div.appendChild(button);
}

// play passed video
function play(index) {
    videoID = index;
    // console.log(index);
    div = document.getElementById("playerDiv");
    //setting up video tag
    videoPlayer = document.createElement("video");
    videoPlayer.autoplay = false;
    videoPlayer.controls = true;
    videoPlayer.className  = "videoPlayer";
    video = videoPlayer
    setUrl(index,videoPlayer)
    video.addEventListener("progress", updateTimestamp);
    video.addEventListener("ended", videoEnded);
    checkPlayTime(video);
    div.appendChild(videoPlayer);

    //add buttons
    buttonDiv = document.createElement("div");
    buttonDiv.className = "playerButtons";
    next = document.createElement("button");
    prev = document.createElement("button");
    removeButton = document.createElement("button");
    next.onclick = nextPressed;
    prev.onclick = prevPressed;
    removeButton.onclick = remove;
    next.innerText = "Next";
    prev.innerText = "Prev";
    removeButton.innerText = "Remove";
    next.id = "nextButton";
    prev.id = "prevButton";
    removeButton.id = "removeButton";
    buttonDiv.appendChild(prev);
    buttonDiv.appendChild(next);
    buttonDiv.appendChild(removeButton);
    div.appendChild(buttonDiv);
}
//gets the full path for the video request from the index
function setUrl(index,videoPlayer) {
    searchUrl = new URL(url+"path");
    searchUrl.searchParams.append("videoIndex",index);

    fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
        source = document.createElement("source");
        source.src = url + data[0].full_path;
        source.type = "video/mp4";
        videoPlayer.appendChild(source);
    })
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
}

//checks if the user has watched this video before \\ todo //
function checkPlayTime(videoPlayer) {
    formData = new FormData();
    formData.append("userID",userID);
    formData.append("videoID",videoID);
    
    fetch(url+"getTimestamp", {
        method: "PUT",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        videoPlayer.currentTime = (data[0].time);
    })
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });

}

//makes request for all items within a folder from the passed in index
function findFolder(index){
    folderUrl = new URL(url+"folder");
    folderUrl.searchParams.append("folderIndex",index);
    // console.log(index);
    fetch(folderUrl)
    .then(response => response.json())
    .then(display)
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
}

//displays
function display(response){
    console.log(response);
    arrayOfContents = response;

    arr = response;
    for (let index = 0; index < arr.length; index++) {
        makeWidget(arr[index].name, arr[index].id, arr[index].dir, arr[index].folder);
    }
}

//makes widget the silly way because i dont like react
function makeWidget(name,id,dir,folder){
    main = document.getElementById("videosDiv");

    content = document.createElement("a");
    
    content.href = "video.html?data="+name + 
               "&index=" + id +
               "&dir=" + dir +
               "&folder=" + folder;   
    content.innerText = name;
    content.className = "nextup";

    main.appendChild(content);
}

//buttons
function prevPressed(){
    curr = document.getElementById("title").innerText;
    index = findIndex(arrayOfContents, curr);

    if(index != 0){
        location.replace(document.querySelectorAll("a")[index].href);
    }
}
function nextPressed(){
    curr = document.getElementById("title").innerText;
    index = findIndex(arrayOfContents, curr);

    if(index < arrayOfContents.length-1){
        location.replace(document.querySelectorAll("a")[index+2].href);
    }
}
function remove(){
    curr = document.getElementById("title").innerText;
    index = findIndex(arrayOfContents, curr);

    console.log(curr , " " , index);

    deletUrl = new URL(url+"remove");
    deletUrl.searchParams.append("id", arrayOfContents[index].id);
    fetch(deletUrl, {method: "DELETE"})
    .then(response => response.json())
    .then(display)
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });

    //go to home screen
    location.replace("home.html");
}

//onclick for removeFolder button
function removeFolder(){

    deletUrl = new URL(url+"removeDir");
    deletUrl.searchParams.append("id", folderID);
    fetch(deletUrl, {method: "DELETE"})
    .then(response => response.json())
    .then(display)
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });

    //go to home screen
    location.replace("index.html");
}

//finds the index of the currently playing video
function findIndex(arr, curr){
    for (let i = 0; i < arr.length; i++) {
        video = arr[i].name;
        if(curr == video){
            return i;
        }
    }
    return undefined;
} 

//send new timestamp to the db
function updateTimestamp(event){
    time = video.currentTime;
    time = Math.round(time);
    console.log(time);

    //dont bother saving if its less then 1 time
    if(time > 180 && time != 0){
        formData = new FormData();
        formData.append("userID",userID);
        formData.append("videoID",videoID);
        formData.append("timestamp",video.currentTime);
        
        fetch(url+"updateTimestamp", {
            method: "PUT",
            body: formData,
        })
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
    }
}

//when the video is ended set timstamp to 0
function videoEnded(event){
    formData = new FormData();
    formData.append("userID",userID);
    formData.append("videoID",videoID);
    formData.append("timestamp",0);
    
    fetch(url+"updateTimestamp", {
        method: "PUT",
        body: formData,
    })
    .then(response => response.json())
    .then()
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
}