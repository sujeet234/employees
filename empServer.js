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

let {getConnection} = require("./empDB.js");

app.get("/employees",function(req,res){
    let connection = getConnection();
    let department = req.query.department;
    let designation = req.query.designation;
    let gender = req.query.gender;
    let options = "";
    let optionsArr = [];
    if(department){
        let deptArr = department.split(",");
        options = " WHERE department IN (?) ";
        optionsArr.push(deptArr);
    }
    if(designation){
        options = options ? `${options} AND designation=? ` : " WHERE designation=? ";
        optionsArr.push(designation);
    }
    if(gender){
        options = options ? `${options} AND gender=? ` :  " WHERE gender=? ";
        optionsArr.push(gender);
    }
    let sql = `SELECT * FROM employees ${options}`;
    connection.query(sql,optionsArr,function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in fetching data");
        }else res.send(results);
    })
})


app.get("/employees/:empcode",function(req,res){
    let empCode = req.params.empcode;
    let connection = getConnection();
    let sql = "SELECT * FROM employees WHERE empCode=?";
    connection.query(sql,empCode,function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in fetching data");
        }else if(results.length===0){
            res.send(404).send("No employees found");
        }
        else res.send(results[0]);
    })
})

app.post("/employees",function(req,res){
    let body = req.body;
    let connection = getConnection();
    let sql = "INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES(?,?,?,?,?,?)";
    connection.query(sql,[body.empCode,body.name,body.department,body.designation,body.salary,body.gender],function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in inserting data");
        }else res.send(`Post success.Id of new employee is ${results.insertId}`);
    })
})

app.put("/employees/:empcode",function(req,res){
    let empCode = req.params.empcode;
    let body = req.body;
    let connection = getConnection();
    let sql = "UPDATE employees SET name=?,department=?,designation=?,salary=?,gender=? WHERE empCode=?";
    let params = [body.name,body.department,body.designation,body.salary,body.gender,empCode];
    connection.query(sql,params,function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in updation data");
        }
        else if(results.affectedRows===0) res.status(404).send("No update happened");
        else res.send("Update success");
    })
})

app.delete("/employees/:empcode",function(req,res){
    let empCode = req.params.empcode;
    let connection = getConnection();
    let sql = "DELETE FROM employees WHERE empCode=?";
    connection.query(sql,empCode,function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in deletion data");
        }
        else if(results.affectedRows===0) res.status(404).send("No delete happened");
        else res.send("Delete success");
    })
})

function resetData(){
    let connection = getConnection();
    let sql = "DELETE FROM employees";
    connection.query(sql,function(err,results){
        if(err) console.log(err);
        else{
            console.log("Successful deleted.Affected rows : ",results.affectedRows);
            let {employees} = require("./emplData.js");
            let arr = employees.map(p=>[p.empCode,p.name,p.department,p.designation,p.salary,p.gender]);
            let sql2 = "INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES ?";
            connection.query(sql2,[arr],function(err,results){
                if(err) console.log(err);
                else console.log("Successfully inserted.Affected rows : ",results.affectedRows);
            });
        }
    })
}

// resetData();
