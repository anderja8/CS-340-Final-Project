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

//Render the browse states page
app.get('/browse_states', function(req, res, next) {
	mysql.pool.query("select state, state_id from States order by state desc",function(err, rows, fields){
		if (err) {
			console.log("Error querying States.")
		}

		context = [];
		context.results = rows;
		res.render('browse_states', context);
	});
});

//Render the browse areas page
app.get('/browse_areas', function(req, res, next) {

	//Setting up the queries to render the page data
	arQry = "select ar.area_id, ar.state_id, ar.name, ar.approach, st.state ";
	arQry += "from Areas ar left join States st on ar.state_id = st.state_id ";
	stQry = "select state, state_id from States "
	

	//If the user reached this page from the state browsing page, filter by selected state
	if (req.query.state_id != undefined) {
		arQry += "where ar.state_id = ? ";
		stQry += "where state_id = ? ";
	}

	arQry += "order by state desc, name desc ";
	stQry += "order by state desc ";

	//Query for areas
	mysql.pool.query(arQry, req.query.state_id, function(err, rows, fields){
		if (err) {
			console.log("Error querying Areas.");
			console.log("Qry was: " + qry);
			console.log("state_id was: " + req.query.state_id);
		}
		
		context = [];
		context.results = rows;
		
		//Query for which states to include in select list for area addition form
		mysql.pool.query(stQry, req.query.state_id, function(err, rows, fields){
			if (err) {
				console.lod("Error querying states")
				console.log("Qry was: " + stQry);
				console.log("state_id was: " + req.query.state_id);

			}
			context.states = rows;

			//If we're filtering by a state_id, pass that to context so we can tell the user
			if (req.query.state_id != undefined) {
				context.state_chosen = 1;
			}
			
			//Render the page
			res.render('browse_areas', context);
		});
	});
});

//Render the login page
app.get('/login', function(req, res, next) {
	let context = {};
	res.render('login', context);
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
