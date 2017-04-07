const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const mongodb = require("mongodb");

const app = express();

app.set("view engine", 'ejs');

app.use(express.static("public"));

var port = 8888;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

var db;

//var url = "mongodb://mongouser:mongouser123@ds019668.mlab.com:19668/raj-todos";
var url = "mongodb://localhost:27017/todos";

MongoClient.connect(url, (err, database) => {
    if (err) return console.log(err);
    db = database;
    app.listen(port, function () {
        console.log(`Listening on port ${port}`);
    });

});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

var homeController = require("./controllers/home");

// app.get("/", function (req, res) {
    
//     var cursor = db.collection("todos")
//         .find()
//         .toArray(function(err, results) {
//             if (err) console.log(err);
//             res.render("index.ejs", {todos: results});
//         });
//     /////res.sendFile(__dirname + "/index.html");
    
// });

app.get("/", homeController);

app.get("/delete/:id", function (req, res) {
    console.log("deleting todo with id: ", req.params.id);
    var id = new mongodb.ObjectID(req.params.id);
    db.collection('todos').remove({_id: id}, function(err, collection) {
        console.log(err);
    });
    res.redirect("/");
});

app.get("/edit/:id", function (req, res) {
    console.log("editing todo with id: ", req.params.id);

    var id = new mongodb.ObjectID(req.params.id);
    
     db.collection("todos").find({_id: id}).toArray().then(function (data){
        console.log("todo: ", data[0]);
        var todo = data[0];
         res.render("edit.ejs", {todo: todo});
    });
        
});

app.post("/update", function (req, res) {
    var id = new mongodb.ObjectID(req.body.id);
    console.log("udpate: ", req.body.todo);
    db.collection("todos")
        .update({_id:id},{name:req.body.name, todo:req.body.todo}, 
            function(err, result){
             });

    res.redirect("/");
});

app.post('/todos', (req, res) => { 
    db.collection("todos").save(req.body, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved to the database!");
        res.redirect("/");
    });
});