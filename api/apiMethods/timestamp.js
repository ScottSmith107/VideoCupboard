const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');
let videoPath = path.join("",process.env.STORAGE_DIR);

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

// gets timestamp from userid and videoid
app.put('/getTimestamp',upload.none(), async (req, res) => {
    console.log("getTimestamp");
    userID = req.body.userID;
    videoID = req.body.videoID;
    console.log("userID: ",userID);
    console.log("videoID: ",videoID);
    
    output = await data.getTimestamp(userID,videoID);
    console.log(output);
    console.log("");
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
        console.log("");

        output = await data.setTimestamp(userID,videoID,timestamp);
    }else{
        console.log("update");
        console.log("");

        output = await data.updateTimestamp(userID,videoID,timestamp);
    }

    // console.log(output);
    res.send(output);
});

module.exports = app;