const express = require('express');
const fs = require('fs');
const data = require("./videos.js");

const path = require('path');
let videoPath = path.join(__dirname, "videos")
let userIconPath = path.join(__dirname, "icons")

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

///sends all files listed in the videos dir back to caller as json
app.get('/allIcons', async (req, res) => {
    output = await data.allIcons("");
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

// gets user info from userID
app.put('/getUser',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("userID: ",userID);
    
    output = await data.getUser(userID);
    res.send(output);
});

// gets Recents from userid
app.put('/getRecent',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("userID: ",userID);
    
    output = await data.getRecent(userID);
    res.send(output);
});

// gets Favorites from userid
app.put('/getFavorites',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("getFav");
    console.log("userID: ",userID);
    
    output = await data.getFavorites(userID);
    res.send(output);
});

// gets Favorites from userid
app.put('/setFavorites',upload.none(), async (req, res) => {
    userID = req.body.userID;
    videoID = req.body.videoID;
    console.log("addFav");
    console.log("userID: ",userID);
    console.log("videoID: ",videoID);
    
    output = await data.setFavorites(userID,videoID);
    res.send(output);
});

// gets Favorites from userid
app.delete('/removeFavorites',upload.none(), async (req, res) => {
    userID = req.body.userID;
    videoID = req.body.videoID;
    console.log("removeFav");
    console.log("userID: ",userID);
    console.log("videoID: ",videoID);
    
    output = await data.removeFavorites(userID,videoID);
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

//retreves all icons
app.put('/getIcon',upload.none(), async (req, res) => {
    iconID = req.body.iconID;
    console.log("iconID: ",iconID);
    
    output = await data.getIcon(iconID);
    res.send(output);
});

//adding new user to the db
app.post('/addUser',upload.none(), async (req, res) => {
    let name = req.body.username
    let iconID = req.body.iconID
    output = await data.addUser(name,iconID);
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

//delete whole dir file to db
app.delete('/deleteUser',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("userID: ",userID);

    await data.deleteUser(userID);
    output = await data.deleteUserWatching(userID);
    res.send(output);
}); 

//removeAllRecents for a user
app.delete('/removeAllRecents',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("removeAllRecents");
    console.log("userID: ",userID);

    output = await data.removeAllRecents(userID);
    res.send(output);
}); 

//removeAllFavorites for a user
app.delete('/removeAllFavorites',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("removeAllFav");
    console.log("userID: ",userID);

    output = await data.removeAllFavorites(userID);
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

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});

app.use(express.static(videoPath));
app.use(express.static(userIconPath));
    
