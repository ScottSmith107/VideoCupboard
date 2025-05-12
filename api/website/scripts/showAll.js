let url = IP;
let allvideos =[];
let favoriteVideos = new Map();
let userID;
const urlParams = new URLSearchParams(window.location.search);
//get all videos from the server
function onload(){
    userID = urlParams.get("userID");
    const type = urlParams.get("data");

    document.getElementById("home").href = "home.html?userID="+userID;
    //0 is favs
    //1 is recents      //this was done bcause i didnt wanna make a new page and the page could be dual use so easily
    if(type == 1){
        document.getElementById("videosLabel").innerText = "Recently Watched ";
        getFavorites(userID)
        recent(userID);
    }else if(type == 0){
        document.getElementById("videosLabel").innerText = "Favorites";
        favorites(userID);
    }

}

//gets the recent videos then displays them
function recent(userID){        
    const formData = new FormData();
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
                    const video = data[i];
                    const fav = ((favoriteVideos.get(video.id) ? true : false));
                    makeWidget(video.Name.split(".mp4")[0], video.id, video.dir, video.folder, video.Description, video.icon,"videosItems",fav);
    
                }
            }
        })
        .catch(error => {
            console.error("couldnt get recents", error);
        });
}

//gets the favorite videos then displays them
function favorites(userID){
    const formData = new FormData();
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
                    const video = data[i];
                    favoriteVideos.set(video.id,true);
                    makeWidget(video.Name.split(".mp4")[0], video.id, video.dir, video.folder, video.Description, video.icon,"videosItems",true);
                }
            }
        })
        .catch(error => {
            console.error("couldnt get favorites", error);
        });

}

//used to get a hashmap of all favorited videos.
//rather then display them
function getFavorites(userID){
    const formData = new FormData();
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
                    const video = data[i];
                    favoriteVideos.set(video.id,true);
                }
            }
        })
        .catch(error => {
            console.error("couldnt get favorites for hash map", error);
        });

}

//makes video widget //I didnt feel like using react so here it is done
function makeWidget(name,id, dir, folder,desc,iconPath,divID,fav){
    const main = document.getElementById(divID);

    const div = document.createElement("div");
    div.className ="video";

    const nameDiv = document.createElement("div");
    nameDiv.className = "nameDiv";

    const content = document.createElement("a");
    content.id = id;
    content.className = "link";
    content.href = "video.html?data="+name + 
               "&index=" + id +
               "&dir=" + dir +
               "&userID=" + urlParams.get("userID") +
               "&folder=" + folder;   
    content.innerText = name;

    const description = document.createElement("p");
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
        const icon = document.createElement("img");
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

    const heart = document.createElement("img");
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
    const formData = new FormData();
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
    const formData = new FormData();
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

//reloads the section
function reload(){
    favoriteVideos = new Map();
    document.getElementById("videosItems").innerHTML ="";
    onload();
};

//removes all favorites or recents from the db 
//will swap to either depending what data is 
function removeAll(){
    const type = urlParams.get("data");
    //make call to remove all recently watched
    const formData = new FormData();
    formData.append("userID",urlParams.get("userID"));
    //0 is favs
    //1 is recents
    if(type == 1){

        fetch(url+"removeAllRecents", {
                method: "DELETE",
                body: formData,
            })
            .then(response => response.json())
            .then(reload)
            .catch(error => {
                console.error("couldnt remove all recently watched", error);
            });
    }else{
        fetch(url+"removeAllFavorites", {
                method: "DELETE",
                body: formData,
            })
            .then(response => response.json())
            .then(reload)
            .catch(error => {
                console.error("couldnt remove all favs", error);
            });
    }
}