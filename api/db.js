const mysql = require("mysql2");
require('dotenv').config();


const dbConfig = {
    host: process.env.DB_IP,
    database: process.env.DB_NAME,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
};

const db = mysql.createConnection(dbConfig);
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Successfully connected to the db');
});

//expoorts db connection to be used by events
exports.db = db;

