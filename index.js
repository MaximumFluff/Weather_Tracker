const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/cities";
const url = "mongodb://heroku_961hzsbr:eti3bqovpl3qc5athhf4d8qbla@ds125058.mlab.com:25058/heroku_961hzsbr";

MongoClient.connect(url, (err, db) =>
 {
  if (err) throw err;
  let dbo = db.db("heroku_961hzsbr");
  dbo.collection("cities").findOne({}, (err, result) =>
    {
        if (err) throw err;
        console.log(result.name);
    })
  console.log("Database connected!");
  db.close();
});
app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.get('/', (req, res) => 
{
    let mongodb_results = [];
    MongoClient.connect(url, (err, db) =>
    {
        if (err) throw err;
        let dbo = db.db("heroku_961hzsbr");
        let str = dbo.collection("cities").find();
        str.forEach((doc, err) =>
        {
            //console.log(results);
            //console.log(mongodb_results);
            mongodb_results.push(doc);
        }, () =>
        {
            console.log(mongodb_results);
            res.render('index', {results: mongodb_results});
            db.close();
        });
    });
    
});
app.post('/update', (req, res) =>
{
    let cTemp = req.body.currentTemp;
    let hTemp = req.body.highestTemp;
    let lTemp = req.body.lowestTemp;
    let name = req.body.city;
    MongoClient.connect(url, (err, db) =>
    {
        if (err) throw err;
        var dbo = db.db("heroku_961hzsbr");
        var myQuery = { name:  name };
        var newValues = { $set: {currentTemp: cTemp, highTemp: hTemp, lowTemp: lTemp} };
        dbo.collection("cities").updateOne(myQuery, newValues, (err, res) =>
        {
            if (err) throw err;
            console.log("one document updated");
            db.close();
        });
    });
    res.redirect("back");
});