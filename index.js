const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();

app.set("port", 4000);
app.listen(app.get("port"), () => console.log(`Listening on port ${app.get("port")}`));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());


app.use(express.static("dist"));

app.get("*", function (req, res) {
  res.send("index.html")
})
