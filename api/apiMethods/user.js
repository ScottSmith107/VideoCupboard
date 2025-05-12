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
app.get('/allUsers', async (req, res) => {
    output = await data.allUsers("");
    res.send(output);
});

// gets user info from userID
app.put('/getUser',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("userID: ",userID);
    
    output = await data.getUser(userID);
    res.send(output);
});

//updates the users icon
app.put('/updateUser',upload.none(), async (req, res) => {
    userID = req.body.userID;
    let name = req.body.username
    iconID = req.body.iconID
    console.log("name: ",name);
    console.log("iconID: ",iconID);
    console.log("userID: ",userID);
    
    //if the icon has been added
    if(iconID){
        output = await data.updateUser(name,iconID,userID);
    }else{
        output = await data.updateUsername(name,userID);
    }
    res.send(output);
});

//adding new user to the db
app.post('/addUser',upload.none(), async (req, res) => {
    let name = req.body.username
    let iconID = req.body.iconID
    output = await data.addUser(name,iconID);
    res.send(output);
});

//delete whole dir file to db
app.delete('/deleteUser',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("userID: ",userID);

    await data.deleteUser(userID);
    output = await data.deleteUserWatching(userID);
    res.send(output);
}); 

module.exports = app;