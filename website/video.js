let url = "http://localhost:3000/";
let folder ="";
// Function to get URL parameters
function getQueryParam() {

    title = document.getElementById("title");
    const urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get("data");
    dir = urlParams.get("dir");

    title.innerText = name;
    //check if the passed name is a folder
    if(name.split('-')[1]=="folder"){
        findFolder(name)
        folder += name;
    }
    else{
        play(name)
        if(dir == null){
            findFolder("");
        }else{
            findFolder(dir);
        }
    }
}

// play passed video
function play(name) {
    div = document.getElementById("playerDiv");
    // console.log(div);
    //setting up video tag
    videoPlayer = document.createElement("video");
    videoPlayer.autoplay = false;
    videoPlayer.controls = true;
    source = document.createElement("source");
    source.src = url + name;
    source.type = "video/mp4";
    //displaying player
    videoPlayer.appendChild(source);
    div.appendChild(videoPlayer);
    //add buttons
    next = document.createElement("button");
    prev = document.createElement("button");
    next.onclick = nextPressed;
    prev.onclick = prevPressed;
    next.innerText = "Next";
    prev.innerText = "Prev";
    next.id = "nextButton";
    prev.id = "prevButton";
    div.appendChild(prev);
    div.appendChild(next);
}

//makes request for all items within a folder
function findFolder(name){
    folderUrl = new URL(url+"folder");
    folderUrl.searchParams.append("folder",name);

    fetch(folderUrl)
    .then(response => response.json())
    .then(display)
    .catch(error => {
        console.error("couldnt make connection to database", error);
    });
}

//displays
function display(response){
    // console.log(response);
    arr = response.files;
    for (let index = 0; index < arr.length; index++) {
        makeWidget(arr[index]);
    }
}

//makes widget the silly way because i dont like react
function makeWidget(name){
    main = document.getElementById("videosDiv");

    div = document.createElement("div");
    content = document.createElement("a");
    
    content.href = "video.html?data="+name + 
               "&dir=" + folder;    
    content.innerText = name;

    div.appendChild(content)
    main.appendChild(div);
}

//buttons
function prevPressed(){
    arr = findVideos();
    curr = document.getElementById("title").innerText;
    currIndex = findIndex(arr, curr);
    
    if(currIndex != 0){
        next = arr[currIndex-1]; 
        //check if folder
        if(next.split('-')[1]=="folder"){
            location.replace("video.html?data="+next + "&dir=" + next); 
        }
        document.getElementById("title").innerText = next;
        // console.log("next up: "+next);
        //reload screan
        document.getElementById("playerDiv").innerHTML="";
        document.getElementById("videosDiv").innerHTML="";

        play(next)
        if(dir == null){
            findFolder("");
        }else{
            findFolder(dir);
        }
    }
    
}
function nextPressed(){
    arr = findVideos();
    curr = document.getElementById("title").innerText;
    currIndex = findIndex(arr, curr);

    if(currIndex < arr.length-1){
        next = arr[currIndex+1];
        //check if folder
        if(next.split('-')[1]=="folder"){
            location.replace("video.html?data="+next + "&dir=" + next); 
        } 
        document.getElementById("title").innerText = next;
        // console.log("next up: "+next);
        //reload screan
        document.getElementById("playerDiv").innerHTML="";
        document.getElementById("videosDiv").innerHTML="";

        play(next);
        if(dir == null){
            findFolder("");
        }else{
            findFolder(dir);
        }
    }
}

//finds the videos from the list on screen
//returns an array of filename strings
function findVideos(){
    links = document.querySelectorAll("a");
    output = [];
    for (let i = 0; i < links.length; i++) {
        link = links[i].innerText;
        output[i] = link;
    }

    return output;
}

//finds the index of the currently playing video
function findIndex(arr, curr){
    for (let i = 0; i < arr.length; i++) {
        video = arr[i];
        if(curr == video){
            return i;
        }
    }
    return undefined;
}