const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbURL = "mongodb://localhost:27017/cutto";
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlDataSchema = {
  _id: String,
  url: String,
};

const URLData = mongoose.model("urlmap", urlDataSchema);
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.redirect("https://rimoncodes.com");
});

app.post("/", (req, res) => {
  const protocol = req.body.protocol;
  const inputURL = req.body.inputURL;
  const inputPath = req.body.inputPath;
  if (inputPath == "about" || inputPath == "contact") {
    res.render("failure", { failureMessage: "Desired URL already exists" });
  } else {
    const toBeShorten = protocol + "://" + inputURL;
    const tempData = new URLData({
      _id: inputPath,
      url: toBeShorten,
    });
    const shortLink = "localhost:3000/" + inputPath;
    tempData.save((err) => {
      if (err) {
        let error = "We have encountered some error. We apologize for it.";
        if (err.code === 11000) {
          error = "Desired URL already exists.";
        }
        res.render("failure", { failureMessage: error });
      } else {
        res.render("success", { shortenedURL: shortLink });
      }
    });
  }
  //console.log(toBeShorten + inputPath);
  //res.redirect("/");
});

app.get("/:params", (req, result) => {
  const param = req.params.params;
  URLData.findOne({ _id: param }, (err, res) => {
    if (err) {
      console.log("Something went wrong");
    } else {
      if (!res) {
      } else {
        result.redirect(res.url);
      }
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server started and is running at port 3000.");
});
