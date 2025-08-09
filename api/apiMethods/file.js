const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');
let videoPath = path.join("",process.env.STORAGE_DIR);
let iconPath = path.join(process.env.STORAGE_DIR, "videoIcon");
let userUconPath = path.join(process.env.STORAGE_DIR, "icons");

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

let fileChunks = new Map();
//usage 
// fileId, [array of chunks] 

//for uploading files not in a folder
app.post('/upload', upload.single('chunk'),async (req, res) => {
    const fileId = req.body.fileId;
    const fileNum = req.body.fileNum;
    const chunkIndex = req.body.chunkIndex;
    const totalChunks = req.body.totalChunks;
    const chunk = req.file.buffer;
    const icon = req.body.icon;
    const description = req.body.description;

    console.log("fileId:" ,fileId);
    console.log("chunkIndex:" ,chunkIndex, "/", totalChunks);
    console.log("icon:" ,icon);
    console.log("fileNum:" ,fileNum);

    let newIconPath = "";
    if(icon != 0){
        newIconPath = path.join("videoIcon", icon);
        //if the icon needs to be added
        if(fileNum == 0 ){
            newIconPath = path.join("videoIcon", req.file.originalname);
            console.log("iconpath: ",newIconPath);
            await fs.promises.writeFile(path.join(iconPath, req.file.originalname), chunk);
            res.sendStatus(200);
            return;
        }   
    }

    if(!fileChunks.get(fileId)){
        fileChunks.set(fileId,[]);
    }

    //add chunk to the map
    arry = fileChunks.get(fileId);
    arry.push(chunk);

    //if end of file then download
    if(chunkIndex == totalChunks){
        console.log("end found");

        //add all the arrys together
        wholeFile = Buffer.concat(fileChunks.get(fileId))

        //add file to db
        output = data.uploadFile(req.file.originalname ,description ,0 , req.file.originalname,0,newIconPath);
        //write file
        videoLoc = path.join(videoPath, req.file.originalname);
        await fs.promises.writeFile(videoLoc, wholeFile);

        //wipe map
        fileChunks.set(fileId,[])
    }

    res.sendStatus(200);
}); 

//for uploading files in a folder
app.post('/upload-folder', upload.single('chunk'),async (req, res) => {
    const folderName = req.body.folderName;
    const fileId = req.body.fileId;
    const fileNum = req.body.fileNum;
    const chunkIndex = req.body.chunkIndex;
    const totalChunks = req.body.totalChunks;
    const chunk = req.file.buffer;
    const icon = req.body.icon;
    const description = req.body.description;

    console.log("fileId:" ,fileId);
    console.log("chunkIndex:" ,chunkIndex, "/", totalChunks);
    console.log("icon:" ,icon);
    console.log("fileNum:" ,fileNum);
    console.log("folderName:" ,folderName);
    
    let newIconPath = "";
    if(icon != 0){
        newIconPath = path.join("videoIcon", icon);
        //if the icon needs to be added
        if(fileNum == 0 ){
            newIconPath = path.join("videoIcon", req.file.originalname);
            console.log("iconpath: ",newIconPath);
            await fs.promises.writeFile(path.join(iconPath, req.file.originalname), chunk);
            
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
            
            res.sendStatus(200);
            return;
        }   
    }else if(fileNum == 0){//create folder
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
    }
    
    const folderId = await data.getIdFromName(folderName)
    console.log("folderId:" ,folderId[0].id);
    
    if(!fileChunks.get(fileId)){
        fileChunks.set(fileId,[]);
    }

    //add chunk to the map
    let arry = fileChunks.get(fileId);
    arry.push(chunk);

    //if end of file then download
    if(chunkIndex == totalChunks){
        console.log("end found");

        //add all the arrys together
        const wholeFile = Buffer.concat(fileChunks.get(fileId))

        //add file to db
        let output = data.uploadFile(req.file.originalname ,description ,folderId[0].id , path.join(folderName, req.file.originalname),0,newIconPath);
        //write file
        const videoLoc = path.join(videoPath, folderName, req.file.originalname);
        await fs.promises.writeFile(videoLoc, wholeFile);

        //wipe map
        fileChunks.set(fileId,[]);
        fileChunks.delete(fileId);
    }

    res.sendStatus(200);
});

//delete singular file to db
app.delete('/remove', async (req, res) => {
    id = req.query.id;
    console.log("video id to be removed: ",id);
    //finds dir
    response = "";
    response = await data.getPath(id);
    fullPath = response[0].Full_path;
    console.log("FULL PATH: ",fullPath);

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
