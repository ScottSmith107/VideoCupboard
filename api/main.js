const express = require('express');
const fs = require('fs');
const path = require('path');
const data = require("./videos.js");
const { stringify } = require('querystring');
const app = express();
const port = 3000;

const videoPath = path.join(__dirname, "videos")

app.get('/', async (req, res) => {
    output = await data.getDir("");
    console.log(output);
    res.send(output);
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://192.168.1.115');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

///sends all files listed in the videos dir back to caller as json
app.get('/all', async (req, res) => {
    output = await data.getDir("");
    // console.log(output);
    res.send(output);

    // fs.readdir(videoPath, (err, files) => {
    //     if (err) {
    //         return res.status(500).json({ error: "Unable to scan directory" });
    //     }
    //     res.json({ files });
    // });
}); 

//if the user opens a folder
app.get('/folder', async (req, res) => {
    fileName = req.query.folder;
    console.log(fileName);
    output = await data.getDir(fileName);
    // console.log(output);
    res.send(output);
}); 

//for uploading files not in a folder
app.put('/upload', async (req, res) => {
    files = req.files;
    description = req.description;
    console.log(files);
    console.log(description);

    //adds each file by itself
    for (let i = 0; i < files.length; i++) {
        file = array[i];
        //add file to db
        //add file to storage
    }

    output = await data.getDir(fileName);
    // console.log(output);
    res.send(output);
}); 

//for uploading files in a folder
app.put('/upload-folder', async (req, res) => {
    files = req.files;
    description = req.description;
    console.log(files);
    console.log(description);

    //adds folder 
        //add new dir to db
        data.uploadFile(name ,desc ,dir ,fullPath);
        //add new dir to storage

    //adds each file by itself
    for (let i = 0; i < files.length; i++) {
        file = array[i];
        //add file to db
        data.uploadFile(file.namename ,desc ,dir ,fullPath);
        //add file to storage
    }

    output = await data.getDir(fileName);
    // console.log(output);
    res.send(output);
}); 

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});

app.use(express.static(videoPath));
    
