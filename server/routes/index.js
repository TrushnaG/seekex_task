const express = require('express')
const app = express();

module.exports = function (app) {
  require("./bucket/bucket.routes")(app);
 
}
