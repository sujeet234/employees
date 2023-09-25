const {Client} = require("pg");
const client = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"sujeet",
    database:"postgres"
}) 
// client.connect();
// client.query("SELECT * FROM users",(err,res)=>{
//     if(err) console.log(err.message);
//     else console.log(res.rows);
//     client.end();
// })

module.exports.client=client;