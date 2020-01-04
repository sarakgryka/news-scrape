let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");
let axios = require("axios");
let cheerio = require("cheerio");
var exphbs = require('express-handlebars');


let app = express();
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

let db = require("./models");

let PORT = 3000;
let MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/mongoHeadlines"



app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGO_URI, { useNewUrlParser: true });

app.get("/scrape", function (req, res) {

    console.log("ax")
    axios.get("http://www.usatoday.com").then(function (response) {



        let $ = cheerio.load(response.data);



        $("a.gnt_m_tli").each(function (i, element) {


            let title = $(element).find("span").text();
            console.log(title)
            let link = $(element).attr("href");

            let summary = $(element).find("div.gnt_m_tli_c").attr("data-c-br")

            var results = {
                title: title,
                link: link,
                summary: summary
            };

            console.log(results)

            db.Article.create(results)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });

        })



        res.send("scrape done")

    })




})

app.get("/articles", function (req, res) {


    db.Article.find({


    }).then(function (data) {

        res.json(data);
    })
})

app.get("/", function (req, res) {
    db.Article.find({

    })
        .then(function (data) {
            let articlesHandle = { data: data }

            res.render("index", articlesHandle)
        })
})

app.get("/saved", function (req, res) {
    db.Article.find({

    })
        .populate("Note")
        .then(function (data) {
            let articlesHandle = { data: data }

            res.render("saved", articlesHandle)
        })
})
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        // ..and populate all of the notes associated with it
        .populate("Note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.put("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Article.updateOne({ _id: req.params.id }, { $set: { saved: true } })

    
    // console.log(req)

});

app.post("/articles/:id", function (req, res) {

    db.Note.create(req.body)

        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
      
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});