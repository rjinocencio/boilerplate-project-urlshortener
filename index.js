require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("dns");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

const directory = {};

function urlshorter(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
}

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res) => {
  const httpRegex = /^(http|https)(:\/\/)/;
  if (!httpRegex.test(req.body.url)) {
    return res.json({ error: "invalid url" });
  }
  if (!httpRegex.test(req.body.url)) return res.json({ error: "invalid url" });
  const original_url = new URL(req.body.url);
  dns.lookup(original_url.hostname, (err, address) => {
    if (err) return res.json({ error: "invalid url" });
    const short_url = urlshorter(9);
    directory[short_url] = req.body.url;
    res.json({
      original_url: req.body.url,
      short_url: short_url,
    });
  });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = req.params.shorturl;
  const original_url = directory[shorturl];
  res.redirect(301, original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
