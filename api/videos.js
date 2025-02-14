const { resolve } = require('path');
const data = require('./db.js');
const { rejects } = require('assert');

const db = data.db;

//get all videos
exports.getAll = function getAll(){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM video', (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//gets the dir for a video by the name
exports.getDir = function getDir(dir){
    return new Promise((resolve, reject) => {
        db.query('SELECT name, id FROM video WHERE dir = ?', [dir], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//gets a videos full path based off name and dir
exports.getPath = function getPath(name,dir){
    return new Promise((resolve, reject) => {
        db.query('SELECT full_path FROM video WHERE name = ? AND dir = ?', [name, dir], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//uploads singular file to db
exports.uploadFile = function uploadFile(name ,desc ,dir ,fullPath){
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO `video` (`Name`, `Description`, `dir`, `Full_path`, `id`) VALUES (?, ?, ?, ?, NULL)', [name ,desc ,dir ,fullPath], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}
