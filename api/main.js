const express = require('express');
const fs = require('fs');
const data = require("./videos.js");

const path = require('path');
let websitePath= path.join(__dirname,"website")
let videoPath = path.join("",process.env.STORAGE_DIR)
let userIconPath = path.join("", "/mnt/mydrive/videos/icons")

const multer = require("multer");
const { userInfo } = require('os');

//import diff loctions
const fav = require('./apiMethods/fav');
const recent = require('./apiMethods/recent');
const file = require('./apiMethods/file');
const icon = require('./apiMethods/icon');
const timestamp = require('./apiMethods/timestamp');
const user = require('./apiMethods/user');
const video = require('./apiMethods/video');
const websocket = require('./apiMethods/websocket');

const upload = multer({ storage: multer.memoryStorage() })

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
    // res.send(`window.APP_CONFIG = { IP: "${'http://'+process.env.IP+':3000/'}" };`);
    res.send(`window.APP_CONFIG = { IP: "${'https://'+process.env.IP}" };`);
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(websitePath,"index.html"));
});

app.use(express.static(videoPath));
app.use(express.static(userIconPath));
app.use(express.static(websitePath));


const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
server.setTimeout(60 * 60 * 1000); // 1 hour timeout 