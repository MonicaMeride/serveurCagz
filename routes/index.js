var express = require('express');
var router = express.Router();
let mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

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
        console.log(result[0].param_1);
        choix = result[0];
        
        db.close();
        return res.json(choix);
      });
    });
});
  

module.exports = router;
