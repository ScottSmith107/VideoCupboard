let url = IP;
let urlParams = new URLSearchParams(window.location.search);
let arrayOfContents = [];
let folderID;
let videoID;
let userID;
let video;
let _video;
let name;
let fav;
let recents = new Map();
// Function to get URL parameters
//serves as onload function
async function getQueryParam() {
    const title = document.getElementById("title");
    name = urlParams.get("data");
    videoID = urlParams.get("index");
    userID = urlParams.get("userID");
    const folder = urlParams.get("folder");
    dir = urlParams.get("dir");
    fav = await getFavs(userID,videoID);

    configEdit(videoID);

    title.innerText = name.split(".mp4")[0];
    
    recent(userID,videoID);
    //check if the passed name is a folder
    if(folder == 1){
        addFolderButtons(videoID);
        document.body.style.backgroundImage = "url('../images/folderBackground.jfif')";
    }
    else{//if not a folder then play the video
        play(videoID);
        document.body.style.backgroundImage = "url('../images/folderBackground.jfif')";
    }

    //sets the params of the home button
    document.getElementById("home").href = "home.html?userID="+userID;
}

//gets the recent videos and save to map
function recent(userID,videoID){        
    const formData = new FormData();
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
                    const video = data[i];
                    recents.set(video.videoID,true)
                }
            }
            findFolder(urlParams.get("dir"))
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//adds "removeFolder" button under the folder title
function addFolderButtons(videoID){
    folderID = videoID;

    //remove folder button
    const removeButton = document.createElement("button");
    removeButton.id = "removeFolder";
    removeButton.innerText = "Remove Folder";
    removeButton.onclick = removeFolder;

    //add to folder button
    const addVideo = document.createElement("button");
    addVideo.id = "addVideo";
    addVideo.innerText = "Add Video";
    addVideo.addEventListener("click", function() {
        document.getElementById("fileInput").click();
    });

    //file input that will be hidden
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".mp4,.mp3";
    input.multiple = true;
    input.id = "fileInput";
    input.addEventListener("change", addNewVideo);

    const div = document.getElementById("removeButton");
    div.appendChild(removeButton);
    div.appendChild(input);
    div.appendChild(addVideo);
}

// play passed video
function play(videoID) {
    videoID = videoID;
    // console.log(index);
    const div = document.getElementById("playerDiv");
    //setting up video tag
    let videoPlayer = document.createElement("video");
    videoPlayer.autoplay = true;
    videoPlayer.controls = true;
    videoPlayer.className  = "videoPlayer";
    videoPlayer.id = "videoPlayer";
    //get volume pref from cookies
    if(document.cookie){
        var volume = document.cookie;
        volume = volume.split("=")[1];
        videoPlayer.volume = volume;
    }
    video = videoPlayer
    setUrl(videoID,videoPlayer)
    video.addEventListener("progress", () =>{
        var time = video.currentTime;
        updateTimestamp(time,videoID); 
    });
    video.addEventListener("ended", videoEnded);
    //listeners for watch togeather
    video.addEventListener("play", playEvent);
    video.addEventListener("pause", pauseEvent);
    video.addEventListener("seeked", seekedEvent);
    video.addEventListener("stalled", bufferingEvent);
    video.addEventListener("suspend", bufferingEvent);
    video.addEventListener("volumechange", volumeEvent);
    checkPlayTime(video);
    div.appendChild(videoPlayer);

    //add buttons
    const buttonDiv = document.createElement("div");
    buttonDiv.className = "playerButtons";
    const next = document.createElement("button");
    const prev = document.createElement("button");
    next.onclick = nextPressed;
    prev.onclick = prevPressed;
    next.innerText = "Next";
    prev.innerText = "Prev";
    next.id = "nextButton";
    prev.id = "prevButton";

    //add heart
    const heart = document.createElement("img");
    heart.src = "images/heartBlank.png"
    heart.id = videoID + "-checkbox";
    heart.className = "heart";
    heart.src = ((fav) ? "images/heartFilled.png" : "images/heartBlank.png"); 
    heart.className = ((fav) ? "heartFilled" : "heart"); 
    heart.checked = fav;
    heart.addEventListener("click", favOnClick);

    //cast button
    const cast = document.createElement("google-cast-launcher");
    cast.id = "castbutton";

    buttonDiv.appendChild(prev);
    buttonDiv.appendChild(next);
    buttonDiv.appendChild(heart);
    buttonDiv.appendChild(cast);
    div.appendChild(buttonDiv);
}

//saves volume change to cookie
function volumeEvent(event){
    const video = event.target;
    document.cookie = "volume="+video.volume;
}

//gets the full path for the video request from the index
function setUrl(index,videoPlayer) {
    const searchUrl = new URL(url+"path");
    searchUrl.searchParams.append("videoIndex",index);

    fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
        console.log("video");
        console.log(data);
        console.log("");
        _video = data[0];
        const source = document.createElement("source");
        source.src = url + data[0].Full_path;
        source.type = "video/mp4";
        source.id = "currVideo";
        videoPlayer.appendChild(source);
    })
    .catch(error => {
        console.error("couldnt set new url", error);
    });
}

//checks if the user has watched this video before
function checkPlayTime(videoPlayer) {
    const formData = new FormData();
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
    const folderUrl = new URL(url+"folder");
    folderUrl.searchParams.append("folderIndex",index);
    fetch(folderUrl)
    .then(response => response.json())
    .then(data =>{
        arrayOfContents = data;
        const arr = data;
        console.log("all videos in folder");
        console.log(data);
        //reset the div
        document.getElementById("videosDiv").innerHTML = "";

        for (let index = 0; index < arr.length; index++) {
            const recent = ((recents.has(arr[index].id)) ? true : false ) 
            makeWidget(arr[index].Name, arr[index].id, arr[index].dir, arr[index].folder,recent);
        }

    })
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
}

//makes video widget //I didnt feel like using react so here it is done
function makeWidget(name,id,dir,folder,recent){
    const main = document.getElementById("videosDiv");
    const div = document.createElement("div");
    div.id = "lineDiv";

    const content = document.createElement("a");
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
        const recentCheck = document.createElement("img");
        recentCheck.className = "recent";
        recentCheck.src = "images/recentCheck.webp";
        div.appendChild(recentCheck);
    }

    main.appendChild(div);
}

//buttons
function prevPressed(){
    const index = findIndex(arrayOfContents, _video.id);

    if(index != 0){
        location.replace(document.querySelectorAll(".nextup")[index-1].href);
    }
}
function nextPressed(){
    console.log("next");
    let index = findIndex(arrayOfContents, _video.id);
    console.log(_video);
    console.log(arrayOfContents);

    if(index < arrayOfContents.length-1){
        var newVideo = arrayOfContents[index+1];
        _video = newVideo;
        
        //setting gloabls to new video 
        const title = document.getElementById("title");
        title.innerText = newVideo.Name.split(".mp4")[0];
        videoID = newVideo.id;
        configEdit(videoID);

        video.src = url+newVideo.Full_path;
    }
}

//finds the index of the currently playing video
function findIndex(arr, id){
    for (let i = 0; i < arr.length; i++) {
        const video = arr[i].id;
        if(id == video){
            return i;
        }
    }
    return undefined;
}

//onclick for removeFolder button
function removeFolder(){
    if(confirm("Are you sure you wanna delete this folder?")){
        const deletUrl = new URL(url+"removeDir");
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
function updateTimestamp(time,id){
    time = Math.round(time);
    
    //dont bother saving if its less then 1 time
    if(time > 180 && time != 0){

        //funny system so it only fires evey 2nd time //to save from repeats
        if(go == false){
            go = true;
            return;
        }
        go = false;

        const formData = new FormData();
        formData.append("userID",userID);
        formData.append("videoID",id);
        formData.append("timestamp",time);
        
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
    console.log("ended");
    const formData = new FormData();
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
    const heart = event.srcElement;
    const src = heart.className;

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
    const heart = document.getElementById(id+"-checkbox");
    heart.src = "images/heartFilled.png";
    heart.className = "heartFilled";

    const formData = new FormData();
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
    const heart = document.getElementById(id+"-checkbox");
    heart.src = "images/heartBlank.png";
    heart.className = "heart";


    const formData = new FormData();
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

    const formData = new FormData();
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
    const endButton = document.createElement("button");
    endButton.id = "endWatchButton"
    endButton.innerText = "End Watch Together"
    endButton.onclick = function(){
        _socket.close();
        document.getElementById("endWatchButton").remove();
    }
    document.getElementById("headerButtons").appendChild(endButton);

    const formData = new FormData();
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

    const socket = new WebSocket('ws://localhost:'+response);
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
            const time = message.split("seek: ")[1];
            console.log("skipping to: "+ time);
            //checking if already at correct time //avoids loop
            if(video.currentTime != time){
                video.currentTime = time;
                video.play();
            }
        }else{ //buffering or anything else
            // video.pause();
            console.log("other user buffering");
        }
    };

}

function sendWebsocket(){
  _socket.send(message); 
}

//all events for the video in relation to watch together
function playEvent(event){
    if(_socket){
        const video = event.target;
        _socket.send("play")
    }
}
function pauseEvent(event){
    if(_socket){
        const video = event.target;
        _socket.send("pause")
    }
    
}
function seekedEvent(event){
    if(_socket){
        const video = event.target;
        _socket.send("seek: "+video.currentTime)
    }
    
}
//for satlled and suspended
function bufferingEvent(event){
    if(_socket){
        const video = event.target;
        _socket.send("buffering")
    }

}
