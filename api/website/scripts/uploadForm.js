let url = IP;
let files;
let icon;

document.getElementById('fileInput').addEventListener('change', (event) => {
    files = event.target.files;

    //check if the files are vaild                                                                  //redo
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const name = file.name;
        if(name.length > 127){
            alert("All file titles need to be shorter then 128 character.")
            files = event.target.files = [];
            break;
        }else{
            //pulles the extention from the name
            extention = file.name.split('.')[file.name.split('.').length-1];
            if(!(extention == "MP4" || extention == "mp4" || extention == "MP3" || extention == "mp3")){
                if(confirm("If you dont submit a MP3 or MP4 you may encounter issues.")){//so they know they might have issues
                    console.log("good");
                }else{
                    files = event.target.files = [];
                }
                break;
            }else{
                document.getElementById("error").innerText = ""
            }
        }

    }
});
document.getElementById('iconInput').addEventListener('change', (event) => {
    icon = event.target.files[0];
});

// sents passsed in file to server
async function addFile(){
    if(!files){
        document.getElementById("error").innerText ="Please add File";
        return;
    }

    document.getElementById("error").innerText = "Loading . . ."
    
    const description = document.getElementById("Description").value;

    //adds icon if user wants one
    if(icon){
        //"adds" the icon to the end of the video files the user supplies 
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(icon);
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i]);
        }

        files = dataTransfer.files;
    }

    //if folder
    if (document.getElementById("folderName").value){
        
        console.log("is folder");
        let i = 0
        if (icon) i = 1;
        for (; i < files.length; i++) {
            const formData = new FormData();
            formData.append("folderName",document.getElementById("folderName").value);
            formData.append("description",description);
            //0 will always be the icon//icons wont be doubled up
            if(icon) formData.append('files', files[0]);
            formData.append('files', files[i]);
            
            try{
                let result = await fetch(url+"upload-folder", {
                    method: "POST",
                    body: formData,
                });

            }catch (error){
                console.error(error);
            }

        }
        display();

    } else{//not a folder

        let i = 0
        if (icon) i = 1;
        for (; i < files.length; i++) {
            const formData = new FormData();
            formData.append("description",description);

            //0 will always be the icon//icons wont be doubled up
            if(icon) formData.append('files', files[0]);
            formData.append('files', files[i]);

            try{
                let result = await fetch(url+"upload", {
                    method: "POST",
                    body: formData,
                });

            }catch(error){
                console.error(error);
            }
        }
        display();
    }
    
}

//gets ready for another upload
function display(response){
    console.log("done")
    document.getElementById("error").innerText = "Upload Completed";
    files =[];
    icon = [];
}

let userID;
function onload(){
    const urlParams = new URLSearchParams(window.location.search);
    userID = urlParams.get("userID");
}