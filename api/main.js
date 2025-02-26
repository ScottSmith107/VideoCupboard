const express = require('express');
const fs = require('fs');
const data = require("./videos.js");

const path = require('path');
let videoPath = path.join(__dirname, "videos")

const multer = require("multer");
const { userInfo } = require('os');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        //get foldername
        folderName = req.body.folderName;
        desc = req.body.description;
        if(folderName){
            console.log("folder vaild");
            //make new path
            newFolder = path.join(__dirname, "videos", folderName);

            if(!fs.existsSync(newFolder)){
                console.log("new folder");
                //make the new dir with fs
                fs.mkdir(newFolder, { recursive: true }, (err) => {
                    if (err) {
                      return cb(err);
                    }
                    // adds new folder to db 
                    data.uploadFile(folderName ,desc ,0 ,folderName,1);
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

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://192.168.1.124');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
  });

///sends all files listed in the videos dir back to caller as json
app.get('/allVideos', async (req, res) => {
    output = await data.allVideos("");
    res.send(output);
});

///sends all files listed in the videos dir back to caller as json
app.get('/allUsers', async (req, res) => {
    output = await data.allUsers("");
    res.send(output);
});

//if the user opens a folder
app.get('/folder', async (req, res) => {
    folderIndex = req.query.folderIndex;
    console.log("folderIndex: ",folderIndex);
    output = await data.getDir(folderIndex);
    // console.log(output);
    res.send(output);
}); 

//if the user opens a folder
app.get('/path', async (req, res) => {
    videoIndex = req.query.videoIndex;
    console.log("videoIndex: ",videoIndex);
    output = await data.getPath(videoIndex);
    // console.log(output);
    res.send(output);
});

// gets timestamp from userid and videoid
app.put('/getTimestamp',upload.none(), async (req, res) => {
    userID = req.body.userID;
    videoID = req.body.videoID;
    console.log("userID: ",userID);
    console.log("videoID: ",videoID);

    output = await data.getTimestamp(userID,videoID);
    console.log(output);
    res.send(output);
}); 

//adding new user to the db
app.post('/addUser',upload.none(), async (req, res) => {
    let name = req.body.username
    output = await data.addUser(name);
    res.send(output);
});

//for uploading files not in a folder
app.post('/upload', upload.array('files'),async (req, res) => {
    files = req.files;
    description = req.body.description;

    //adds each file by itself
    for (let i = 0; i < files.length; i++) {
        file = files[i];
        console.log("file:", file);
        console.log("originalname: ", file.originalname);
        //add file to db
        data.uploadFile(file.originalname ,description ,0 , file.originalname,0);
    }

    res.send("good :>");
}); 

//for uploading files in a folder
app.post('/upload-folder', upload.array('files'),async (req, res) => {
    files = req.files;
    folderName = req.body.folderName;
    description = req.body.description;

    //folder name for dir
    folderName = req.body.folderName;
    dir =  await data.getDirFromName(folderName);

    console.log(folderName);
    console.log(dir);

    //adds each file by itself
    for (let i = 0; i < files.length; i++) {
        file = files[i];
        //add file to db
        data.uploadFile(file.originalname ,description ,dir[0].id , path.join(folderName , file.originalname),0);
    }

    res.send("good :>");
});

//delete singular file to db
app.delete('/remove', async (req, res) => {
    id = req.query.id;
    console.log("video id to be removed: ",id);
    //finds dir
    fullPath = await data.getPath(id);
    fullPath = fullPath[0].full_path;

    //removes folder from file system
    fs.unlink(path.join("videos",fullPath), (err) => {
        if (err) throw err;
        console.log(fullPath, 'was deleted');
      });
    //removes file from db
    output = await data.remove(id);
    res.send(output);
}); 

//delete whole dir file to db
app.delete('/removeDir', async (req, res) => {
    id = req.query.id;
    console.log("path id to be removed: ",id);
    //finds dir
    fullPath = await data.getPath(id);
    fullPath = fullPath[0].full_path;
    //removes folder from file system
    fs.rm(path.join("videos",fullPath),{force: true, recursive: true} , (err) => {
        if (err) throw err;
        console.log(fullPath, ' was deleted');
      });

    output = await data.removeDir(id);
    output = await data.remove(id);
    res.send(output);
}); 

//if the user opens a folder
app.put('/updateTimestamp',upload.none(), async (req, res) => {
    userID = req.body.userID;
    videoID = req.body.videoID;
    timestamp = req.body.timestamp;
    console.log("userID: ",userID);
    console.log("videoID: ",videoID);
    console.log("timestamp: ",timestamp);

    check = await data.getTimestamp(userID,videoID);
    console.log("check: ",check);

    if(check.length == 0){
        console.log("Set");
        output = await data.setTimestamp(userID,videoID,timestamp);
    }else{
        console.log("update");
        output = await data.updateTimestamp(userID,videoID,timestamp);
    }

    // console.log(output);
    res.send(output);
});

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});

app.use(express.static(videoPath));
    
