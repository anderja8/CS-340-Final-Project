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
app.set('port', 8001);

app.use(express.static('public'));

//Adding login functionality
//Pulled this version of login functionality verbatim from Jacob's
//previous CS361 project
app.use(session({
	secret: 'routeSecret',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Render the home page
app.get('/', function(req, res, next) {
	let context = {};
	if (req.session.userid) {
		context.user = req.session.name;
	}
	res.render('home', context);
});

//Render the browse states page
app.get('/browse_states', function(req, res, next) {
	stQry = "select st.state, st.state_id, NVL(ar.area_count, 0) as area_count from States st ";
	stQry += "left join ( ";
	stQry += "	select count(area_id) area_count, state_id from Areas group by state_id ";
	stQry += ") ar on ar.state_id = st.state_id ";
	stQry += "order by st.state asc";
	mysql.pool.query(stQry,function(err, rows, fields){
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
	arQry = "select ar.area_id, ar.state_id, ar.name, ar.approach, st.state, ";
	arQry += "NVL(rt.route_count, 0) as route_count ";
	arQry += "from Areas ar left join States st on ar.state_id = st.state_id ";
	arQry += "left join ( ";
	arQry += "	select count(route_id) as route_count, area_id from Routes group by area_id ";
	arQry += ") rt on rt.area_id = ar.area_id ";
	stQry = "select state, state_id from States "
	

	//If the user reached this page from the state browsing page, filter by selected state
	if (req.query.state_id != undefined) {
		arQry += "where ar.state_id = ? ";
		stQry += "where state_id = ? ";
	}

	arQry += "order by st.state asc, ar.name asc ";
	stQry += "order by state asc ";

	//Query for areas
	mysql.pool.query(arQry, req.query.state_id, function(err, rows, fields){
		if (err) {
			console.log("Error querying Areas.");
			console.log("Qry was: " + arQry);
			console.log("state_id was: " + req.query.state_id);
		}
		
		context = [];
		context.results = rows;
		
		//Query for which states to include in select list for area addition form
		mysql.pool.query(stQry, req.query.state_id, function(err, rows, fields){
			if (err) {
				console.log("Error querying states")
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

//Render the browse routes page (Extremely similar to the browse areas page)
app.get('/browse_routes', function(req, res, next) {

	//Setting up the queries to render the page data
	rtQry = "select rt.route_title, rt.route_id, rt.area_id, rt.overview, rt.grade, rt.type, rt.approach, ";
	rtQry += "rt.latitude, rt.longitude, rt.first_ascent, rt.first_ascent_date, rt.pitch_count, ar.name, ";
	rtQry += "st.state, ur.rating, NVL(ur.rating_count, 0) as rating_count ";
	rtQry += "from Routes rt ";
	rtQry += "left join Areas ar on ar.area_id = rt.area_id ";
	rtQry += "left join States st on st.state_id = ar.state_id ";
	rtQry += "left join ( ";
	rtQry += "	select ";
	rtQry += "	route_id, ";
	rtQry += "	round(avg(rating),1) as rating, ";
	rtQry += "	count(rating) as rating_count ";
	rtQry += "	from Users_Routes ";
	rtQry += "	group by route_id ";
	rtQry += "	) ur on ur.route_id = rt.route_id ";

	arQry = "select name, area_id from Areas "
	

	//If the user reached this page from the area browsing page, filter by selected area
	if (req.query.area_id != undefined) {
		rtQry += "where rt.area_id = ? ";
		arQry += "where area_id = ? ";
	}

	rtQry += "order by ar.name asc, rt.route_title asc ";
	arQry += "order by name asc ";

	//Query for routes
	mysql.pool.query(rtQry, req.query.area_id, function(err, rows, fields){
		if (err) {
			console.log("Error querying Routes.");
			console.log("Qry was: " + rtQry);
			console.log("route_id was: " + req.query.area_id);
		}
		
		context = [];
		context.results = rows;
		
		//Query for which states to include in select list for area addition form
		mysql.pool.query(arQry, req.query.area_id, function(err, rows, fields){
			if (err) {
				console.log("Error querying Areas")
				console.log("Qry was: " + arQry);
				console.log("state_id was: " + req.query.area_id);

			}
			context.areas = rows;

			//If we're filtering by a area_id, pass that to context so we can tell the user
			if (req.query.area_id != undefined) {
				context.area_chosen = 1;
			}
			
			//Render the page
			res.render('browse_routes', context);
		});
	});
});

//Post handler for creating new account
app.post('/login/post', function(req, res, next){
	if (req.query.buttonFunc == "SignUp") {
		qry = "insert into Users"
		qry += "(first_name, last_name, username, password, state_id)"
		qry += "values (?);"

		var context = {};
  		mysql.pool.query(qry, [req.query.c], function(err, result){
			if(err){
			next(err);
			return;
			}
			context.results = "first_name" + result.insertId;
			res.render('/',context);
		});
	}
});

//Render the login page, redirect if sign up or login submit buttons pressed
app.get('/login', function(req, res, next) {

	//If the user is trying to login, verify credentials, set session userid, and redirect to the home page
	if (req.query.buttonFunc == "Login") {
		qry = "select user_id, username, password, first_name, last_name from Users where username=? and password=?";
		mysql.pool.query(qry, [req.query.username, req.query.password], function(err, rows, fields) {
			//If the results length is 1, we found the user, set session values
			if (rows.length > 0) {
				req.session.userid = rows[0].user_id;
				req.session.name = rows[0].first_name + " " + rows[0].last_name;
				res.redirect('/');
			}
			//Otherwise, just refresh the page
			else {
				res.redirect('/login');
			}
		});
	}
	else {
		qry = "select state, state_id from States order by state asc";
		mysql.pool.query(qry, function(err, rows, fields) {
			if (err) {
				console.log("Error querying from States.");
			}
			
			context = [];
			context.results = rows;
			res.render('login', context);
		});
	}
});

//Check login credentials
app.get('/login/:username/:password', function(req, res, next) {
	let context = {};
});


//Render User profile page
app.get('/profile', function(req, res, next){
	res.render('profile')
	//need query results for user info
});

app.get('/route_details', function(req, res, next){

	//Setting up the queries to render the page data
	rtQry = "select rt.route_title, rt.route_id, rt.area_id, rt.overview, rt.grade, rt.type, rt.approach, ";
	rtQry += "rt.latitude, rt.longitude, rt.first_ascent, rt.first_ascent_date, rt.pitch_count, ar.name, ";
	rtQry += "st.state, ur.rating, ur.rating_count ";
	rtQry += "from Routes rt ";
	rtQry += "left join Areas ar on ar.area_id = rt.area_id ";
	rtQry += "left join States st on st.state_id = ar.state_id ";
	rtQry += "left join ( ";
	rtQry += "	select ";
	rtQry += "	route_id, ";
	rtQry += "	round(avg(rating),1) as rating, ";
	rtQry += "	count(rating) as rating_count ";
	rtQry += "	from Users_Routes ";
	rtQry += "	group by route_id ";
	rtQry += "	) ur on ur.route_id = rt.route_id ";

	mysql.pool.query(rtQry, req.query.route_id, function(err, rows, fields){
		if (err) {
			console.log("Error querying Routes.");
			console.log("Qry was: " + rtQry);
			console.log("route_id was: " + req.query.route_id);
		}
		
		context = [];
		context.results = rows;
		res.render('route_details', context)
	});
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

passport.serializeUser(function(user_id, done) {
	done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
	done(err, user);
});

//Helper function to convert empty strings to NULL
//Copied verbatim from Jacob's old CS361 project
function nullify(array) {
    for (key in array) {
        if (array[key] == "") {
            array[key] = null;
        }
    }
};
