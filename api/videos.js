const { resolve } = require('path');
const data = require('./db.js');
const { rejects } = require('assert');

const db = data.db;

//get all videos
exports.allVideos = function allVideos(){
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

//get all videos
exports.allUsers = function allUsers(){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user', (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//get all videos
exports.allIcons = function allIcons(){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM icons', (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//gets a icon full path based from id
exports.getIcon = function getIcon(iconID){
    return new Promise((resolve, reject) => {
        db.query('SELECT fullPath FROM icons WHERE iconID = ?', [iconID], (error,results) => {
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
exports.getIdFromName = function getIdFromName(folderName){
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
exports.addUser = function addUser(name,iconID){
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO `user` (`Name`,`icon`) VALUES (?,?)', [name,iconID], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//gets a videos full path based from id
exports.getUser = function getUser(userID){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE userID = ?', [userID], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//updates username and icon //fix\\
exports.updateUser = function updateUser(name,iconID,userID){
    return new Promise((resolve, reject) => {
        db.query('UPDATE user SET name = ? ,icon = ? WHERE userID = ?', [name,iconID,userID], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//updates username //fix\\
exports.updateUsername = function updateUsername(name,userID){
    return new Promise((resolve, reject) => {
        db.query('UPDATE user SET name = ? WHERE userID = ?', [name,userID], (error,results) => {
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

//delete singular file to db
exports.deleteUser = function deleteUser(userID){
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM user WHERE `user`.`userID` = ?', [userID], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//delete singular file to db
exports.deleteUserWatching = function deleteUserWatching(userID){
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM watching WHERE `watching`.`userID` = ?', [userID], (error,results) => {
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

//gets the current timestamp for the video for the user
exports.getTimestamp = function getTimestamp(userID,videoID){
    return new Promise((resolve, reject) => {
        db.query('SELECT time FROM watching WHERE userID = ? and videoID = ?', [userID,videoID], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//sets the current timestamp for the video for the user
exports.setTimestamp = function setTimestamp(userID,videoID,timestamp){
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO `watching` (`userID`, `videoID` , `time`) VALUES (?,?,?)', [userID,videoID,timestamp], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//updates the current timestamp for the video for the user
exports.updateTimestamp = function updateTimestamp(userID,videoID,timestamp){
    return new Promise((resolve, reject) => {
        db.query('UPDATE watching SET time = ? WHERE userID = ? and videoID = ?', [timestamp,userID,videoID], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}