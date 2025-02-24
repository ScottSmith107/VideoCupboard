const { resolve } = require('path');
const data = require('./db.js');
const { rejects } = require('assert');

const db = data.db;

//get all videos
exports.getAll = function getAll(){
    return new Promise((resolve, reject) => {
        db.query('SELECT name, id, dir, folder FROM video WHERE dir = ""', (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//gets the dir for a video by the name
exports.getDir = function getDir(index){
    return new Promise((resolve, reject) => {
        db.query('SELECT name, id, dir, Full_path, folder FROM video WHERE dir = ?', [index], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//gets a videos full path based from id
exports.getPath = function getPath(id){
    return new Promise((resolve, reject) => {
        db.query('SELECT full_path FROM video WHERE id = ?', [id], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//gets a videos full path based off name and dir
exports.getDirFromName = function getDirFromName(folderName){
    return new Promise((resolve, reject) => {
        db.query('SELECT id FROM video WHERE name = ?', [folderName], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//uploads singular file to db
exports.uploadFile = function uploadFile(name ,desc ,dir ,fullPath,folder){
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO `video` (`Name`, `Description`, `dir`, `Full_path`,`folder`) VALUES (?, ?, ?, ?,?)', [name ,desc ,dir ,fullPath,folder], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//delete singular file to db
exports.remove = function remove(id){
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM video WHERE `video`.`id` = ?', [id], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//delete whole dir file to db
exports.removeDir = function removeDir(dir){
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM video WHERE `dir` = ?', [dir], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}
