let url = "http://"+IP+":3000/";
let urlParams = new URLSearchParams(window.location.search);
let arrayOfContents = [];
let folderID;
let videoID;
let userID;
let video;
let _video;
let name;
let recents = new Map();
// Function to get URL parameters
//serves as onload function
async function getQueryParam() {
    title = document.getElementById("title");
    name = urlParams.get("data");
    videoID = urlParams.get("index");
    userID = urlParams.get("userID");
    folder = urlParams.get("folder");
    dir = urlParams.get("dir");

    configEdit(videoID);

    title.innerText = name.split(".mp4")[0];
    
    fav = await getFavs(userID,videoID);

    //check if the passed name is a folder
    if(folder == 1){
        addFolderButtons(videoID);
        recent(userID,videoID)
    }
    else{//if not a folder then play the video
        play(videoID)
        findFolder(dir)
    }

    //sets the params of the home button
    document.getElementById("home").href = "home.html?userID="+userID;
}

//gets the recent videos and save to map
function recent(userID,videoID){        
    formData = new FormData();
    formData.append("userID",userID);

    fetch(url+"getRecent", {
            method: "PUT",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {

            //save all recents to data
            if(data.length > 0){
                for (let i = 0; i < data.length; i++) {
                    video = data[i];
                    recents.set(video.videoID,true)
                }
            }
            findFolder(videoID)
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//adds "removeFolder" button under the folder title
function addFolderButtons(index){
    folderID = index;

    //remove folder button
    removeButton = document.createElement("button");
    removeButton.id = "removeFolder";
    removeButton.innerText = "Remove Folder";
    removeButton.onclick = removeFolder;

    //add to folder button
    addVideo = document.createElement("button");
    addVideo.id = "addVideo";
    addVideo.innerText = "Add Video";
    addVideo.addEventListener("click", function() {
        document.getElementById("fileInput").click();
    });

    //file input that will be hidden
    input = document.createElement("input");
    input.type = "file";
    input.accept = ".mp4,.mp3";
    input.multiple = true;
    input.id = "fileInput";
    input.addEventListener("change", addNewVideo);

    div = document.getElementById("removeButton");
    div.appendChild(removeButton);
    div.appendChild(input);
    div.appendChild(addVideo);
}

// play passed video
function play(index) {
    videoID = index;
    // console.log(index);
    div = document.getElementById("playerDiv");
    //setting up video tag
    videoPlayer = document.createElement("video");
    videoPlayer.autoplay = true;
    videoPlayer.controls = true;
    videoPlayer.className  = "videoPlayer";
    video = videoPlayer
    setUrl(index,videoPlayer)
    video.addEventListener("progress", updateTimestamp);
    video.addEventListener("ended", videoEnded);
    //listeners for watch togeather
    video.addEventListener("play", playEvent);
    video.addEventListener("pause", pauseEvent);
    video.addEventListener("seeked", seekedEvent);
    video.addEventListener("stalled", bufferingEvent);
    video.addEventListener("suspend", bufferingEvent);
    checkPlayTime(video);
    div.appendChild(videoPlayer);

    //add buttons
    buttonDiv = document.createElement("div");
    buttonDiv.className = "playerButtons";
    next = document.createElement("button");
    prev = document.createElement("button");
    next.onclick = nextPressed;
    prev.onclick = prevPressed;
    next.innerText = "Next";
    prev.innerText = "Prev";
    next.id = "nextButton";
    prev.id = "prevButton";

    //add heart
    heart = document.createElement("img");
    heart.src = "images/heartBlank.png"
    heart.id = index+"-checkbox";
    heart.className = "heart";
    heart.src = ((fav) ? "images/heartFilled.png" : "images/heartBlank.png"); 
    heart.className = ((fav) ? "heartFilled" : "heart"); 
    heart.checked = fav;
    heart.addEventListener("click", favOnClick);

    buttonDiv.appendChild(prev);
    buttonDiv.appendChild(next);
    buttonDiv.appendChild(heart);
    div.appendChild(buttonDiv);
}

//gets the full path for the video request from the index
function setUrl(index,videoPlayer) {
    searchUrl = new URL(url+"path");
    searchUrl.searchParams.append("videoIndex",index);

    fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
        console.log("video");
        console.log(data);
        console.log("");
        _video = data[0];
        source = document.createElement("source");
        source.src = url + data[0].Full_path;
        source.type = "video/mp4";
        videoPlayer.appendChild(source);
    })
    .catch(error => {
        console.error("couldnt set new url", error);
    });
}

//checks if the user has watched this video before
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
        if(data.length > 0){
            videoPlayer.currentTime = (data[0].time);
        }
    })
    .catch(error => {
        console.error("couldnt get the timstamp", error);
    });

}

//makes request for all items within a folder from the passed in index
function findFolder(index){
    folderUrl = new URL(url+"folder");
    folderUrl.searchParams.append("folderIndex",index);
    fetch(folderUrl)
    .then(response => response.json())
    .then(data =>{
        arrayOfContents = data;
        arr = data;
        for (let index = 0; index < arr.length; index++) {
            let recent = ((recents.has(arr[index].id)) ? true : false ) 
            makeWidget(arr[index].Name, arr[index].id, arr[index].dir, arr[index].folder,recent);
        }
    })
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
}

//makes video widget //I didnt feel like using react so here it is done
function makeWidget(name,id,dir,folder,recent){
    main = document.getElementById("videosDiv");
    div = document.createElement("div");
    div.id = "lineDiv";

    content = document.createElement("a");
    content.href = "video.html?data="+name + 
               "&index=" + id +
               "&dir=" + dir +
               "&folder=" + folder+   
               "&userID=" + userID;   
    content.innerText = name.split(".mp4")[0];
    content.className = "nextup";
    div.appendChild(content);

    if(recent){
        console.log("recents");
        recentCheck = document.createElement("img");
        recentCheck.className = "recent";
        recentCheck.src = "images/recentCheck.webp";
        div.appendChild(recentCheck);
    }

    main.appendChild(div);
}

//buttons
function prevPressed(){
    index = findIndex(arrayOfContents, _video.id);

    if(index != 0){
        location.replace(document.querySelectorAll(".nextup")[index-1].href);
    }
}
function nextPressed(){
    index = findIndex(arrayOfContents, _video.id);

    if(index < arrayOfContents.length-1){
        location.replace(document.querySelectorAll(".nextup")[index+1].href);
    }
}

//finds the index of the currently playing video
function findIndex(arr, id){
    for (let i = 0; i < arr.length; i++) {
        video = arr[i].id;
        console.log("video", video);
        console.log(id);
        if(id == video){
            return i;
        }
    }
    return undefined;
}

//onclick for removeFolder button
function removeFolder(){
    if(confirm("Are you sure you wanna delete this folder?")){
        deletUrl = new URL(url+"removeDir");
        deletUrl.searchParams.append("id", folderID);
        fetch(deletUrl, {method: "DELETE"})
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error("couldnt delete curr folder", error);
        });
    
        //go to home
        location.replace("home.html?userID="+userID);
    }
} 

//send new timestamp to the db
let go = true;
function updateTimestamp(event){
    time = video.currentTime;
    time = Math.round(time);
    
    //dont bother saving if its less then 1 time
    if(time > 180 && time != 0){

        //funny system so it only fires evey 2nd time //to save from repeats
        if(go == false){
            go = true;
            return;
        }
        go = false;

        console.log("fireed");

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
    .then(nextPressed)
    .catch(error => {
        console.error("couldnt update timestamp", error);
    });
}

//onclick function for the check box
//saves or unsaves the clicked video
function favOnClick(event){
    heart = event.srcElement;
    src = heart.className;

    if(src == "heart"){
        console.log("add");
        addFav(heart.id.split("-")[0]);
    }else{
        console.log("remove");
        removeFav(heart.id.split("-")[0]);
    }
}
//adds new fav 
function addFav(id){
    heart = document.getElementById(id+"-checkbox");
    heart.src = "images/heartFilled.png";
    heart.className = "heartFilled";

    formData = new FormData();
    formData.append("userID",urlParams.get("userID"));
    formData.append("videoID",id);

    fetch(url+"setFavorites", {
            method: "PUT",
            body: formData,
        })
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error("couldnt add fav", error);
        });
}
//adds new fav 
function removeFav(id){
    heart = document.getElementById(id+"-checkbox");
    heart.src = "images/heartBlank.png";
    heart.className = "heart";


    formData = new FormData();
    formData.append("userID",urlParams.get("userID"));
    formData.append("videoID",id);

    fetch(url+"removeFavorites", {
            method: "DELETE",
            body: formData,
        })
        .then(response => response.json())
        .then()
        .catch(error => {
            console.error("couldnt remove fav", error);
        });
}

//gets the Favorites
async function getFavs(userID,videoID){

    const formData = new FormData();
    formData.append("userID", userID);

    const response = await fetch(url + "getFavorites", {
        method: "PUT",
        body: formData,
    });

    const data = await response.json();

    if (data.length > 0) {
        for (let video of data) {
            if (video.videoID == videoID) {
                return true;
            }
        }
    }

    return false;
        
}

//configs the edit screen so it goes to the right place
function configEdit(videoID){
    document.getElementById("edit").href = "videoEdit.html?videoID="+videoID + 
    "&userID=" + userID;
}

//change event for new file input
//adds new file to the current folder
function addNewVideo(event){
    console.log(event.target.files);
    files = event.target.files;

    //check for any repeat names
    let map = new Map();
    for(i = 0;i < arrayOfContents.length; i++){
        let name = arrayOfContents[i].name;
        if(!map.has(name)){
            map.set(name,1);
        }
    }
    for(i = 0;i < files.length; i++){
        let name = files[i].name;
        if(map.has(name)){
            document.getElementById("error").innerText = name + " is already in this folder";
            return;
        }
    }

    formData = new FormData();
    formData.append("videoID",videoID);
    formData.append("folderName",name);
    formData.append("description"," ");
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    fetch(url+"upload-folder", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(reload)
    .catch(error => {
        console.error("couldnt upload new video to folder", error);
    });

}

//reloads the page
function reload(){
    console.log("reloads");
    document.getElementById("videosDiv").innerHTML = "";
    document.getElementById("removeButton").innerHTML = "";
    document.getElementById("error").innerText = "";
    getQueryParam()
}

let _socket;
function createSocket(){

    document.getElementById("progress").innerText = "Connecting . . . ";

    //add end watch together 
    endButton = document.createElement("button");
    endButton.id = "endWatchButton"
    endButton.innerText = "End Watch Together"
    endButton.onclick = function(){
        _socket.close();
        document.getElementById("endWatchButton").remove();
    }
    document.getElementById("headerButtons").appendChild(endButton);

    formData = new FormData();
    formData.append("id",videoID);

    fetch(url + "openSocket", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(openSocket)
}
function openSocket(response){

    document.getElementById("progress").innerText = "";
    console.log("watch togeather open on: " + response);

    socket = new WebSocket('ws://localhost:'+response);
    _socket = socket;
    socket.onopen = function(event) {
      // Handle connection open
    };
    
    // Handle received message
    socket.onmessage = function(event) {
        message = event.data

        if(message == "play"){
            video.play()
            console.log("playing");

        }else if(message == "pause"){
            video.pause();
            console.log("pausing");

        }else if(message.split("seek:").length > 1){
            time = message.split("seek: ")[1];
            console.log("skipping to: "+ time);
            //checking if already at correct time //avoids loop
            if(video.currentTime != time){
                video.currentTime = time;
            }
        }else{ //buffering or anything else
            video.pause();
            console.log("other user buffering");
        }
    };

}

function sendWebsocket(){
  meow = document.getElementById("timmy").value;
  _socket.send(message); 
}

//all events for the video in relation to watch together
function playEvent(event){
    if(_socket){
        video = event.target;
        _socket.send("play")
    }
}
function pauseEvent(event){
    if(_socket){
        video = event.target;
        _socket.send("pause")
    }
    
}
function seekedEvent(event){
    if(_socket){
        video = event.target;
        _socket.send("seek: "+event.target.currentTime)
    }
    
}
//for satlled and suspended
function bufferingEvent(event){
    if(_socket){
        video = event.target;
        _socket.send("buffering")
    }

}

