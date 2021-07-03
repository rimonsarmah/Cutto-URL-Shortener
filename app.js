require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const shortid = require("shortid");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

mongoose.connect(
  "mongodb://localhost:27017/cuttoDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, success) => {
    if (!success) {
      console.log("Error");
    } else {
      console.log("Database connected");
    }
  }
);

const urlSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  link: String,
});

const shortenedUrls = new mongoose.model("shortenedurl", urlSchema);

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/receiveContact", (req, res) => {
  let senderName = req.body.senderName;
  let senderEmail = req.body.senderEmail;
  let message = req.body.message;
  var mailOptions = {
    from: "cutto@rimoncodes.com",
    to: "rimonsarmahjnv@gmail.com",
    subject: "New message on Cutto",
    text:
      "Email from: " +
      senderEmail +
      "(Name: " +
      senderName +
      ")\nMessage:\n" +
      message,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.render("messageSentStatus", {
        completionStatus: "Message Sending Failed",
        gradColor: "background: linear-gradient(#eb3349,#f45c43)",
        navBarGrad:
          "@media screen and (max-width:767px){background: linear-gradient(#eb3349,#f45c43)}",
      });
    } else {
      console.log(info);
      res.render("messageSentStatus", {
        completionStatus: "Message Sent",
        gradColor: "background: linear-gradient(#56ab2f, #a8e063)",
        navBarGrad:
          "@media screen and (max-width:767px){background: linear-gradient(#56ab2f, #a8e063)}",
      });
    }
  });
});
app.post("/generate", (req, res) => {
  const inputURL = req.body.inputURl;
  let newURL = shortenedUrls({
    _id: shortid.generate(),
    link: inputURL,
  });
  newURL
    .save()
    .then((result) => {
      console.log(result);
      res.render("result", {
        completionStatus: "URL Successfully Shortened",
        content:
          " Long URLs are not convenient for sharing and are not easy to understand. So, Cutto is here to offer you free URL shortening service. Here is your shortened URL!",
        gradColor: "background: linear-gradient(#56ab2f, #a8e063)",
        navBarGrad:
          "@media screen and (max-width:767px){background: linear-gradient(#56ab2f, #a8e063)}",
        shortenedURl: "cutto.link/" + result._id,
      });
    })
    .catch((result) => {
      console.log(result);
      res.render("result", {
        completionStatus: "Uh! Oh!",
        content: "It's not you. It's us",
        gradColor: "background: linear-gradient(#eb3349,#f45c43)",
        navBarGrad:
          "@media screen and (max-width:767px){background: linear-gradient(#eb3349,#f45c43)}",
        shortenedURl: "A mistake is to commit a misunderstanding",
      });
    });
});

app.get("/:link", (req, res) => {
  let inputLink = req.params.link;
  shortenedUrls.findOne({ _id: inputLink }, (err, found) => {
    if (found) {
      res.redirect(found.link);
    } else {
      res.render("404", {
        completionStatus: "404 : NOT FOUND",
        content: "Please check the URL",
        gradColor: "background: linear-gradient(#eb3349,#f45c43)",
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
