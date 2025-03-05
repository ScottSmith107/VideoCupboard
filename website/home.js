let url = "http://192.168.1.124:3000/";
const urlParams = new URLSearchParams(window.location.search);
//get all videos from the server
let getVideos = () => {

    fetch(url+"allVideos")
        .then(response => response.json())
        .then(display)
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//places all the videos into the div
function display(response){
    console.log(response);
    arr = response;
    for (let index = 0; index < arr.length; index++) {
        makeWidget(arr[index].name, arr[index].id, arr[index].dir, arr[index].folder);
    }
}

//makes widget the silly way because i dont like react
function makeWidget(name,id, dir, folder){
    main = document.getElementById("videosDiv");

    div = document.createElement("div");
    content = document.createElement("a");
    
    content.href = "video.html?data="+name + 
               "&index=" + id +
               "&dir=" + dir +
               "&userID=" + urlParams.get("userID") +
               "&folder=" + folder;   
    content.innerText = name;

    div.appendChild(content)
    main.appendChild(div);

}

function gotoUpload(){
    location.replace("uploadForm.html");
}