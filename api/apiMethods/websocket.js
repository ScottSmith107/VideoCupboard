const express = require('express');
const fs = require('fs');
const data = require("../videos.js");
const path = require('path');
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

openSockets = new Map();
//meow meow
app.post('/openSocket', upload.none(),async (req, res) => {

    id = req.body.id;
    console.log(openSockets);
    //check if socket is open
    if(openSockets.get(id)){
        currPort = openSockets.get(id)[0];
        res.send(''+currPort+'');
        return;
    }else{
        currPort = getFreePort();
        openSockets.set(id,[currPort,0])
    }
    console.log("currPort: ",currPort);
 
    WebSocket = require('ws');
    wss = new WebSocket.Server({ port: currPort });  
    
    wss.on('connection', function connection(ws) {
        console.log("client connected");
        console.log("openSocket");
        openSockets.set(id,[currPort,openSockets.get(id)[1]+1])
        console.log(openSockets);
        console.log("mapOport");
        console.log(mapOPorts);
        console.log("");
        ws.id = id;

        ws.on('message', function incoming(message) {
            console.log("message");
            console.log(message.toString('utf8'));
            console.log(openSockets);
            console.log("");
            
            // ws.send(message.toString('utf8'));
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString('utf8'));
                }
            });
        });

        ws.on('close', function() {
            console.log("client disconected");
            _id = ws.id;

            openSockets.set(_id,[openSockets.get(_id)[0],openSockets.get(_id)[1]-1]);
            
            console.log("id: ",_id);
            console.log(openSockets);
            console.log("");
            
            //check if socket empty
            if(openSockets.get(_id)[1] == 0){
                console.log("id:"+_id+" socket: "+openSockets.get(_id));
                console.log("Closing socket");

                wss.clients.forEach(client => {
                    client.terminate(); // Forcefully close all WebSocket connections
                });

                wss.close(() => {
                    console.log("WebSocket server closed on port:", openSockets.get(_id)[0]);

                    console.log("openSockets");
                    console.log(openSockets);
                    console.log("");

                    openPort(openSockets.get(_id)[0]);
                    openSockets.delete(_id);

                    console.log("map0ports");
                    console.log(mapOPorts);
                    console.log("");
                });
            }
        });

    });

    res.send(''+currPort+'');
});

//map of free ports
let mapOPorts = new Map([
    [8081 ,false],
    [8082 ,false],
    [8083 ,false],
    [8084 ,false],
    [8085 ,false]
]);
// finds the lowest near port
//grabs the first free port
function getFreePort(){
    for (let [key, value] of mapOPorts) {
        if(value == false){
            mapOPorts.set(key,true);
            console.log("finding new open port");
            return key;
        }
    }
}
//opens up passed in port number in map
function openPort(portNum){
    mapOPorts.set(portNum,false);
    console.log("mapOPorts:");
    console.log(mapOPorts);
}

module.exports = app;