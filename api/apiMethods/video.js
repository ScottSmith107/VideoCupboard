const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');
let videoPath = path.join("",process.env.STORAGE_DIR);
let iconPath = path.join(process.env.STORAGE_DIR, "videoIcon");

const multer = require("multer");
const console = require('console');
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

//Gets videos based off search query
app.get('/search', async (req, res) => {
    query = req.query.query;
    console.log("query: ",query);
    output = await data.search(query);
    console.log(output);
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

//updates the postion properties 
app.post('/updatePositions',upload.none(), async (req, res) => {
    // const map = req.body.map;
    const ids = req.body.ids.split(',');
    const positions = req.body.positions.split(',');

    for (let index = 0; index < ids.length; index++) {
        //update pos for each video
        var id = ids[index];
        var pos = positions[index];
        var output = await data.updatePosition(id,pos);      
    }
    
    res.send("meow");
});

//gets all folders
app.get('/Allfolders', async (req, res) => {
    output = await data.Allfolders();
    res.send(output);
}); 

//moves all contents from old DIR to new DIR
app.post('/moveFolders',upload.none(), async (req, res) => {
    const newDir = req.body.newDir;
    const oldDir = req.body.oldDir;
    // const oldName = req.body.oldName;
    // const newName = req.body.newName;

    // get next postion index
    let pos = await data.getLargestPos(newDir)
    pos = pos[0]['MAX(position)'];
    console.log(pos);

    let oldName = await data.getVideo(oldDir);
    oldName = oldName[0].Full_path;
    let newName = await data.getVideo(newDir);
    newName = newName[0].Full_path;
    
    const oldFilePath = path.join(process.env.STORAGE_DIR, oldName);
    const newFilePath = path.join(process.env.STORAGE_DIR, newName);

    console.log("Moving ",oldDir, " to ", newDir);
    //loops all files in the old location and moves them to the new localtion
    var files = await fs.promises.readdir(oldFilePath);
    console.log(files);
    for(i = 0; i < files.length; i++){
        await fs.promises.rename(path.join(oldFilePath,files[i]), path.join(newFilePath,files[i]))
        //update full path
        await data.updatePath(path.join(newName,files[i]),files[i]);
    }

    await fs.rmdir(path.join(oldFilePath),{force: true, recursive: true} , (err) => {
            if (err) console.log(err);
            else console.log(oldFilePath, ' was deleted');
    });
    await data.remove(oldDir);

    var output = await data.moveFolders(oldDir,newDir,pos);      
    
    res.send(output);
});

module.exports = app;
