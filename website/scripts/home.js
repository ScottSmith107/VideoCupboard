let url = "http://192.168.1.124:3000/";
let allvideos =[];
let favoriteVideos = new Map();
const urlParams = new URLSearchParams(window.location.search);
//get all videos from the server
function onload(){
    formData = new FormData();
    formData.append("userID",urlParams.get("userID"));

    fetch(url+"getFavorites", {
            method: "PUT",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("favorites");
            console.log(data);
            if(data.length > 0){
                //reset div
                document.getElementById("favoritesItems").innerHTML ="";
                //displays all on phone but only 3 on desktop
                const mediaQuery = window.matchMedia('(max-width: 1000px)')
                //adds all to widget
                for (let i = 0; i < data.length; i++) {
                    video = data[i];
                    favoriteVideos.set(video.id,true);
                    if(mediaQuery.matches){
                        makeWidget(video.Name, video.id, video.dir, video.folder, video.Description, video.icon,"favoritesItems",true);
                    }
                    else if(i < 3){
                        makeWidget(video.Name, video.id, video.dir, video.folder, video.Description, video.icon,"favoritesItems",true);
                    }
                }
            }
        })
        .then(recent(urlParams.get("userID")))
        .then(getVideos)
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });

        configShowButton();
}

function configShowButton(){
    document.getElementById("showfavorites").href = "showAll.html?data=0"+
               "&userID=" + urlParams.get("userID");

    document.getElementById("showRecents").href = "showAll.html?data=1"+
                "&userID=" + urlParams.get("userID"); 
}

//places all the videos into the div
function getVideos(){

    fetch(url+"allVideos")
        .then(response => response.json())
        .then(data =>{
            console.log("all");
            console.log(data);
            allvideos = data;
            arr = data;
            for (let index = 0; index < arr.length; index++) {
                video = data[index];
                fav = ((favoriteVideos.get(video.id) ? true : false));
                makeWidget(arr[index].Name, arr[index].id, arr[index].dir, arr[index].folder, arr[index].Description, arr[index].icon,"videosItems",fav);
            }
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
    
}

//gets the recent videos then displays them
function recent(userID){        
    formData = new FormData();
    formData.append("userID",userID);

    fetch(url+"getRecent", {
            method: "PUT",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("recents");
            console.log(data);
            if(data.length > 0){
                //clear div
                document.getElementById("recentItems").innerHTML ="";
                //displays all on phone but only 3 on desktop
                const mediaQuery = window.matchMedia('(max-width: 1000px)')
                //add widgets
                for (let i = 0; i < data.length; i++) {
                    video = data[i];
                    fav = ((favoriteVideos.get(video.id) ? true : false));
                    if(mediaQuery.matches){
                        makeWidget(video.Name, video.id, video.dir, video.folder, video.Description, video.icon,"recentItems",fav);
                    }
                    else if(i < 3){
                        makeWidget(video.Name, video.id, video.dir, video.folder, video.Description, video.icon,"recentItems",fav);
                    }
    
                }
            }
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//gets the recent videos then displays them
function favorites(userID){
    formData = new FormData();
    formData.append("userID",userID);

    fetch(url+"getFavorites", {
            method: "PUT",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("favorites");
            console.log(data);
            if(data.length > 0){
                //reset div
                document.getElementById("favoritesItems").innerHTML ="";
                //adds all to widget
                limit = ((data.length > 3) ? 3 : data.length);
                for (let i = 0; i < limit; i++) {
                    video = data[i];
                    favoriteVideos.set(video.id,true);
                    makeWidget(video.Name, video.id, video.dir, video.folder, video.Description, video.icon,"favoritesItems",true);
                }
            }
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });

}

//makes widget the silly way because i dont like react
function makeWidget(name,id, dir, folder,desc,iconPath,divID,fav){
    main = document.getElementById(divID);

    div = document.createElement("div");
    div.className ="video";

    nameDiv = document.createElement("div");
    nameDiv.className = "nameDiv";

    content = document.createElement("a");
    content.id = id;
    content.className = "link";
    content.href = "video.html?data="+name + 
               "&index=" + id +
               "&dir=" + dir +
               "&userID=" + urlParams.get("userID") +
               "&folder=" + folder;   
    content.innerText = name.split(".mp4")[0];

    description = document.createElement("p");
    description.innerText = desc;
    description.className = "desc";
    description.onclick = function(){
        location.replace("video.html?data="+name + 
           "&index=" + id +
           "&dir=" + dir +
           "&userID=" + urlParams.get("userID") +
           "&folder=" + folder);
    }

    if(iconPath){
        icon = document.createElement("img");
        icon.src = url+iconPath;
        icon.onclick = function(){
            location.replace("video.html?data="+name + 
               "&index=" + id +
               "&dir=" + dir +
               "&userID=" + urlParams.get("userID") +
               "&folder=" + folder);
        }
        icon.className = "videoIcon"
        div.appendChild(icon)
    }

    heart = document.createElement("img");
    heart.src = "images/heartBlank.png"
    heart.id = id+"-checkbox";
    heart.className = "heart";
    heart.src = ((fav) ? "images/heartFilled.png" : "images/heartBlank.png"); 
    heart.className = ((fav) ? "favedHeart" : "heart"); 
    heart.checked = fav;
    heart.addEventListener("click", favOnClick);

    nameDiv.appendChild(content)
    nameDiv.appendChild(description)
    nameDiv.appendChild(heart);

    div.appendChild(nameDiv);
    main.appendChild(div);

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
    formData = new FormData();
    formData.append("userID",urlParams.get("userID"));
    formData.append("videoID",id);

    fetch(url+"setFavorites", {
            method: "PUT",
            body: formData,
        })
        .then(response => response.json())
        .then(reloadFavs)
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//adds new fav 
function removeFav(id){
    formData = new FormData();
    formData.append("userID",urlParams.get("userID"));
    formData.append("videoID",id);

    fetch(url+"removeFavorites", {
            method: "DELETE",
            body: formData,
        })
        .then(response => response.json())
        .then(reloadFavs)
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//reloads the favs section
function reloadFavs(){
    favoriteVideos = new Map();

    document.getElementById("favoritesItems").innerHTML ="";
    document.getElementById("recentItems").innerHTML ="";
    document.getElementById("videosItems").innerHTML ="";

    onload();
};

function gotoUpload(){
    location.replace("uploadForm.html?userID="+urlParams.get("userID"));
}

function logout(){
    location.replace("index.html");
}