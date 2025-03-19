<<<<<<< HEAD
let url = "http://192.168.1.124:3000/";
let allvideos =[];
let favoriteVideos = new Map();
const urlParams = new URLSearchParams(window.location.search);
//get all videos from the server
function onload(){
    userID = urlParams.get("userID");
    type = urlParams.get("data");

    document.getElementById("home").href = "home.html?userID="+userID;
    //0 is favs
    //1 is recents
    if(type == 1){
        document.getElementById("videosLabel").innerText = "All Recently Watched Videos";
        getFavorites(userID)
        recent(userID);
    }else if(type == 0){
        document.getElementById("videosLabel").innerText = "All Favorited Videos";
        favorites(userID);
    }

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
                document.getElementById("videosItems").innerHTML ="";
                //add widgets
                for (let i = 0; i < data.length; i++) {
                    video = data[i];
                    if(favoriteVideos.get(video.id)){
                        fav = true;
                    }else{fav = false}
                    makeWidget(video.Name.split(".mp4")[0], video.id, video.dir, video.folder, video.Description, video.icon,"videosItems",fav);
    
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
                document.getElementById("videosItems").innerHTML ="";
                //adds all to widget
                for (let i = 0; i < data.length; i++) {
                    video = data[i];
                    favoriteVideos.set(video.id,true);
                    makeWidget(video.Name.split(".mp4")[0], video.id, video.dir, video.folder, video.Description, video.icon,"videosItems",true);
                }
            }
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });

}

//used to get a hashmap of all favorited videos.
function getFavorites(userID){
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
                for (let i = 0; i < data.length; i++) {
                    video = data[i];
                    favoriteVideos.set(video.id,true);
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
    content.innerText = name;

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
        .then(reload)
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
        .then(reload)
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//reloads the favs section
function reload(){
    favoriteVideos = new Map();
    document.getElementById("videosItems").innerHTML ="";
    onload();
};

function gotoUpload(){
    location.replace("uploadForm.html?userID="+urlParams.get("userID"));
}

function removeAll(){
    type = urlParams.get("data");
    //0 is favs
    //1 is recents
    if(type == 1){
        //make call to remove all recently watched
        formData = new FormData();
        formData.append("userID",urlParams.get("userID"));

        fetch(url+"removeAllRecents", {
                method: "DELETE",
                body: formData,
            })
            .then(response => response.json())
            .then(reload)
            .catch(error => {
                console.error("couldnt make connection to database", error);
            });
    }else{
        //make call to remove all favs
        formData = new FormData();
        formData.append("userID",urlParams.get("userID"));

        fetch(url+"removeAllFavorites", {
                method: "DELETE",
                body: formData,
            })
            .then(response => response.json())
            .then(reload)
            .catch(error => {
                console.error("couldnt make connection to database", error);
            });
    }
}

function logout(){
    location.replace("index.html");
=======
let url = "http://192.168.1.124:3000/";
let allvideos =[];
let favoriteVideos = new Map();
const urlParams = new URLSearchParams(window.location.search);
//get all videos from the server
function onload(){
    userID = urlParams.get("userID");
    type = urlParams.get("data");

    document.getElementById("home").href = "home.html?userID="+userID;
    //0 is favs
    //1 is recents
    if(type == 1){
        document.getElementById("videosLabel").innerText = "All Recently Watched Videos";
        getFavorites(userID)
        recent(userID);
    }else if(type == 0){
        document.getElementById("videosLabel").innerText = "All Favorited Videos";
        favorites(userID);
    }

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
                document.getElementById("videosItems").innerHTML ="";
                //add widgets
                for (let i = 0; i < data.length; i++) {
                    video = data[i];
                    if(favoriteVideos.get(video.id)){
                        fav = true;
                    }else{fav = false}
                    makeWidget(video.Name.split(".mp4")[0], video.id, video.dir, video.folder, video.Description, video.icon,"videosItems",fav);
    
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
                document.getElementById("videosItems").innerHTML ="";
                //adds all to widget
                for (let i = 0; i < data.length; i++) {
                    video = data[i];
                    favoriteVideos.set(video.id,true);
                    makeWidget(video.Name.split(".mp4")[0], video.id, video.dir, video.folder, video.Description, video.icon,"videosItems",true);
                }
            }
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });

}

//used to get a hashmap of all favorited videos.
function getFavorites(userID){
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
                for (let i = 0; i < data.length; i++) {
                    video = data[i];
                    favoriteVideos.set(video.id,true);
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
    content.innerText = name;

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
        .then(reload)
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
        .then(reload)
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//reloads the favs section
function reload(){
    favoriteVideos = new Map();
    document.getElementById("videosItems").innerHTML ="";
    onload();
};

function gotoUpload(){
    location.replace("uploadForm.html?userID="+urlParams.get("userID"));
}

function removeAll(){
    type = urlParams.get("data");
    //0 is favs
    //1 is recents
    if(type == 1){
        //make call to remove all recently watched
        formData = new FormData();
        formData.append("userID",urlParams.get("userID"));

        fetch(url+"removeAllRecents", {
                method: "DELETE",
                body: formData,
            })
            .then(response => response.json())
            .then(reload)
            .catch(error => {
                console.error("couldnt make connection to database", error);
            });
    }else{
        //make call to remove all favs
        formData = new FormData();
        formData.append("userID",urlParams.get("userID"));

        fetch(url+"removeAllFavorites", {
                method: "DELETE",
                body: formData,
            })
            .then(response => response.json())
            .then(reload)
            .catch(error => {
                console.error("couldnt make connection to database", error);
            });
    }
}

function logout(){
    location.replace("index.html");
>>>>>>> 5f108183f1a777aeb5d002bc2a116c1972b6971e
}