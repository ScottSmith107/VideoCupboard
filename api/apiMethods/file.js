const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');
let videoPath = path.join(__dirname, '..' ,"videos")
let userIconPath = path.join(__dirname, '..' ,"videos/icons")

const multer = require("multer");
const { userInfo } = require('os');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        console.log("file-file.js");
        console.log(file);
        console.log("");

        //if the user uploads a new 
        icon = req.body.icon;
        if(icon){
            return cb(null, userIconPath);
        }
        
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
                newFolder = path.join(__dirname, ".." ,"videos", folderName);
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
            newFolder = path.join(__dirname, ".." , "videos", folderName);
    
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

//for uploading files not in a folder
app.post('/upload-icon', upload.array('files'),async (req, res) => {
    files = req.files;
    
    let name = files[0].originalname;
    console.log("uploading new icon: " + name);

    output = data.uploadIcon(name,"icons/"+name);
    res.send(output);
}); 

//for uploading files not in a folder
app.post('/upload', upload.array('files'),async (req, res) => {
    files = req.files;
    description = req.body.description;
    
    console.log("");
    console.log(files);
    console.log("");
    
    iconPath = "";
    let i = 0;
    //find icon\\ as if ther eis a icon it wil be placed first
    if(files[0].mimetype.split("/")[0] == "image"){
        iconPath = "videoIcon/"+files[0].originalname;
        i = 1;
    }

    //adds each file by itself
    for (; i < files.length; i++) {
        file = files[i];
        console.log("file:", file);
        console.log("originalname: ", file.originalname);
        console.log("iconPath: ", iconPath);
        //add file to db
        output = data.uploadFile(file.originalname ,description ,0 , file.originalname,0,iconPath);
    }

    res.send(output);
}); 

//for uploading files in a folder
app.post('/upload-folder', upload.array('files'),async (req, res) => {
    files = req.files;
    folderName = req.body.folderName;
    videoID = req.body.videoID;
    description = req.body.description;
    
    console.log(videoID);
    console.log("");
    console.log(files);
    console.log("");
    
    iconPath = "";
    let i = 0;
    //find icon\\ as if ther eis a icon it wil be placed first
    if(files[0].mimetype.split("/")[0] == "image"){
        iconPath = "videoIcon/"+files[0].originalname;
        i = 1;
    }else{
        tmp = await data.getPath(videoID);
        iconPath = tmp[0].icon

    }


    //folder name for dir
    folderName = req.body.folderName;
    dir =  await data.getIdFromName(folderName);

    //adds each file by itself
    for (; i < files.length; i++) {
        file = files[i];
        //add file to db
        output = data.uploadFile(file.originalname ,description ,dir[0].id , path.join(folderName , file.originalname),0,iconPath);
    }

    res.send(output);
});

//delete singular file to db
app.delete('/remove', async (req, res) => {
    id = req.query.id;
    console.log("video id to be removed: ",id);
    //finds dir
    response = "";
    response = await data.getPath(id);
    fullPath = response[0].Full_path;

    //removes folder from file system
    fs.unlink(path.join("videos",fullPath), (err) => {
        if (err) throw err;
        console.log(fullPath, 'was deleted');
      });
    // removes file from db
    output = await data.remove(id);
    res.send(output);
}); 

//delete whole dir file to db
app.delete('/removeDir', async (req, res) => {
    id = req.query.id;
    console.log("path id to be removed: ",id);
    //finds dir
    response = "";
    response = await data.getPath(id);
    fullPath = response[0].Full_path;
    //removes folder from file system
    fs.rm(path.join("videos",fullPath),{force: true, recursive: true} , (err) => {
        if (err) throw err;
        console.log(fullPath, ' was deleted');
      });

    output = await data.removeDir(id);
    output = await data.remove(id);
    res.send(output);
}); 

module.exports = app;