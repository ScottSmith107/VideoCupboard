const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() })

const app = express.Router();

let SID;

//searches for 
app.get('/search',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("userID: ",userID);
    
    output = await data.getUser(userID);
    res.send(output);
});

//adding new user to the db
app.post('/auth',upload.none(), async (req, res) => {
    let name = req.body.username
    let iconID = req.body.iconID
    output = await data.addUser(name,iconID);
    res.send(output);
});

//adding new user to the db
app.post('/addTorrent',upload.none(), async (req, res) => {
    let name = req.body.username
    let iconID = req.body.iconID
    output = await data.addUser(name,iconID);
    res.send(output);
});

module.exports = app;