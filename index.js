/*************************************************************
* Name: Jacob Anderson, John Rudolph
* Group: 7
* Name: Fighting Flamingos
* Date: February 5, 2020
* Project: Climbing Route Repository
*************************************************************/

//First, setting up all the necessary modules
//Heavily inspired by the CS290 lectures and Jacob's previous
//CS361 project from Fall term 2019.

let express = require('express');
let mysql = require('./dbcon.js');

let app = express();
let handlebars = require('express-handlebars').create({defaultLayout:'main'});
let session = require('express-session');
let bodyParser = require('body-parser');
let passport = require('passport');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8513);

//At some point, I will add login functionality here

//Render the home page
app.get('/', function(req, res, next) {
	let context = {};
	res.render('home', context);
});

app.use(function(req, res) {
	let context = {};
	context.layout = 'blank';
	res.status(404);
	res.render('404', context);
});

app.use(function(req, res) {
	let context = {};
	context.layout = 'blank';
	console.error(err.stack);u
	res.status(500);
	res.render('500', context);
});

app.listen(app.get('port'), function() {
	console.log('Web server has begun running on port ' + app.get('port') + '. Press Ctrl+C to quit.');
});
