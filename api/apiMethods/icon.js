const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');

const app = express.Router();

///sends all files listed in the videos dir back to caller as json
app.get('/allIcons', async (req, res) => {
    output = await data.allIcons("");
    res.send(output);
});

//retreves all icons
app.put('/getIcon', async (req, res) => {
    iconID = req.body.iconID;
    console.log("iconID: ",iconID);
    
    output = await data.getIcon(iconID);
    res.send(output);
});

module.exports = app;
