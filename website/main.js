let url = "http://localhost:3000/";
//get all videos from the server
let getVideos = () => {

    fetch(url+"all")
        .then(response => response.json())
        .then(display)
        .catch(error => {
            console.error("couldnt make connection to database", error);
        });
}

//places all the videos into the div
function display(response){
    console.log(response.files);

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
    
    content.href = "video.html?data="+name;    
    content.innerText = name;

    div.appendChild(content)

    //append all to the main div
    main.appendChild(div);

}