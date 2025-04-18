let url = "http://"+IP+":3000/";
let files;
let icon;

document.getElementById('fileInput').addEventListener('change', (event) => {
    files = event.target.files;

    //check if the files are vaild
    for (let i = 0; i < files.length; i++) {
        file = files[i];
        //pulles the extention from the name
        extention = file.name.split('.')[file.name.split('.').length-1];
        if(!(extention == "MP4" || extention == "mp4" || extention == "MP3" || extention == "mp3")){
            files = event.target.files = undefined;
            document.getElementById("error").innerText = "please only submit mp3/mp4's"
        }else{
            document.getElementById("error").innerText = ""
        }
    }
});
document.getElementById('iconInput').addEventListener('change', (event) => {
    icon = event.target.files[0];
});

// sents passsed in file to server
function addFile(){
    if(!files){
        document.getElementById("error").innerText ="Please add File";
        return;
    }

    document.getElementById("error").innerText = "Loading . . ."
    
    description = document.getElementById("Description").value;

    formData = new FormData();
    //adds icon if user wants one
    if(icon){
        //"adds" the icon to the end of the video files the user supplies 
        let dataTransfer = new DataTransfer();
        dataTransfer.items.add(icon);
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i]);
        }

        files = dataTransfer.files;
    }

    formData.append("description",description);

    //if folder
    if (document.getElementById("folderName").value){
        formData.append("folderName",document.getElementById("folderName").value);
        console.log("is folder");
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        fetch(url+"upload-folder", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(display)
        .catch(error => {
            console.error("couldnt upload folder", error);
        });
    } else{//not a folder

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        fetch(url+"upload", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(display)
        .catch(error => {
            console.error("couldnt uploads file/s", error);
        });
    }
    
}

//gets ready for another upload
function display(response){
    console.log("done")
    document.getElementById("error").innerText = "Upload Completed";
    files =[];
    icon = [];
}

function onload(){
    const urlParams = new URLSearchParams(window.location.search); 
    userID = urlParams.get("userID");
}