module.exports  = function (req, res) {
    var db = req.db;
    var cursor = db.collection("todos")
        .find()
        .toArray(function(err, results) {
            if (err) console.log(err);
            res.render("home/index.ejs", {todos: results});
    });
   
};