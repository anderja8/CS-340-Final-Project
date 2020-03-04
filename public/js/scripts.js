/***********************************************************
 * Function to add a state to the database. Triggered by the
 * button in the add state form on the browse states page.
 * Passes the form data to index.js and then waits for a
 * response from the server. On a successful response,
 * refreshes the page. On a failed response, alerts the
 * client.
 **********************************************************/
function addState() {
	event.preventDefault();
	
	//Create the request
	var req = new XMLHttpRequest();
	req.open("POST", '/add_state', true);
	req.setRequestHeader('Content-Type', 'application/json');
	
	if (document.getElementById('state').value == "") {
		alert("Please enter a state name.");
		return;
	}	

	//Workaround because the required attribute is acting finicky on my machine
	var reqData = {
		state:document.getElementById('state').value
	}

	//Send the request
	req.send(JSON.stringify(reqData));

	//Wait on a response from the server. Will be either 1 (OK) or 0 (Error)
	req.addEventListener('load', function() {
		if (req.status < 200 && req.status > 400) {
			alert("Network error: server could not make contact with database.");
		}
		else {
			var retData = JSON.parse(req.responseText);
			if (retData["resValue"] == 0) {
				alert("Error: invalid form inputs. Please correct form inputs and try again." +
				"State names must be less than 255 characters");
			}
			else {
				window.location.reload();
			}
		}
	});
}

/***********************************************************
 * Function to add an area to the database. Triggered by the
 * button in the add area form on the browse areas page.
 * Passes the form data to index.js and then waits for a
 * response from the server. On a successful response,
 * refreshes the page. On a failed response, alerts the
 * client.
 **********************************************************/
function addArea() {
	//Create the request
	var req = new XMLHttpRequest();
	req.open("POST", '/add_area', true);
	req.setRequestHeader('Content-Type', 'application/json');
	
	if (document.getElementById('area').value == "" || document.getElementById('approach').value == "") {
		alert("Please ensure area name and approach are entered.");
		return;
	}

	//Workaround because the required attribute is acting finicky on my machine
	var reqData = {
		state_id:document.getElementById('state').value,
		name:document.getElementById('area').value,
		approach:document.getElementById('approach').value
	}

	//Send the request
	req.send(JSON.stringify(reqData));

	//Wait on a response from the server. Will be either 1 (OK) or 0 (Error)
	req.addEventListener('load', function() {
		if (req.status < 200 && req.status > 400) {
			alert("Network error: server could not make contact with database.");
		}
		else {
			var retData = JSON.parse(req.responseText);
			if (retData["resValue"] == 0) {
				alert("Error: invalid form inputs. Please correct form inputs and try again. " + 
				"Area names must be less than 255 characters and approach less than 10000.");
			}
			else {
				window.location.reload();
			}
		}
	});
	event.preventDefault();
}

/***********************************************************
 * Function to add a route to the database. Triggered by the
 * button in the add route form on the browse routes page.
 * Passes the form data to index.js and then waits for a
 * response from the server. On a successful response,
 * refreshes the page. On a failed response, alerts the
 * client.
 **********************************************************/
function addRoute() {
	event.preventDefault();
	
	//Create the request
	var req = new XMLHttpRequest();
	req.open("POST", '/add_route', true);
	req.setRequestHeader('Content-Type', 'application/json');
	var reqData = {
		route_title:document.getElementById('title').value,
		area_id:document.getElementById('area').value,
		overview:document.getElementById('overview').value,
		grade:document.getElementById('grade').value,
		type:document.getElementById('type').value,
		approach:document.getElementById('approach').value,
		latitude:document.getElementById('lat').value,
		longitude:document.getElementById('long').value,
		first_ascent:document.getElementById('fa').value,
		first_ascent_date:document.getElementById('fa_date').value,
		pitch_count:document.getElementById('pitch').value
	}

	//Workaround because the required attribute is acting finicky on my machine
	if (document.getElementById('title').value == "" || document.getElementById('overview').value == "" ||
		document.getElementById('grade').value == "" || document.getElementById('approach').value == "" ||
		document.getElementById('pitch').value == "") {
		alert("Please ensure route title, overview, grade, approach, and pitch are entered.");
		return;
	}


	//Send the request
	req.send(JSON.stringify(reqData));

	//Wait on a response from the server. Will be either 1 (OK) or 0 (Error)
	req.addEventListener('load', function() {
		if (req.status < 200 && req.status > 400) {
			alert("Network error: server could not make contact with database.");
		}
		else {
			var retData = JSON.parse(req.responseText);
			if (retData["resValue"] == 0) {
				alert("Error: invalid form inputs. Please correct form inputs and try again. ");
			}
			else {
				window.location.reload();
			}
		}
	});
}

/***********************************************************
 * Function to add a user to the database. Triggered by the
 * SignUp button in the Register form on the login page.
 * Passes the form data to index.js and then waits for a
 * response from the server. On a successful response,
 * refreshes the page. On a failed response, alerts the
 * client.
 **********************************************************/
function addUser(){
	document.getElementById('signUpButton').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		var reqData = {
			first_name:document.getElementById('logInFirstName').value,
			last_name:document.getElementById('logInLastName').value,
			username:document.getElementById('logInUserName').value,
			password:document.getElementById('logInPassword').value,
			state_id:document.getElementById('logInState').value
		}
		req.open('POST', '/login/post', true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function(){
			if (req.status < 200 && req.status > 400) {
				alert("Network error: server could not make contact with database.");
			}
			else {
				var retData = JSON.parse(req.responseText);
				if (retData["resValue"] == 0) {
					alert("Error: invalid form inputs. Please correct form inputs and try again." +
					"State names must be less than 255 characters");
				}
				else {
					window.location.href="/";
				}
			}
		});
		req.send(JSON.stringify(reqData));
		event.preventDefault();
	});
};

function updateUser() {
	console.log("Function updateUser() was called.")
}

function deleteUser() {
	console.log("Function deleteUser() was called.")
}

/********************************************************************************
 * Function to add a route rating to the database. Triggered by the
 * SaveRating button in the Provide Route Rating form on the Route Details page.
 * Passes the form data to index.js and then waits for a
 * response from the server. On a successful response,
 * refreshes the page. On a failed response, alerts the
 * client.
 ********************************************************************************/
function addRating() {
	document.getElementById('addRatingButton').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		var reqData = {
			rating:document.getElementById('rating').value
		}
		req.open('POST', '/add_rating', true);
		req.setRequestHeader('Content-Type', 'application/json');
		req.addEventListener('load', function(){
			if (req.status < 200 && req.status > 400) {
				alert("Network error: server could not make contact with database.");
			}
			else {
				var retData = JSON.parse(req.responseText);
				if (retData["resValue"] == 0) {
					alert("Error: invalid form inputs. Please correct form inputs and try again." +
					"State names must be less than 255 characters");
				}
				else {
					window.location.reload();
				}
			}
		});
		req.send(JSON.stringify(reqData));
		event.preventDefault();
	});
};

/********************************************************************************
 * Function to update a user's rating. Triggered by browsing to the user's profile
 * page and clicking the "Update Rating" button next to the user's rating of a 
 * particular route. Note: This will only appear if the user has actually rated
 * a route and saved that rating to the database, which is first done on the route
 * details page. On a successful response from the server,refreshes the page. On a
 * failed response, alerts the client.
 ********************************************************************************/
function updateRating(route_num) {
	event.preventDefault();
	
	//Create the request
	var req = new XMLHttpRequest();
	req.open("POST", '/update_rating', true);
	req.setRequestHeader('Content-Type', 'application/json');

	if (document.getElementById('rating_' + route_num).value == "") {
		alert("Please enter a rating for the route.");
		return;
	}
	
	//Build the payload
	var reqData = {
		route_id:route_num,
		rating:document.getElementById('rating_' + route_num).value
	}



	//Send the request
	req.send(JSON.stringify(reqData));

	//Wait on a response from the server. Will be either 1 (OK) or 0 (Error)
	req.addEventListener('load', function() {
		if (req.status < 200 && req.status > 400) {
			alert("Network error: server could not make contact with database.");
		}
		else {
			var retData = JSON.parse(req.responseText);
			if (retData["resValue"] == 0) {
				alert("Error: invalid form inputs. Please correct form inputs and try again.");
			}
			else {
				window.location.reload();
			}
		}
	});
}

function deleteRating() {
	console.log("Function deleteRating() was called.")
}

