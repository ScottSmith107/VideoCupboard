const { resolve } = require('path');
const data = require('./db.js');
const { rejects } = require('assert');

const db = data.db;

//get all videos
exports.allVideos = function allVideos(){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM video WHERE dir = ""', (error,results) => {
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
        db.query('SELECT * FROM video WHERE dir = ?', [index], (error,results) => {
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
        db.query('SELECT * FROM video WHERE id = ?', [id], (error,results) => {
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

//gets all favorite videos from id
exports.getFavorites = function getFavorites(userID){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM video JOIN favorites ON video.id = favorites.videoID WHERE favorites.userId = ? ORDER BY whenUploaded DESC', [userID], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//sets new favorites
exports.setFavorites = function setFavorites(userID,videoID){
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO `favorites` (`userID`,`videoID`) VALUES (?,?)', [userID,videoID] , (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//removes favorites 
exports.removeFavorites = function removeFavorites(userID,videoID){
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM favorites WHERE userID = ? AND videoId = ?', [userID,videoID] , (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//gets gets the most recent 10 videos from watching from id
exports.getRecent = function getRecent(userID){
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM video JOIN watching ON video.id = watching.videoID WHERE watching.userId = ? ORDER BY whenUploaded DESC', [userID], (error,results) => {
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

//updates username //fix\\
exports.updateVideoWicon = function updateVideoWicon(videoID,videoName,iconPath,desc){
    return new Promise((resolve, reject) => {
        db.query('UPDATE video SET name = ?, icon = ?, description = ? WHERE id = ?', [videoName,iconPath,desc,videoID], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//updates username //fix\\
exports.updateVideoName = function updateVideoName(videoId,videoName,desc){
    return new Promise((resolve, reject) => {
        db.query('UPDATE video SET name = ?, description = ? WHERE id = ?', [videoName,desc,videoId], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//uploads singular file to db
exports.uploadFile = function uploadFile(name ,desc ,dir ,fullPath,folder,icon){
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO `video` (`Name`, `Description`, `dir`, `Full_path`,`folder`,`icon`) VALUES (?, ?, ?, ?,?,?)', [name ,desc ,dir ,fullPath,folder,icon], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//uploads singular file to db
exports.uploadIcon = function uploadIcon(iconID ,fullPath){
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO `icons` (`iconID`, `fullPath`) VALUES (?, ?)', [iconID ,fullPath], (error,results) => {
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
exports.removeAllRecents = function removeAllRecents(userID){
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM watching WHERE `userID` = ?', [userID], (error,results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//delete singular file to db
exports.removeAllFavorites = function removeAllFavorites(userID){
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM favorites WHERE `userID` = ? ', [userID], (error,results) => {
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