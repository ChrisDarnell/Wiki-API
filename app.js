//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// Mongoose

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


// API Calls - Routing Requests Targeting All Articles

app.route("/articles")
    .get((req, res) => {
        Article.find({}, function (err, foundArticles) {
            if (err) {
                console.log(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Success - New Article Added.");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Success - All Articles Deleted.");
            } else {
                res.send(err);
            }
        });
    });

// Requests Targeting Specific Article

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No Matching Article(s) Found.");
            }
        });
    })
    .put((req, res) => {
        Article.findOneAndUpdate({
                title: req.params.articleTitle
            }, {
                $set: {
                    title: req.body.title,
                    content: req.body.content
                }
            }, {
                new: true
            },
            (err, article) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Success - Article Updated.");
                }
            }
        );
    })
    .patch((req, res) => {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            err => {
                if (!err) res.send("Success - Article Updated.");
                else res.send(err);
            }
        );
    })
    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle}, function (err) {
            if (!err) {
                res.send("Success - Selected Article Deleted.");
            } else {
                res.send(err);
            }
        });
    });




// Listen

app.listen(3000, () => {
    console.log("Server started port 3000");
});