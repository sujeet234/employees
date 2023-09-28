const {Client} = require("pg");
const client = new Client({
    host:"db.haxhmckjkhmoyybhgmlw.supabase.co",
    user:"postgres",
    port:5432,
    password:"Sujeet@7412",
    database:"postgres",
    ssl: { rejectUnauthorized: false },
}) 


module.exports.client=client;