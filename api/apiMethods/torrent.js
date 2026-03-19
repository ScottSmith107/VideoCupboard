const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() })

const app = express.Router();

let SID;

//searches for torrents based off query
app.get('/torrentSearch', async (req, res) => {
    query = req.query.query;
    console.log("query: ",query);

    // make call to prowlarr
    const search = new URL('http://cupboard:9696/api/v1/search?query='+query+'&categories=2000');
    fetch(search, {
        headers: {
            'X-Api-Key':process.env.PROWLARR_KEY
        }
    })
    .then(response => response.json())
    .then(data =>{
        console.log("search results");
        console.log(data);

        res.send(data);
    })
    .catch(error => {
        console.error("couldnt get all videos", error);
        res.send("couldnt get all videos", error);
    });

    // console.log(output);
    // res.send(output);
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