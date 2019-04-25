require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');


require('./database');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');



// Static Folder
app.use('*/js', express.static(path.join(__dirname, 'public/assets/js')))
app.use('*/css', express.static(path.join(__dirname, 'public/assets/css')))
app.use('*/images', express.static(path.join(__dirname, 'public/assets/images')))
app.use('*/fonts', express.static(path.join(__dirname, 'public/assets/fonts')))
app.use(express.static(path.join(__dirname, 'public')));
//app.use(favicon(path.join(__dirname, 'public/assets', 'favicon.ico')))

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

// Global Variables
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
  });

// routes
app.use(require('./routes'));
app.use(require('./routes/notes'));

// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('partials/errors', {
		message: err.message,
		error: err
	  });
	});
} else {
	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		if(err.status === 401){
			res.end(err.message);
		  
		}
		res.redirect('/');
	});
}
app.listen(process.env.PORT || 3000);
console.log('Server started at http://localhost:3000/');

module.exports = app;
