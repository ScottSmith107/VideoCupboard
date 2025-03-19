<<<<<<< HEAD
let url = "http://192.168.1.124:3000/";

let files;
let icon;

document.getElementById('fileInput').addEventListener('change', (event) => {
    files = event.target.files;
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
    //adds icon if here
    if(icon){
        let dataTransfer = new DataTransfer();

        dataTransfer.items.add(icon);
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i]);
        }

        files = dataTransfer.files;
    }
    formData.append("description",description);

    if (document.getElementById("folderName").value){//if it is a folder
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
            console.error("couldnt make connection to database", error);
        });
    } else{//if it is not a folder

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
            console.error("couldnt make connection to database", error);
        });
    }
    
}

function display(response){
    console.log("done")
    document.getElementById("error").innerText = "Upload Completed";
    files =[];
    icon = [];
}

function onload(){
    const urlParams = new URLSearchParams(window.location.search); 
    userID = urlParams.get("userID");
=======
let url = "http://192.168.1.124:3000/";

let files;
let icon;

document.getElementById('fileInput').addEventListener('change', (event) => {
    files = event.target.files;
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
    //adds icon if here
    if(icon){
        let dataTransfer = new DataTransfer();

        dataTransfer.items.add(icon);
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i]);
        }

        files = dataTransfer.files;
    }
    formData.append("description",description);

    if (document.getElementById("folderName").value){//if it is a folder
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
            console.error("couldnt make connection to database", error);
        });
    } else{//if it is not a folder

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
            console.error("couldnt make connection to database", error);
        });
    }
    
}

function display(response){
    console.log("done")
    document.getElementById("error").innerText = "Upload Completed";
    files =[];
    icon = [];
}

function onload(){
    const urlParams = new URLSearchParams(window.location.search); 
    userID = urlParams.get("userID");
>>>>>>> 5f108183f1a777aeb5d002bc2a116c1972b6971e
}