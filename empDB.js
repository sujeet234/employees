let mysql = require("mysql");
let connData = {
    host:"localhost",
    user:"root",
    password:"sumit",
    database:"testdb"
}

function getConnection(){
    return mysql.createConnection(connData);
}

module.exports.getConnection = getConnection;