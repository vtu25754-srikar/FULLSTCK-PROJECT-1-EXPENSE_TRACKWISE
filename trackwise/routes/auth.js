const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/register", (req, res) => {

const { username, email, password, monthlyLimit } = req.body;

const sql =
"INSERT INTO users (username,email,password,monthlyLimit) VALUES (?,?,?,?)";

db.query(sql,[username,email,password,monthlyLimit],(err,result)=>{
if(err) return res.send(err);

res.send({message:"User Registered"});
});
});


router.post("/login",(req,res)=>{

const { username, password } = req.body;

const sql = "SELECT * FROM users WHERE username=? AND password=?";

db.query(sql,[username,password],(err,result)=>{

if(err){
console.error("Database error during login:", err);
return res.status(500).send({message:"Database error"});
}

if(result && result.length>0){
res.send(result[0]);
}else{
res.status(401).send({message:"Invalid Login"});
}

});
});

router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { username, email, password, monthlyLimit } = req.body;
  const sql = "UPDATE users SET username=?, email=?, password=?, monthlyLimit=? WHERE id=?";
  db.query(sql, [username, email, password, monthlyLimit, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "User updated" });
  });
});

module.exports = router;