const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const videoPath = path.join(__dirname, "videos")

app.get('/', function (req, res) {
    res.send('Hello, World!');
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

///sends all files listed in the videos dir back to caller as json
app.get('/all', function (req, res) {
    fs.readdir(videoPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Unable to scan directory" });
        }
        res.json({ files });
    });
}); 

//if the user opens a folder
app.get('/folder', function (req, res) {
    folderName = req.query.folder;
    console.log(folderName);
    folderDir = path.join(videoPath + "/" + folderName);
    console.log(folderDir);
    fs.readdir(folderDir, (err, files) => {
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
    
