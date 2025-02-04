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
    res.header('Access-Control-Allow-Origin', 'http://localhost');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

///sends all files listed in the videos dir back to caller as json
app.get('/all', async (req, res) => {
    output = await data.getDir("");
    console.log(output);
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
    output = await data.getDir(fileName);
    console.log(output);
    res.send(output);
}); 

//returns a video
app.get('/video', async (req, res) => {
    fileName = req.query.folder;
    dir = req.query.dir;
    filePath = data.getPath(fileName,dir);
    fs.readFile(filePath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to scan directory" });
        }
        res.json({ files });
    });
}); 

app.listen(port, function() {
    console.log(`Example app listening on port ${port}!`);
});

app.use(express.static(videoPath));
    
