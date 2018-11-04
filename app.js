var express = require('express');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');

var dbConfig = require('./db');
// Connect to DB
mongoose.connect(dbConfig.url);

// view engine setup
app.set('views', 'views');
app.set('view engine', 'ejs');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static('public'));

// Configuring Passport
var passport = require('passport');
var expressSession = require('cookie-session');
// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'gunnFBLA'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

require('./routes/index')(app, passport);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = "404";
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status).render(err.status, {title: "Sorry, page not found"});
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port http://localhost:' + server.address().port);
});

console.log(app.get('env'));
