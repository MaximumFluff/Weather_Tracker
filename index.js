const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 8000;
//var url = "mongodb://localhost:27017/cities";
const url = "mongodb://<user>:<password>@ds125058.mlab.com:25058/heroku_961hzsbr";

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
        let dbo = db.db("heroku_961hzsbr");
        let myQuery = { name:  name };
        let newValues = { $set: {currentTemp: cTemp, highTemp: hTemp, lowTemp: lTemp} };
        dbo.collection("cities").updateOne(myQuery, newValues, (err, res) =>
        {
            if (err) throw err;
            console.log("one document updated");
            db.close();
        });
    });
    res.redirect("back");
});

app.listen(port, () =>
{
    console.log("app running on port" + port);
});