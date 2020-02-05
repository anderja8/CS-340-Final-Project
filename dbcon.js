//Standard JS file to initialize connection
//to the database. Taken from the CS290 lectures.

var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit	: 10,
	host		: 'classmysql',
	user		: 'cs340_anderja8',
	password	: '8513',
	database	: 'cs340_anderja8',
	dateStrings	: 'date'
});

module.exports.pool = pool;
