let url = IP;
let video;
let userID;
let isFolder;
const urlParams = new URLSearchParams(window.location.search);
function onload() {
    videoID = urlParams.get("videoID");
    userID = urlParams.get("userID");
    isFolder = urlParams.get("folder");

    if(isFolder != 1){
        document.getElementById("clearButton").hidden = true;
    }

    //sets the params of the home button
    document.getElementById("home").href = "home.html?userID="+userID;
    video = getVideo(videoID);

    getFolders();
}

//gets the video from the db
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

//displays the video
function displayVideo(video){
    video = video[0];

    const name = document.getElementById("videoName");
    name.value  = video.Name;
    name.innerText  = video.Name;

    const desc = document.getElementById("videoDesc");
    desc.value  = video.Description;
    desc.innerText  = video.Description;

    const icon = document.getElementById("icon")
    icon.src = url + video.icon;
}

//updates video
function update(){
    const formData = new FormData();
    const videoName = document.getElementById("videoName").value;
    const desc = document.getElementById("videoDesc").value;

    //check if user has opted to change the icon
    const newIcon = document.getElementById("fileInput")
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
        console.error("couldnt update video", error);
    });

    location.replace("home.html?userID="+userID);

}

//removes the displayed video
function remove(){
    if(confirm("Are you sure you want to delete this?")){
        const id = urlParams.get("videoID");
        if(isFolder == 1){
            const deletUrl = new URL(url+"removeDir");
            deletUrl.searchParams.append("id", id);
            fetch(deletUrl, {method: "DELETE"})
            .then(response => response.json())
            .then()
            .catch(error => {
                console.error("couldnt delete current video", error);
            });
        }else{//not folder
            const deletUrl = new URL(url+"remove");
            deletUrl.searchParams.append("id", id);
            fetch(deletUrl, {method: "DELETE"})
            .then(response => response.json())
            .then()
            .catch(error => {
                console.error("couldnt delete current video", error);
            });
        }

        //go to home screen
        location.replace("home.html?userID="+userID);
    }

}

//clears all timestamps for the folder and the user
function clearTimestamp(){
        const formData = new FormData();
        formData.append("userID",userID);
        formData.append("folderID",videoID);
        
        fetch(url+"clearTimestamp", {
            method: "PUT",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("Timestamps cleared");
            document.getElementById("clearButton").hidden = true;
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });    
}

//gets all folders for use in moveto drop down
function getFolders(){
    fetch(url+"Allfolders")
        .then(response => response.json())
        .then(data =>{
            // put it all in the move drop down
            console.log(data);
            data.forEach(folder => {
                document.getElementById("folderSelect").add(new Option(folder.Name , folder.id));
            });
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//moves all items within this folder to the selected folder
function move(){
    // take selected folder
    const select = document.getElementById("folderSelect");
    const newDir = select.value;
    const oldDir = urlParams.get("videoID");
    const selectElement = document.querySelector('#folderSelect');
    const newName = selectElement.options[selectElement.selectedIndex].innerText;
    // const newName = select.innerText;
    const oldName = document.getElementById("videoName").value;

    var formData = new FormData();
    formData.append("newDir", newDir);
    formData.append("oldDir", oldDir);
    formData.append("oldName", oldName);
    formData.append("newName", newName);

    fetch(url+"moveFolders", {
                method: "post",
                body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("", error);
    });

}