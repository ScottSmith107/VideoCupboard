const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');
let videoPath = path.join("",process.env.STORAGE_DIR);
let iconPath = path.join(process.env.STORAGE_DIR, "videoIcon");

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() })

const app = express.Router();

///sends all files listed in the videos dir back to caller as json
app.get('/allVideos', async (req, res) => {
    output = await data.allVideos("");
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

//gets video info from id
app.get('/path', async (req, res) => {
    videoIndex = req.query.videoIndex;
    console.log("videoIndex: ",videoIndex);
    output = await data.getPath(videoIndex);
    // console.log(output);
    res.send(output);
});

//updates a specific video.
app.put('/updateVideo', upload.array('files'), async (req, res) => {
    files = req.files;
    videoID = req.body.videoID;
    videoName = req.body.videoName
    desc = req.body.desc
    console.log("videoName: ",videoName);
    console.log("videoID: ",videoID);
    console.log("desc: ",desc);
    console.log(files);

    newIconPath = "";
    if(files.length > 0){
        if(files[0].mimetype.split("/")[0] == "image"){
            newIconPath = path.join(iconPath , files[0].originalname);
            await fs.promises.writeFile(newIconPath, files[0].buffer);
            
        }
    }
    
    // if the icon has been added
    if(newIconPath){
        output = await data.updateVideoWicon(videoID,videoName,path.join("videoIcon", files[0].originalname),desc);
    }else{
        output = await data.updateVideoName(videoID,videoName,desc);
    }
    res.send(output);
});

module.exports = app;
