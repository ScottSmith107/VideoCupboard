const express = require('express');
const fs = require('fs');
const data = require("../videos.js");

const path = require('path');

const multer = require("multer");
const { ok } = require('assert');
const upload = multer({ storage: multer.memoryStorage() })

const app = express.Router();

//creates auth token for user  
app.post('/logon',upload.none(), async (req, res) => {
    const password = req.body.password
    
    //check with password from env lol
    if(password == process.env.PASSWORD){
        console.log("Password correct");
        
        token = createToken();
        console.log("Token generated:", token);

        await data.saveToken(token);
        res.send(token);
    }else{
        console.log("Password incorrect");
        res.send("404");
    }
});

function createToken(){
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        token = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        token += charset.charAt(Math.floor(Math.random() * n));
    }
    return token;
}

module.exports = app;
