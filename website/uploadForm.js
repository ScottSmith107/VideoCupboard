let url = "http://192.168.1.124:3000/";

let files;

document.getElementById('fileInput').addEventListener('change', (event) => {
    files = event.target.files;
});

// sents passsed in file to server
function addFile(){
    if(!files){
        document.getElementById("error").innerText ="Please add File";
        return;
    }
    description = document.getElementById("Description").value;
    console.log(files);
    console.log(description);

    formData = new FormData();
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
    document.getElementById("error").innerText = response;
}