const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const PATH = require('path');

const multer = require("multer");
const { url } = require('inspector');
const { ok } = require('assert');
const upload = multer({ storage: multer.memoryStorage() })
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
const { get } = require('http');
const { setTimeout } = require('timers/promises');

const app = express.Router();

let QBITCookie = null;

//searches for torrents based off query
app.get('/torrentSearch', async (req, res) => {
    query = req.query.query;
    console.log("query: ",query);

    // make call to prowlarr
    // const search = new URL(process.env.PROWLARR_URL + 'api/v1/search?query='+query+'&categories=2000,5000');
    const search = new URL(process.env.PROWLARR_URL + 'api/v1/search');
    search.searchParams.append("query", query);
    search.searchParams.append("categories", "2000");
    search.searchParams.append("categories", "5000");

    fetch(search, {
        headers: {
            'X-Api-Key':process.env.PROWLARR_KEY
        }
    })
    .then(response => response.json())
    .then(data =>{
        console.log("search succesful");
        // console.log(data);

        res.send(data);
    })
    .catch(error => {
        console.error("couldnt get all videos", error);
        res.send("couldnt get all videos", error);
    });

}); 

//adding new user to the db
app.get('/auth',upload.none(), async (req, res) => {

    res.send(auth());

});
async function auth(){
    const body = new URLSearchParams();
    body.append("username", process.env.QBIT_USERNAME);
    body.append("password", process.env.QBIT_PASSWORD);

    const url = process.env.QBit_URL + "api/v2/auth/login";

    try {        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body.toString()
        });
        console.log("AuthResults");
        QBITCookie = response.headers.get('set-cookie');
        console.log("QBITCookie: ", QBITCookie);
        
        return response;

    } catch (error) {
        return error;

    }
}

//adding new torrent
app.get('/addTorrent',upload.none(), async (req, res) => {
    const magnet = req.query.magnet;

    const formData = new FormData();
    formData.append("urls",magnet);

    console.log("attemping to add " , magnet);
    console.log("QBITCookie Provided " , QBITCookie);

    // send magnet to qbittorrent
    // const request = new URL(process.env.QBit_URL + "http://cupboard:8080/api/v2/torrents/add');
    const request = new URL(process.env.QBit_URL + "api/v2/torrents/add");
    fetch(request, {
        method: "POST",
        body: formData,
        headers:{
            "Cookie": QBITCookie
        }
    })
    .then(response => response.text())
    .then(data =>{
        console.log("response...");
        console.log(data);

        res.send(data);
    })
    .catch(error => {
        console.error("couldnt add magnet", error);
        // res.send("couldnt add magnet", error);
    });

});

//gets all the data relating to all downloading torrents
app.get('/getTorrents',upload.none(), async (req, res) => {
    // send magnet to qbittorrent
    const request = new URL(process.env.QBit_URL + "api/v2/torrents/info");
    fetch(request, {
        method: "POST",
        headers:{
            "Cookie": QBITCookie
        }
    })
    .then(response => response.text())
    .then(data =>{
        // console.log("response...");
        // console.log(data);

        res.send(data);
    })
    .catch(error => {
        console.error("couldnt add magnet", error);
    });

});

//removing passed torrent from qbit 
app.get('/removeTorrent',upload.none(), async (req, res) => {
    const hash = req.query.hash;

    console.log("attemping to remove " , hash);

    removeTorrentFunc(hash,true);

});

//pausing a passed torrent from qbit 
app.get('/pauseTorrent',upload.none(), async (req, res) => {
    const hash = req.query.hash;

    console.log("attemping to remove " , hash);

    const url = new URL(process.env.QBit_URL + "api/v2/torrents/pause");
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": QBITCookie
        },
        body: new URLSearchParams({
            hashes: hash,
        })
    })
    .then(response => response.text())
    .then(data =>{
        console.log("paused torrent: " , hash);
        console.log(data);

        res.send(data);
    })
    .catch(error => {
        console.error("couldnt pause torrent: ", error);
    });

});

//pausing a passed torrent from qbit 
app.get('/resumeTorrent',upload.none(), async (req, res) => {
    const hash = req.query.hash;

    console.log("attemping to resume " , hash);

    const url = new URL(process.env.QBit_URL + "api/v2/torrents/resume");
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": QBITCookie
        },
        body: new URLSearchParams({
            hashes: hash,
        })
    })
    .then(response => response.text())
    .then(data =>{
        console.log("resumed torrent: " , hash);
        console.log(data);

        res.send(data);
    })
    .catch(error => {
        console.error("couldnt resume torrent: ", error);
    });

});

//stores all files that need to be saved
var neededFiles = [];

//wait helper function
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//this endpoint is called when a torrent completes
app.get('/torrentFinished',upload.none(), async (req, res) => {
    const name = req.query.name;
    const hash = req.query.hash;
    const path = req.query.path;

    console.log("torrent done");
    console.log(req.query.path);

    const stat = await fs.promises.stat(path);
    if(stat.isDirectory()){
        const files = await fs.promises.readdir(path); 

        // TODO add check here if neededfiles > [] wait untill not // yucky work around but it works lol.
        while(neededFiles.length != 0){
            console.log("neededFiles.length:", neededFiles.length , " Waiting");
            await wait(5000);
        }

        await getFilesRecur(path)
        console.log("neededFiles");
        console.log(neededFiles);

        // check if a folder is needed
        if(neededFiles.length > 1){
            console.log("Creating folder")

            // create new folder
            const folderPath = PATH.join(process.env.STORAGE_DIR,name);
            await fs.mkdir(folderPath, { recursive: true }, (err) => {
                if (err){
                    console.error("failed to make new folder", err);
                }
            });

            //created folder in DB
            await data.uploadFile(name ,"" ,0 ,name,1,"",null);

            //get folder id
            const folderId = await data.getIdFromName(name)
            console.log("folderId:" ,folderId[0].id);

            // move file to new folder then add to db
            var position = 0;
            neededFiles.forEach(async file => { //file now holds the full path
                var fileName = file.split("/");
                fileName = fileName[fileName.length-1]
                const newDir = PATH.join(folderPath , fileName);
                await fs.promises.rename(file, newDir);

                // upload file
                await data.uploadFile(fileName ,"" ,folderId[0].id , PATH.join(name, fileName),0,"",position);
                position++;
            });

            neededFiles = []; // needs to be called before converting files as will stall the any other downloads

            await convertFile(name,true);

        }else{
            // move file out of folder to correct dir
            var fileName = neededFiles[0].split("/");
            fileName = fileName[fileName.length-1]
            const newDir = PATH.join(process.env.STORAGE_DIR , fileName);
            await fs.promises.rename(neededFiles[0], newDir );
            
            neededFiles = [];// needs to be called before converting files as will stall the any other downloads

            await convertFile(fileName,false);

            // add file to DB 
            output = await data.uploadFile(fileName ,"" ,0 , fileName,0,"",null);
        }
    

    }else{// if the there is only one loose file // bit of an edge case
        var fileName = path.split("/");
        fileName = fileName[fileName.length-1]
        const newDir = PATH.join(process.env.STORAGE_DIR , fileName);
        await fs.promises.rename(path, newDir);

        await convertFile(fileName,false);

        output = await data.uploadFile(fileName ,"" ,0 , fileName,0,"",null);
    }
    

    await auth();
    //remove torrent but not the data
    output = await removeTorrentFunc(hash,true);
    res.send("meow")
});

//get all videos files from the pearent folder
// places them in one list in the order they are found depth first
async function getFilesRecur(currentFolder){

    const files = await fs.promises.readdir(currentFolder); 
        for(const file of files){
            var filePath = PATH.join(currentFolder,file);
            if(file.slice(-3) == "mp4" || file.slice(-3) == "mkv"){
                neededFiles.push(filePath);
            }else{
                const stat = await fs.promises.stat(filePath);
                if(stat.isDirectory())
                    await getFilesRecur(filePath);
            }
        }
}

async function removeTorrentFunc(hash , remove){

    const url = new URL(process.env.QBit_URL + "api/v2/torrents/delete");
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": QBITCookie
        },
        body: new URLSearchParams({
            hashes: hash,
            deleteFiles: remove
        })
    })
    .then(response => response.text())
    .then(data =>{
        console.log("removed torrent: " , hash) , "Removed data: ",remove;
        console.log(data);

        return(data);
    })
    .catch(error => {
        console.error("couldnt remove torrent: ", error);
        return(error);
    });
}

// converts the passed in file/folder to a video/audio codec that is supported by my chromecast.
async function convertFile(name, folder){
    if(!folder){
        
        console.log("Not folder to remux");

        const suffix = name.slice(-4);
        const filePath = PATH.join(process.env.STORAGE_DIR,name);
        
        const metadata = await getMetadata(PATH.join(process.env.STORAGE_DIR, name)); 
        var videoCodec = metadata.streams[0].codec_name; 
        var audioCodec = metadata.streams[1].codec_name; 
        var audioCodecProfile = metadata.streams[1].profile; 

        console.log("Current Codecs of ", name);
        console.log(videoCodec);
        console.log(audioCodec);
        console.log(audioCodecProfile);
        console.log(" ");
        console.log("suffix - ",suffix);

        if(videoCodec != "h264"){
            console.log("Video and audio need to be changed");
            //change audio and video codex
            const tempPath = PATH.join(process.env.STORAGE_DIR, `${name.slice(0, -4)}.tmp${suffix}`);

            ffmpeg(filePath)
                .videoCodec('libx264')        // H.264
                .audioCodec('aac')            // AAC (LC by default)
                .audioChannels(2)             // Dual channel (stereo)
                .outputOptions([
                    '-profile:a aac_low',     // Explicit AAC-LC
                    '-crf 23',
                    '-preset medium'
                ])
                .on('end', () => {
                    // Replace original file
                    fs.renameSync(tempPath, filePath);
                    console.log(`Replaced: ${filePath}`);
                })
                .on('error', (err) => {
                    console.error(`Error processing ${filePath}:`, err);
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                })
                .save(tempPath);

        }else if(audioCodec != "aac" || audioCodecProfile != "LC"){
            console.log("audio needs to be changed");
            //change just audio codec
            const tempPath = PATH.join(process.env.STORAGE_DIR, `${name.slice(0, -4)}.tmp${suffix}`);

            ffmpeg(filePath)
                .videoCodec('copy')           //copies current 'vaild' codec
                .audioCodec('aac')            // AAC (LC by default)
                .audioChannels(2)             // Dual channel (stereo)
                .outputOptions([
                    '-profile:a aac_low',     // Explicit AAC-LC
                    '-crf 23',
                    '-preset medium'
                ])
                .on('end', () => {
                    // Replace original file
                    fs.renameSync(tempPath, filePath);
                    console.log(`Replaced: ${filePath}`);
                })
                .on('error', (err) => {
                    console.error(`Error processing ${filePath}:`, err);
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                })
                .save(tempPath);
        }

    }else{ //if folder

        var files = await fs.promises.readdir(PATH.join(process.env.STORAGE_DIR, name));

        // const metadata = await getMetadata(PATH.join(process.env.STORAGE_DIR, name , files[0])); 
        // var videoCodec = metadata.streams[0].codec_name; 
        // var audioCodec = metadata.streams[1].codec_name; 
        // var audioCodecProfile = metadata.streams[1].profile; 

        // console.log("Current Codecs of ", name);
        // console.log(videoCodec);
        // console.log(audioCodec);
        // console.log(audioCodecProfile);
        // console.log(" ");
        
        for(i = 0; i < files.length; i++){
            const metadata = await getMetadata(PATH.join(process.env.STORAGE_DIR, name , files[i])); 
            var videoCodec = metadata.streams[0].codec_name; 
            var audioCodec = metadata.streams[1].codec_name; 
            var audioCodecProfile = metadata.streams[1].profile; 

            console.log("Current Codecs of ", name);
            console.log(videoCodec);
            console.log(audioCodec);
            console.log(audioCodecProfile);
            console.log(" ");

            if(videoCodec != "h264"){
                
                console.log("audioVideo.sh");
                exec("bash /home/scott/main/videos/videoAudio.sh", {
                    cwd: PATH.join(process.env.STORAGE_DIR, name)
                    }, (err, stdout, stderr) => {
                        console.log(stdout);
                    }
                );
            }else if(audioCodec != "aac" || audioCodecProfile != "LC"){
            
                console.log("audio.sh");
                exec("bash /home/scott/main/videos/audio.sh", {
                    cwd: PATH.join(process.env.STORAGE_DIR, name)
                    }, (err, stdout, stderr) => {
                    console.log(stdout);
                    }
                );
            }
        }

    }

}

// gets all data from a file
async function getMetadata(path) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata);
    });
  });
}

//this endpoint is called when a torrent completes
app.post('/updatePositions',upload.none(), async (req, res) => {
    // const map = req.body.map;
    const ids = req.body.ids.split(',');
    const positions = req.body.positions.split(',');

    for (let index = 0; index < ids.length; index++) {
        //update pos for each video
        var id = ids[index];
        var pos = positions[index];
        var output = await data.updatePosition(id,pos);      
        console.log(output);
    }
    
    res.send("meow");
});

module.exports = app;
