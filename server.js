const express = require("express"),
  app = express();
require("dotenv").config();
app.use(express.json());
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const port = process.env.PORT;
const uri = process.env.URI;
const { db, mongoose } = require("./db");
db(uri).then(() => {
  app.listen(port, () => {
    console.log(`Congrats dev your app is running ${port}`);
  });
});
const route = require("./route");
app.use("/", route);