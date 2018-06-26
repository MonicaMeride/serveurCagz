var express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

var router = express.Router();
let mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
console.log('elo');
let db = (table) => {
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
    let dbo = db.db("cagz-land");
    dbo.collection(table).findOne({}, function(err, result) {
      if (err) throw err;
      console.log(result.email);
      return result;
      db.close();
    });
  });
}

router.post('/api/form',function(req,res){
  console.log(req.body);
  nodemailer.createTestAccount((err, account)=>{
      const htmlEmail = "<h3>ContactDetails </h3><ul><li>Name: "+ req.body.nom +"</li><li>Email: "+req.body.email+"</li><li>Message: "+req.body.message+"</li></ul>";

      let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: 'meride.monica@gmail.com',
            pass: 'seremes971'
          }
      });

      let mailOptions = {
        from: req.body.email, // sender address
        to: 'neutrino.agency@gmail.com', // list of receivers
        replyTo: req.body.email,
        subject: 'Hello ✔', // Subject line
        text: req.body.message, // plain text body
        html: htmlEmail // html body
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err);
        }
        console.log('Message sent: %s', info.message);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      });

  });
});
/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/data', function(req,res) {
  let choix;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
      let dbo = db.db("cagz-land");
      dbo.collection('choix').find().toArray(function(err, result) {
        if (err) throw err;
        console.log(result[0].levres);
        choix = result[0];
        
        db.close();
        return res.json(choix);
      });
    });
});
  
router.post('/result', function(req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("cagz-land");
    var myobj = { 
      "email" : "",
      "choix":{
        "choix_1": req.body.choix_1,  
        "choix_2": req.body.choix_2,
        "choix_3": req.body.choix_3,
        "choix_4": req.body.choix_4
      }      
    };
    dbo.collection("user_choix").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
});

module.exports = router;
