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

//Handle adding a state to the database
app.post('/add_state', function(req, res, next) {
	mysql.pool.query("insert into States (state) values (?)", req.body.state, function(err, result){
		if (err) {
			console.log("Error adding state to db. State name was: " + req.body.state);
			var payload = {resValue: 0}
			res.send(JSON.stringify(payload));
		}
		else {
			console.log("State created");
			var payload = {resValue: 1}
			res.send(JSON.stringify(payload));
		}
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

//Handle adding an area to the database
app.post('/add_area', function(req, res, next) {
	inQry = "insert into Areas (name, approach, state_id) values (?, ?, ?)";
	mysql.pool.query(inQry, [req.body.name, req.body.approach, req.body.state_id], function(err, result){
		if (err) {
			console.log("Error adding area to db.");
			var payload = {resValue: 0}
			res.send(JSON.stringify(payload));
		}
		else {
			console.log("Area created");
			var payload = {resValue: 1}
			res.send(JSON.stringify(payload));
		}
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

//Handle adding a route to the database
app.post('/add_route', function(req, res, next) {
	//Unlike the other browse pages, it's possible for NULL values to be passed through the routes form
	//We'll clean those NULL values by running the body array through nullify
	nullify(req.body);

	inQry = "insert into Routes (route_title, area_id, overview, grade, type, approach, latitude, longitude, ";
	inQry += "first_ascent, first_ascent_date, pitch_count) ";
	inQry += "values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
	mysql.pool.query(inQry, [req.body.route_title, req.body.area_id, req.body.overview, req.body.grade,
			req.body.type, req.body.approach, req.body.latitude, req.body.longitude,
			req.body.first_ascent, req.body.first_ascent_date, req.body.pitch_count],
			function(err, result){
		if (err) {
			var payload = {resValue: 0}
			res.send(JSON.stringify(payload));
		}
		else {
			console.log("Route created");
			var payload = {resValue: 1}
			res.send(JSON.stringify(payload));
		}
	});
});

//Post handler for creating new account
app.post('/login_post', function(req, res, next){
	qry = "insert into Users "
	qry += "(first_name, last_name, username, password, state_id) "
	qry += "values (?, ?, ?, ?, ?)"

	nullify(req.body);

	mysql.pool.query(qry, [req.body.first_name, req.body.last_name, 
			req.body.username, req.body.password, req.body.state_id], 
			function(err, result){
		if(err){
			var payload = {resValue: 0}
			res.send(JSON.stringify(payload));
		} else {
		qry = "select user_id, username, password, first_name, last_name from Users where username=? and password=?";
			mysql.pool.query(qry, [req.body.username, req.body.password], function(err, rows, fields) {
				//If the results length is 1, we found the user, set session values
				if (rows.length > 0) {
					req.session.username = rows[0].username;
					req.session.userid = rows[0].user_id;
					req.session.name = rows[0].first_name + " " + rows[0].last_name;
					var payload = {resValue: 1}
					res.send(JSON.stringify(payload));
				} 
				else {
					next(err)
					return;
				}
			});
		}});
});

// Handler to update user account info
app.post('/update_user', function(req, res, next) {

	urQry = "update Users set first_name = ?, last_name = ?, state_id = ? where user_id = ?",
	mysql.pool.query(urQry, [req.body.first_name, req.body.last_name, req.body.state_id, req.session.userid], function(err, result){
		if(err){
			console.log("Error updating Users.");
			console.log("userid: " + req.session.userid);
			var payload = {resValue: 0}
			res.send(JSON.stringify(payload));
		}
		else {
			console.log("User account updated.");
			var payload = {resValue: 1}
			res.send(JSON.stringify(payload));
		}
	});
});

//Handler to delete user account
app.post('/delete_user', function(req, res, next) {

	urQry = "delete from Users where user_id = ? ",
	mysql.pool.query(urQry, [req.session.userid], function(err, result){
		if(err){
			console.log("Error deleting User.");
			console.log("userid: " + req.session.userid);
			var payload = {resValue: 0}
			res.send(JSON.stringify(payload));
		}
		else {
			req.session.userid = '';
			console.log("Route rating deleted.");
			var payload = {resValue: 1}
			res.send(JSON.stringify(payload));
		}
	});
});


//Render the login page, redirect if sign up or login submit buttons pressed
app.get('/login', function(req, res, next) {

	//If the user is trying to login, verify credentials, set session userid, and redirect to the home page
	if (req.query.buttonFunc == "Login") {
		qry = "select user_id, username, password, first_name, last_name from Users where username=? and password=?";
		mysql.pool.query(qry, [req.query.username, req.query.password], function(err, rows, fields) {
			//If the results length is 1, we found the user, set session values
			if (rows.length > 0) {
				req.session.username = rows[0].username;
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

//Log the user out
app.get('/logout', function(req, res, next) {
	req.session.username = null;
	req.session.userid = null;
	req.session.name = null;
	let context = {};
	res.render('home', context);
});

//Render User profile page
app.get('/profile', function(req, res, next){
	//If the user is crafty and tries to access this page without a valid username, redirect to the login page
	if (typeof req.session.username == 'undefined') {
		res.redirect('/login');
	}
	else {
		stQry = "select st.state, st.state_id, "
		stQry += "case when ur.state_id is not null then 1 else 0 end as isUsrState "
		stQry += "from States st ";
		stQry += "left join ( "
		stQry += "	select state_id from Users where username = ? "
		stQry += ") ur on ur.state_id = st.state_id "
		stQry += "order by st.state asc ";
		usrQry = "select first_name, last_name, username, user_id, state_id from Users where username = ? ";
		
		mysql.pool.query(stQry, req.session.username, function(err, rows, fields){
			if (err) {
				console.log("Query was " + stQry);
				console.log("Error querying States within /profile request.");
			}
			
			context = [];
			context.states = rows;
			
			mysql.pool.query(usrQry, req.session.username, function(err, rows, fields){
				if (err) {
					console.log("Error querying Users within /profile request.");
				}
				else if (rows.length < 1) {
					console.log("Error, could not find user, sending to login page.");
					res.redirect('/login');
				}
				else {
					context.username = rows[0].username;
					context.user_first_name = rows[0].first_name;
					context.user_last_name = rows[0].last_name;
					context.user_state_id = rows[0].state_id;

					ratingQry = "select rt.route_id, rt.route_title, urt.rating ";
					ratingQry += "from Users_Routes urt ";
					ratingQry += "inner join Routes rt on urt.route_id = rt.route_id ";
					ratingQry += "where urt.user_id = ?";

					mysql.pool.query(ratingQry, req.session.userid, function(err, rows, fields) {
						if (err) {
							console.log("Error querying Users_Routes in /profile.");
						}
						
						context.ratings = rows;
						res.render('profile', context);
					});
				}
			});
		});
	}
});

app.post('/update_rating', function(req, res, next) {

	urQry = "update Users_Routes set rating = ? where route_id = ? and user_id = ?",
	mysql.pool.query(urQry, [req.body.rating, req.body.route_id, req.session.userid], function(err, result){
		if(err){
			console.log("Error updating Users_Routes.");
			console.log("rating: " + req.body.rating);
			console.log("route_id: " + req.body.route_id);
			console.log("userid: " + req.session.userid);
			var payload = {resValue: 0}
			res.send(JSON.stringify(payload));
		}
		else {
			console.log("Route rating updated.");
			var payload = {resValue: 1}
			res.send(JSON.stringify(payload));
		}
	});
});

app.post('/delete_rating', function(req, res, next) {

	urQry = "delete from Users_Routes where route_id = ? and user_id = ?",
	mysql.pool.query(urQry, [req.body.route_id, req.session.userid], function(err, result){
		if(err){
			console.log("Error deleting Users_Routes.");
			console.log("route_id: " + req.body.route_id);
			console.log("userid: " + req.session.userid);
			var payload = {resValue: 0}
			res.send(JSON.stringify(payload));
		}
		else {
			console.log("Route rating deleted.");
			var payload = {resValue: 1}
			res.send(JSON.stringify(payload));
		}
	});
});

app.post('/add_rating', function(req, res, next){
	addQry = "insert into Users_Routes (user_id, route_id, rating) values (?, ?, ?) ";
	addQry += "on duplicate key update rating=values(rating)";
	mysql.pool.query(addQry, [req.session.userid, req.body.route_id, req.body.rating, req.body.rating], function(err, result){
		if(err){
			console.log("Error adding rating to db.");
			var payload = {resValue: 0}
			res.send(JSON.stringify(payload));
		}
		else {
			console.log("Route rating created");
			var payload = {resValue: 1}
			res.send(JSON.stringify(payload));
		}
	})
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
	rtQry += ") ur on ur.route_id = rt.route_id ";
	rtQry += "where rt.route_id = ? ";

	mysql.pool.query(rtQry, req.query.route_id, function(err, rows, fields){
		if (err) {
			console.log("Error querying Routes.");
			console.log("Qry was: " + rtQry);
			console.log("route_id was: " + req.query.route_id);
		}
		
		context = [];
		context.results = rows;
		context.userid = req.session.userid;

		// If the user is not logged in, we'll render now, otherwise, get their old rating for
		// the route, if it exists, and send that as well
		if (req.session.userid == null) {	
			res.render('route_details', context);
		}
		else {
			usrQry = "select rating from Users_Routes where user_id = ? and route_id = ?";
			mysql.pool.query(usrQry, [req.session.userid, req.query.route_id], function(err, rows, fields){
				if (err) {
					console.log("Error querying Users_Routes.");
					console.log("userid: " + req.session.userid);
					console.log("route_id: " + req.query.route_id);
					res.render('route_details', context);
				}
				else if (rows.length == 0) {
					res.render('route_details', context);
				}
				else {
					context.user_rating = rows[0].rating;
					res.render('route_details', context);
				}
			});
		}
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
