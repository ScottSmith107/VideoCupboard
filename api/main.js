const express = require('express');
const https = require('https');
const fs = require('fs');
const data = require("./videos.js");

const path = require('path');
let websitePath= path.join(__dirname,"website")
let videoPath = path.join(__dirname, "videos")
let userIconPath = path.join(__dirname, "icons")

const multer = require("multer");
const { userInfo } = require('os');

//ssl certs
var key = fs.readFileSync(__dirname + '/../certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/../certs/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

//import diff loctions
const fav = require('./apiMethods/fav');
const recent = require('./apiMethods/recent');
const file = require('./apiMethods/file');
const icon = require('./apiMethods/icon');
const timestamp = require('./apiMethods/timestamp');
const user = require('./apiMethods/user');
const video = require('./apiMethods/video');
const websocket = require('./apiMethods/websocket');

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
                //makes the new folder with the icon
                console.log("new folder-icon");

                //make new path
                newFolder = path.join(__dirname, "videos", folderName);
                if(!fs.existsSync(newFolder)){
                    //make the new dir with fs
                    fs.mkdir(newFolder, { recursive: true }, (err) => {
                        if (err) {
                            return cb(err);
                        }
                        //tells icon where to go
                        iconPath = "videoIcon/"+file.originalname;
                        console.log("iconpath: ",iconPath);
                        // adds new folder to db 
                        data.uploadFile(folderName ,desc ,0 ,folderName,1,iconPath);
                    });
                }

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
        cb(null, file.originalname);
    }
  })
const upload = multer({ storage: storage })

const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://'+process.env.IP);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    next();
  });

app.use('/', fav);
app.use('/', recent);
app.use('/', file);
app.use('/', icon);
app.use('/', timestamp);
app.use('/', user);
app.use('/', video);
app.use('/', websocket);


require('dotenv').config();
app.get('/config.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`window.APP_CONFIG = { IP: "${process.env.IP}" };`);
});
///sends all files listed in the videos dir back to caller as json
app.get('/', async (req, res) => {
    res.sendFile(path.join(websitePath,"index.html"));
});



app.use(express.static(videoPath));
app.use(express.static(userIconPath));
app.use(express.static(websitePath));

var server = https.createServer(options, app);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});