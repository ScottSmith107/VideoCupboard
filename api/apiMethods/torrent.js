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
    const search = new URL(process.env.PROWLARR_URL + 'api/v1/search?query='+query+'&categories=2000');
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

    // const url = 'http://cupboard:8080/api/v2/auth/login';
    const url = process.env.QBit_URL + "api/v2/auth/login";

    try {        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body.toString()
        });
    //SOMTHING WRONG HERE \\
        console.log("AuthResults");
        QBITCookie = response.headers.get('set-cookie');
        // QBITCookie = response.headers.get('set-cookie').split(';')[0].slice(8);
        console.log("QBITCookie: ", QBITCookie);
        
        res.send(response);

    } catch (error) {
        res.send(error);
    }

});

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

    const url = new URL(process.env.QBit_URL + "api/v2/torrents/delete");
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": QBITCookie
        },
        body: new URLSearchParams({
            hashes: hash,
            deleteFiles: "true"
        })
    })
    .then(response => response.text())
    .then(data =>{
        console.log("removed torrent: " , hash);
        console.log(data);

        res.send(data);
    })
    .catch(error => {
        console.error("couldnt remove torrent: ", error);
    });

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

module.exports = app;