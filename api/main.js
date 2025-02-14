const express = require('express');
const fs = require('fs');
const data = require("./videos.js");

const path = require('path');
let videoPath = path.join(__dirname, "videos")

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        //get foldername
        folderName = req.body.folderName;
        desc = req.body.description;
        if(folderName){
            console.log("folder vaild");
            //make new path
            newFolder = path.join(__dirname, "videos", folderName);

            console.log(!fs.existsSync(newFolder));
            if(!fs.existsSync(newFolder)){
                console.log("new folder");
                //make the new dir with fs
                fs.mkdir(newFolder, { recursive: true }, (err) => {
                    if (err) {
                      return cb(err);
                    }
                    // adds new folder to db 
                    data.uploadFile(folderName ,desc ,"" ,folderName);
                    cb(null, newFolder);
                });
            }else{
                cb(null, newFolder);
            }

        }else{
            console.log("folder unvaild");
            cb(null, videoPath);
        }

    },
    filename: function (req, file, cb) {
        console.log("originalname: ",file.originalname);
        cb(null, file.originalname);
    }
  })
const upload = multer({ storage: storage })

const app = express();
const port = 3000;


app.get('/', async (req, res) => {
    console.log("item",req);
    output = await data.getDir("");
    console.log(output);
    res.send(output);
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://192.168.1.115');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

///sends all files listed in the videos dir back to caller as json
app.get('/all', async (req, res) => {
    output = await data.getDir("");
    res.send(output);
}); 

//if the user opens a folder
app.get('/folder', async (req, res) => {
    fileName = req.query.folder;
    console.log("file: ",fileName);
    output = await data.getDir(fileName);
    // console.log(output);
    res.send(output);
}); 

//for uploading files not in a folder
app.post('/upload', upload.array('files'),async (req, res) => {
    files = req.files;
    description = req.body.description;
    console.log("files: ", files);
    console.log("description: ",description);
    
    //adds each file by itself
    for (let i = 0; i < files.length; i++) {
        file = files[i];
        console.log("file:", file);
        console.log("originalname: ", file.originalname);
        //add file to db
        data.uploadFile(file.originalname ,description ,"" , file.originalname);
    }

    res.send("good :>");
}); 

//for uploading files in a folder
app.post('/upload-folder', upload.array('files'),async (req, res) => {
    files = req.files;
    folderName = req.body.folderName;
    description = req.body.description;
    // console.log("files: ", files);
    // console.log("folderName: ", folderName);
    // console.log("req: ",req);

    //adds each file by itself
    for (let i = 0; i < files.length; i++) {
        file = files[i];
        // console.log("file:", file);
        //add file to db
        data.uploadFile(file.originalname ,description ,folderName , path.join(folderName , file.originalname));
    }

    res.send("good :>");
}); 

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});

app.use(express.static(videoPath));
    
