const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');
let videoPath = path.join("","/mnt/mydrive/videos");
let iconPath = path.join("", "/mnt/mydrive/videos/videoIcon");
let userUconPath = path.join("", "/mnt/mydrive/videos/icons");

const app = express.Router();

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() })

//for uploading just a user icon
app.post('/upload-icon', upload.array('files'),async (req, res) => {
    var files = req.files;
    
    let name = files[0].originalname;
    console.log("uploading new icon: " + name);

    output = await data.uploadIcon(name,"icons/"+name);
    await fs.promises.writeFile(path.join(userUconPath,files[0].originalname ), files[0].buffer);
    res.send(output);
}); 

//for uploading files not in a folder
app.post('/upload', upload.array('files'),async (req, res) => {
    var files = req.files;
    description = req.body.description;
    
    console.log("");
    console.log(files);
    console.log("");
    
    let newIconPath = "";

    let i = 0;
    //find icon\\ as if ther eis a icon it wil be placed first
    if(files[0].mimetype.split("/")[0] == "image"){
        i = 1;

        newIconPath = path.join("videoIcon", files[0].originalname);
        console.log("iconpath: ",newIconPath);
        //writing icon
        await fs.promises.writeFile(path.join(iconPath, files[0].originalname), files[0].buffer);
        //deref buffer 
        // req.files[0].buffer = null;
    }

    //adds each file by itself
    for (; i < files.length; i++) {
        var file = files[i];
        console.log("file:", file);
        console.log("originalname: ", file.originalname);
        console.log("iconPath: ", newIconPath);
        //add file to db
        output = data.uploadFile(file.originalname ,description ,0 , file.originalname,0,newIconPath);
        //write file
        videoLoc = path.join(videoPath, file.originalname);
        await fs.promises.writeFile(videoLoc, files[i].buffer);
        //deref buffer 
        // req.files[i].buffer = null;
    }

    res.send(output);
}); 

//for uploading files in a folder
app.post('/upload-folder', upload.array('files'),async (req, res) => {
    files = req.files;
    folderName = req.body.folderName;
    videoID = req.body.videoID;
    description = req.body.description;
    
    console.log(folderName);
    console.log("");
    console.log(files);
    console.log("");

    
    let newIconPath = "";
    let i = 0;
    //find icon\\ as if ther eis a icon it wil be placed first
    if(files[0].mimetype.split("/")[0] == "image"){
        i = 1;
        
        newIconPath = path.join("videoIcon", files[0].originalname);
        console.log("iconpath: ",newIconPath);
        //writing icon
        await fs.promises.writeFile(path.join(iconPath, files[0].originalname), files[0].buffer);
        //deref buffer 
        req.files[0].buffer = null;
    }

    //make new path
    newFolder = path.join(videoPath, folderName);
    if(!fs.existsSync(newFolder)){
        //make the new dir with fs
        await fs.mkdir(newFolder, { recursive: true }, (err) => {
            if (err){
                console.error("failed to make new folder", err);
            }
        });
        // adds new folder to db 
        await data.uploadFile(folderName ,description ,0 ,folderName,1,newIconPath);
    }
    
    //folder name for dir
    folderName = req.body.folderName;
    dir =  await data.getIdFromName(folderName);
    console.log("dir");
    console.log(dir);
    //adds each file by itself
    for (; i < files.length; i++) {
        file = files[i];
        //add file to db
        output = data.uploadFile(file.originalname ,description ,dir[0].id , path.join(folderName , file.originalname),0,newIconPath);
        //write file
        videoLoc = path.join(videoPath, folderName, file.originalname);
        await fs.promises.writeFile(videoLoc, files[i].buffer);
        //deref buffer 
        req.files[i].buffer = null;
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
    fs.unlink(path.join(videoPath,fullPath), (err) => {
        if (err) console.log(err);
        else console.log(fullPath, 'was deleted');
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
    fs.rmdir(path.join(videoPath,fullPath),{force: true, recursive: true} , (err) => {
        if (err) console.log(err);
        else console.log(fullPath, ' was deleted');
      });

    output = await data.removeDir(id);
    output = await data.remove(id);
    res.send(output);
}); 

module.exports = app;
