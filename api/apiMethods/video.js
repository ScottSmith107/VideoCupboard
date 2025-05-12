const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');
let videoPath = path.join(__dirname, '..' ,"videos")
let userIconPath = path.join(__dirname, '..' ,"icons")

const multer = require("multer");
const { userInfo } = require('os');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        console.log("file");
        console.log(file);
        console.log("");
        
        //get foldername
        folderName = req.body.folderName;
        desc = req.body.description;

        iconPath ="";
        //if its an image then upload diffrent
        if(file.mimetype.split("/")[0] == "image"){
            
            if(folderName){
                //makes the new folde with the icon
                console.log("new folder-icon");

                //make new path
                newFolder = path.join(__dirname, "videos", folderName);
                //make the new dir with fs
                fs.mkdir(newFolder, { recursive: true }, (err) => {
                    if (err) {
                        return cb(err);
                    }
                    // adds new folder to db 
                    iconPath = "videoIcon/"+file.originalname;
                    console.log("iconpath: ",iconPath);
                    data.uploadFile(folderName ,desc ,0 ,folderName,1,iconPath);
                });
            }
                    
            return cb(null, path.join(videoPath,"videoIcon"));
        }

        if(folderName){
            console.log("folder vaild");
            //make new path
            newFolder = path.join(__dirname, "videos", folderName);
    
            //if there is a folder without an icon
            if(!fs.existsSync(newFolder)){
                console.log("new folder");
                //make the new dir with fs
                fs.mkdir(newFolder, { recursive: true }, (err) => {
                    if (err) {
                      return cb(err);
                    }
                    // adds new folder to db 
                    console.log("iconpath: ",iconPath);
                    data.uploadFile(folderName ,desc ,0 ,folderName,1,iconPath);
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
        // console.log("originalname: ",file.originalname);
        cb(null, file.originalname);
    }
  })
const upload = multer({ storage: storage })

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

    iconPath = "";
    if(files.length > 0){
        if(files[0].mimetype.split("/")[0] == "image"){
            iconPath = "videoIcon/"+files[0].originalname;
        }
    }
    
    // if the icon has been added
    if(iconPath){
        output = await data.updateVideoWicon(videoID,videoName,iconPath,desc);
    }else{
        output = await data.updateVideoName(videoID,videoName,desc);
    }
    res.send(output);
});

module.exports = app;