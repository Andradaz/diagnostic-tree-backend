var createError = require('http-errors')
var express = require('express')
var cors = require('cors')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var app = express();
app.use(cors())



var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var diagram = require('./routes/diagram.route')
var diagnostic = require('./routes/diagnostic.route')

const dotenv = require('dotenv')
dotenv.config();
var mongoose = require('mongoose')
var mongoDB = process.env.MONGOURL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function() {
  console.log('Successfully connected to MongoDB using Mongoose!')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/diagram', diagram)
app.use('/diagnostic', diagnostic)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

module.exports = app
