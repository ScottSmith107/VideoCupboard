const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');
let videoPath = path.join(__dirname, '..' ,"videos")
let userIconPath = path.join(__dirname, '..' ,"icons")

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() })

const app = express.Router();

///sends all files listed in the videos dir back to caller as json
app.get('/allUsers', async (req, res) => {
    output = await data.allUsers("");
    res.send(output);
});

// gets user info from userID
app.put('/getUser',upload.none(), async (req, res) => {
    userID = req.body.userID;
    console.log("userID: ",userID);
    
    output = await data.getUser(userID);
    res.send(output);
});

//updates the users icon
app.put('/updateUser',upload.array('files'), async (req, res) => {
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

//adding new user to the db
app.post('/addUser',upload.none(), async (req, res) => {
    let name = req.body.username
    let iconID = req.body.iconID
    output = await data.addUser(name,iconID);
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

module.exports = app;