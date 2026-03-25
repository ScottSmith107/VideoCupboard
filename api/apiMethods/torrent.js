const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');

const multer = require("multer");
const { url } = require('inspector');
const upload = multer({ storage: multer.memoryStorage() })

const app = express.Router();

let QBITCookie = null;

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

    const body = new URLSearchParams();
    body.append("username", process.env.QBIT_USERNAME);
    body.append("password", process.env.QBIT_PASSWORD);

    const url = 'http://cupboard:8080/api/v2/auth/login';

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
    });

    console.log("AuthResults");
    QBITCookie = response.headers.get('set-cookie');
    // QBITCookie = response.headers.get('set-cookie').split(';')[0].slice(8);
    console.log("QBITCookie: ", QBITCookie);
    
    res.send(response);

});

//adding new user to the db
app.get('/addTorrent',upload.none(), async (req, res) => {
    const magnet = req.query.magnet;

    const formData = new FormData();
    formData.append("urls",magnet);

    console.log("attemping to add " , magnet);
    console.log("QBITCookie Provided " , QBITCookie);

    // send magnet to qbittorrent
    const request = new URL('http://cupboard:8080/api/v2/torrents/add');
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

module.exports = app;