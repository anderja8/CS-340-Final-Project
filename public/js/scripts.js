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
				window.location.href="/browse_states";
			}
		}
	});
}

//Complete for Step 5
function addArea() {
	console.log("Function addArea() was called.")
}

//Complete for Step 5
function addRoute() {
	console.log("Function addRoute() was called.")
}


//Complete for Step 5 - John does this one

function addUser(){
	document.getElementById('signUpButton').addEventListener('click', function(event){
		var req = new XMLHttpRequest();
		let firstName = document.getElementById('logInFirstName').value;
		let lastName = document.getElementById('logInLastName').value;
		let userName = document.getElementById('logInUserName').value;
		let password = document.getElementById('logInPassword').value;
		let state = document.getElementById('logInState').value;
		let payload = firstName + ' ' + lastName + ' ' + userName + ' ' + password + ' ' + state;
		req.open('POST', 'http://flip2.engr.oregonstate.edu:8001/login/post', true);
		req.setRequestHeader('Content-Type', 'application/json');
	req.addEventListener('load', function(){
		if(req.status >= 200 && req.status < 400){
			res.redirect('/');
	  	} else {
			console.log("Error in network request: " + req.statusText);
		  }
		});
	req.send(JSON.stringify(payload));
	event.preventDefault();
})}

function updateUser() {
	console.log("Function updateUser() was called.")
}

function deleteUser() {
	console.log("Function deleteUser() was called.")
}

//Complete for Step 5 - John does this one 
// I think this is mostly right? Not sure if the method needs to make a get request or not.
function addRating() {
	document.getElementById('addRatingButton').addEventListener('click', function(event){
	rating = document.getElementById('rating').value;
	stQry = 'update Users_Routes set rating = '+ rating + ' where user_id = :loggedInUser'; // not sure how to retreive user_id of logged in user
	mysql.pool.query(stQry,function(err, rows, fields){
		if (err) {
			console.log(result); 
			} 
		}
	)}
)};

function updateRating() {
	console.log("Function updateRating() was called.")
}

function deleteRating() {
	console.log("Function deleteRating() was called.")
}

