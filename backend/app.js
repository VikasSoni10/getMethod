const express = require("express");
const app = express();

app.use(express.json());
const item = require("./routes/itemRoute")

app.use("/api/v1",item);

module.exports = app;