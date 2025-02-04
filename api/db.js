const mysql = require("mysql2");

const dbConfig = {
    host: 'localhost',
    database: 'movieserver',
    user: 'root',
    password: ''
};

const db = mysql.createConnection(dbConfig);
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Successfully connected to the db');
});

//sexpoorts db connection to be used by events
exports.db = db;
