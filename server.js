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

app.post("/api/transitions", (req, res) => {
  return axios({
    method: "POST",
    url: "http://localhost:8000/transitions",
    data: req.body,
  })
    .then((data) => {
      return res.send("success!");
    })
    .catch((error) => {
      console.log(error);
      return res.send("error")
    });
});

app.delete("/api/transitions/:id", (req, res) => {
  return axios({
    method: "DELETE",
    url: `http://localhost:8000/transitions/${req.params.id}`,
    data: {}
  })
    .then(() => {
      return res.send("success!")
    })
    .catch((error) => {
      console.error(error);
      return res.send("error");
    })
})

app.post("/api/statuses", (req, res) => {
  return axios({
    method: "POST",
    url: "http://localhost:8000/statuses",
    data: req.body,
  })
    .then(() => {
      return res.send("success!");
    })
    .catch((error) => {
      console.error(error);
      return res.send("error")
    });
});

app.delete("/api/statuses/:stubName", (req, res) => {
  return axios({
    method: "DELETE",
    url: `http://localhost:8000/statuses/${req.params.stubName}`,
    data: {}
  })
    .then(() => {
      return res.send("success!");
    })
    .catch((error) => {
      console.error(error);
      return res.send("error")
    });
})

// fallthrough
app.get("*", function (req, res) {
  res.send("index.html")
});
