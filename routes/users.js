var express = require('express');
var router = express.Router();

const uuid=require('uuid/v4');
const mysql=require('mysql');
const sgMail=require('@sendgrid/mail');
const sendGridKey=require('../config/key').sendGridKey;
sgMail.setApiKey(sendGridKey);


const connection=mysql.createPool({
  host:'localhost',
  user:'root',
  password:'root',
  database:'app'
})


router.get('/', function(req, res, next) {
  res.render("index");
});


router.post("/verification", function(request, response)
{
  const { email, password }=request.body;
  const tokenUUID=uuid();
  var sql="insert into verification(uuid, email, password) values(?,?,?)";
  connection.query(sql,[tokenUUID, email, password], function(err, result)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      sgMail.send({
        to:email,
        from:'sankha@gmail.com',
        subject:'Verification email',
        text:`http://localhost:8888/users/verification/${tokenUUID}`,
      })
      response.end("email has been sent, please verify");
    }
  })
})


router.get("/verification/:token", function(request, response)
{
  const token=request.params.token;
  var sql="select * from verification where uuid = ?";
  connection.query(sql,[token], function(err, result)
  {
    if(err)
    {
      console.log(err);
    }
    if(result.length>0)
    {
      response.end("verified");
    }
    else
    {
      response.end("please verify emaila address");
    }
  })
})

module.exports = router;
