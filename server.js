const express = require('express');
var createError = require('http-errors')
var cors = require('cors');
const path = require('path');
var logger = require('morgan');

const app = express();
require('dotenv').config({ path: path.resolve(__dirname + '/.env') });

// cors
var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json({ limit: '50mb' }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//log the api success
app.use(logger('dev'));

app.use(express.static(path.resolve(__dirname + '/client/build')));

//create table in database.
// const db = require("./server/models");
// db.sequelize.sync();
require("./server/routes/index")(app)

app.get('/api', (req, res) => {
  res.send("Welcome to Bucket APIs")
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/client/build/index.html'));
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return next(createError(404, "This resource was not found"));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(404).json({
    "status": false,
    "statuscode": err.status,
    "message": err.message
  });
});

//Set Port
var PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  console.log(`Connected..Server is running on port ${PORT}.`);
});