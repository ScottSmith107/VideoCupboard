const express = require('express');
const fs = require('fs');
const data = require("../videos.js");
const path = require('path');
const multer = require("multer");
const { userInfo } = require('os');
const { disconnect } = require('process');

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

WebSocket = require('ws');

openSockets = new Map();
app.post('/openSocket', upload.none(),async (req, res) => {
    const id = req.body.id;
    console.log(openSockets);

    if(openSockets.has(id)) {
        const [currPort] = openSockets.get(id);
        res.send('' + currPort + '');
        return;
    }

    const currPort = getFreePort();
    const wss = new WebSocket.Server({ port: currPort });

    openSockets.set(id, [currPort, 0, wss]);

    console.log("WebSocket Server created on port:", currPort);

    wss.on('connection', function connection(ws) {
        console.log("Client connected on", id, "port", currPort);
        ws.id = id;

        openSockets.set(id, [currPort, openSockets.get(id)[1] + 1, wss]);

        ws.on('message', function incoming(message) {
            console.log("Message received:", message.toString('utf8'));

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString('utf8'));
                }
            });
        });

        ws.on('close', function() {
            console.log("Client disconnected:", ws.id);
            disconnectSocket(ws.id);
        });
    });

    res.send('' + currPort + '');
});
function disconnectSocket(id) {
    if (!openSockets.has(id)) return;

    let [_port, count, wss] = openSockets.get(id);
    count -= 1;

    if (count > 0) {
        openSockets.set(id, [_port, count, wss]);
        return;
    }

    console.log(`No more clients on port ${_port}. Closing WebSocket.`);

    // Close only the correct WebSocket server
    wss.close(() => {
        console.log(`WebSocket server closed on port: ${_port}`);
        openPort(_port);
        openSockets.delete(id);
    });
}


//map of free ports
let mapOPorts = new Map([
    [8081 ,false],
    [8082 ,false],
    [8083 ,false],
    [8084 ,false],
    [8085 ,false]
]);
let lastPort = 8085;
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
    //expands the list of ports
    lastPort++;
    mapOPorts.set(lastPort,true);
    return lastPort;
}
//opens up passed in port number in map
function openPort(portNum){
    mapOPorts.set(portNum,false);
    console.log("mapOPorts:");
    console.log(mapOPorts);
}

module.exports = app;