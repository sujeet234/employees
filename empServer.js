let express=require("express");
let cors = require("cors");
let app = express();
app.use(express.json());
app.use(cors());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With,Content-Type,Accept"
    );
    next();
});
//process.env.PORT ||
const port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}`));

let {client} = require("./empDB1.js");
client.connect();

app.get("/employees",function(req,res){
    let department = req.query.department;
    let designation = req.query.designation;
    let gender = req.query.gender;
    let options ="";
    let optionArr = [] ;
    let i=1;
    if(department){
        let deptArr = department.split(",");
        options=`WHERE `;
        let or="";
        for(i;i<=deptArr.length;i++){
            options+=`${or}department=$${i}`;
            or=" OR ";
        }
        optionArr=deptArr;
    }
    if(designation){
        let deptArr = designation.split(",");
        let query="";
        let or="";
        let num=i;
        for(i;i<deptArr.length+num;i++){
            query+=`${or}designation=$${i}`;
            or=" OR ";
        }
        if(options){
            options+=` AND (${query})`;
        }else{
        options=`WHERE ${query}`;
        }
        optionArr.push(...deptArr);
    }
    if(gender){
        let deptArr = gender.split(",");
        let query="";
        let or="";
        let num=i;
        for(i;i<deptArr.length+num;i++){
            query+=`${or}gender=$${i}`;
            or=" OR ";
        }
        if(options){
            options+=` AND (${query})`;
        }else{
        options=`WHERE ${query}`;
        }
        optionArr.push(...deptArr);
    }
    let qry = `SELECT * FROM employees ${options}`;
    // let qry = `SELECT * FROM employees WHERE department=($1)`;
    console.log(qry);
    client.query(qry,optionArr,function(err,results){
        if(err){
            console.log(err)
            res.status(404).send("No Employee found");
        }else {
            // let arr=[...results.rows];
            // arr = arr.filter((dt)=>dt.department===department)
            res.send(results.rows);
        }

    })
    // res.send(answerArr);
    
})



app.get("/employees/:empcode",function(req,res){
    let empcode = +req.params.empcode;
    let query = `SELECT * FROM employees WHERE empcode=$1`;
    console.log(query);
    client.query(query,[empcode],function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in fetching data");
        }
        else res.send(results.rows);
        // client.end();
    })
})

app.post("/employees",function(req,res){
    let body = req.body;
    let query = `INSERT INTO employees(empcode,name,department,designation,salary,gender) VALUES($1,$2,$3,$4,$5,$6)`;
    client.query(query,[body.empcode,body.name,body.department,body.designation,body.salary,body.gender],function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in inserting data");
        }else res.send(results);
    })
})

app.put("/employees/:empcode",function(req,res){
    let empcode = +req.params.empcode;
    let body = req.body;
    let query = `UPDATE employees SET name=$1,department=$2,designation=$3,salary=$4,gender=$5 WHERE empcode=$6`;
    let params = [body.name,body.department,body.designation,body.salary,body.gender,empcode];
    client.query(query,params,function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in updation data");
        }
        else res.send(results);
    })
})

app.delete("/employees/:empcode",function(req,res){
    let empcode = +req.params.empcode;
    let query = `DELETE FROM employees WHERE empcode=$1`;
    client.query(query,[empcode],function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in deletion data");
        }
        else res.send(results);
    })
})

// function resetData(){
//     // let connection = getConnection();
//     let sql = "DELETE FROM employees";
//     client.query(sql,function(err,res){
//         if(err) console.log(err);
//         else{
//             console.log("Successful deleted.Affected rows : ",res.rows);
//             let {employees} = require("./emplData.js");
//             let arr = employees.map(p=>[p.empCode,p.name,p.department,p.designation,p.salary,p.gender]);
//             let sql2 = "INSERT INTO employees(empcode,name,department,designation,salary,gender) VALUES ?";
//             client.query(sql2,[arr],function(err,res){
//                 if(err) console.log(err);
//                 else console.log("Successfully inserted.Affected rows : ",res.rows);
//             });
//         }
//     })
// }

// resetData();
