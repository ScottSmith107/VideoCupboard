let url = IP;
let allvideos =[];
let favoriteVideos = new Map();
const urlParams = new URLSearchParams(window.location.search);
//displays all on phone but only 3 on desktop
const phoneSize = window.matchMedia('(max-width: 800px)');
const halfScreen = window.matchMedia('(min-width: 801px)');
const fullScreen = window.matchMedia('(min-width: 1400px)');

//get all videos from the server
function onload(){
    formData = new FormData();
    formData.append("userID",urlParams.get("userID"));

    //gets favs recents then everything else
        //so the favs are ready for the other sections to use

    fetch(url+"getFavorites", {
            method: "PUT",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("favorites");
            console.log(window);
            console.log(data);
            if(data.length > 0){
                //reset container
                document.getElementById("favoritesItems").innerHTML ="";
                //adds all to widget
                for (let i = 0; i < data.length; i++) {
                    const video = data[i];
                    const dir = ((video.folder === 1) ? video.id : video.dir);
                    favoriteVideos.set(video.id,true);
                    if(phoneSize.matches){
                        makeWidget(video.Name, video.id, dir, video.folder, video.Description, video.icon,"favoritesItems",true);
                    }
                    else if(i < 5 && halfScreen.matches){
                        makeWidget(video.Name, video.id, dir, video.folder, video.Description, video.icon,"favoritesItems",true);
                    }
                    else if(i < 8 && fullScreen.matches){
                        makeWidget(video.Name, video.id, dir, video.folder, video.Description, video.icon,"favoritesItems",true);
                    }
                }
            }
        })
        .then(recent(urlParams.get("userID")))
        .then(getVideos)
        .catch(error => {
            console.error("couldnt initialize home page", error);
        });

        configShowButton();
}

//confogs the show all buttons
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
            console.log("all Videos");
            console.log(data);
            allvideos = data;
            const arr = data;
            for (let index = 0; index < arr.length; index++) {
                const video = data[index];
                const fav = ((favoriteVideos.get(video.id) ? true : false));
                const dir = ((arr[index].folder === 1) ? arr[index].id : arr[index].dir);
                makeWidget(arr[index].Name, arr[index].id, dir, arr[index].folder, arr[index].Description, arr[index].icon,"videosItems",fav);

                if(phoneSize.matches){
                    checkForBar(3,index);
                }
                else if(fullScreen.matches){
                    console.log("MEOW");
                    checkForBar(8,index);
                }
                else if(halfScreen.matches){
                    checkForBar(5,index);
                }
                
            }
        })
        .catch(error => {
            console.error("couldnt get all videos", error);
        });
    
}

//checks if a shelf needs to be added
function checkForBar(limit,i){
    i++;
    if((i % limit) == 0){
        const main = document.getElementById("videosItems");
        const div = document.createElement("div");
        div.className = "shelf";

        main.appendChild(div);
    }
}

//gets the recent videos then displays them
function recent(userID){        
    formData = new FormData();
    formData.append("userID",userID);

    if(phoneSize.matches){
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
                //add widgets
                for (let i = 0; i < data.length; i++) {
                    const video = data[i];
                    const fav = ((favoriteVideos.get(video.id) ? true : false));
                    const dir = ((video.folder === 1) ? video.id : video.dir);

                    makeWidget(video.Name, video.id, dir, video.folder, video.Description, video.icon,"recentItems",fav);
                }
            }
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
    }
    else {//if not phone sized
        fetch(url+"getRecentLimit", {
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
                //add widgets
                for (let i = 0; i < data.length; i++) {
                    const video = data[i];
                    const fav = ((favoriteVideos.get(video.id) ? true : false));
                    const dir = ((video.folder === 1) ? video.id : video.dir);
                    if(i < 5 && halfScreen.matches){
                        makeWidget(video.Name, video.id, dir, video.folder, video.Description, video.icon,"recentItems",fav);
                    }
                    else if(i < 8 && fullScreen.matches){
                        makeWidget(video.Name, video.id, dir, video.folder, video.Description, video.icon,"recentItems",fav);
                    }
    
                }
            }
        })
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
    }

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
    content.innerText = name.split(".mp4")[0];

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
        .then(reloadFavs)
        .catch(error => {
            console.error("couldnt add new fav", error);
        });
}

//deletes new fav 
function removeFav(id){
    const formData = new FormData();
    formData.append("userID",urlParams.get("userID"));
    formData.append("videoID",id);

    fetch(url+"removeFavorites", {
            method: "DELETE",
            body: formData,
        })
        .then(response => response.json())
        .then(reloadFavs)
        .catch(error => {
            console.error("couldnt delete fav", error);
        });
}

//reloads the favs section
//i felt this was better then a reload
function reloadFavs(){
    favoriteVideos = new Map();

    document.getElementById("favoritesItems").innerHTML ="";
    document.getElementById("recentItems").innerHTML ="";
    document.getElementById("videosItems").innerHTML ="";

    onload();
};

//configs the upload button
function gotoUpload(){
    location.replace("uploadForm.html?userID="+urlParams.get("userID"));
}

function logout(){
    location.replace("index.html");
}

//onclick for all filter buttons v v v
//filters all videos by folders
function filterFolders(){
    
    resetItems();

    for (let index = 0; index < allvideos.length; index++) {
        if(allvideos[index].folder == 1){
            utill(allvideos, index);
        }
    }
}
function filterAll(){
    
    resetItems();

    for (let index = 0; index < allvideos.length; index++) {
        utill(allvideos, index);
    }
}
function filterSingle(){
    
    resetItems();

    for (let index = 0; index < allvideos.length; index++) {
        if (allvideos[index].folder == 0) {
            utill(allvideos, index);
        }
    }
}
//filters Alphabetically
function filterAbc(){
    
    resetItems();

    const arr = [...allvideos].sort((a, b) => a.Name.localeCompare(b.Name));

    for (let index = 0; index < arr.length; index++) {
        utill(arr, index);
    }
}

function resetItems(){
    document.getElementById("videosItems").innerText = "";
    document.getElementById("videosItems").innerHTML = "";
}

//utillity to save repeat lines
//dont have name
function utill(arr, index){
    console.log(arr[index]);
    const fav = ((favoriteVideos.get(arr[index].id) ? true : false));
    const dir = ((arr[index].folder === 1) ? arr[index].id : arr[index].dir);
    console.log((arr[index].folder === 1));
    makeWidget(arr[index].Name, arr[index].id, dir, arr[index].folder, arr[index].Description, arr[index].icon,"videosItems",fav);

    if(phoneSize.matches){
        checkForBar(3,index);
    }
    else if(fullScreen.matches){
        console.log("MEOW");
        checkForBar(8,index);
    }
    else if(halfScreen.matches){
        checkForBar(5,index);
    }
}