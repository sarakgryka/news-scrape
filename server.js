let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");
let axios = require("axios");
let cheerio = require("cheerio");

let db = require("./models");

let PORT = 3000;
let MONGO_URI = process.env.MONGO_URI || "mongodb://localhost/mongoHeadlines"

let app = express();

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

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});