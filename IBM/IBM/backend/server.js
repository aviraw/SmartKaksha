require("dotenv").config();

var mysql = require('mysql');

const path = require('path');

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const utils = require("./utils");
const { type } = require("os");

const app = express();
const port = process.env.PORT || 4000;

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password:'',
	database:'smartkaksh_db1'
});

connection.connect(function(error){
	if(!!error){
		console.log(error);
	} else {
		console.log('Connected');
	}
});

var userData = new Array(2);
 var flag=0;
 var stlen;
 var telen;

// static user details
/* const userData = [{
	userId: "789789",
	password: "123456",
	name: "Smart Student 1",
	username: "smartstudent1",
	isAdmin: true,
},{
	userId: "789789",
	password: "123456",
	name: "Smart Student 2",
	username: "smartstudent2",
	isAdmin: true,
}];

const userData1 = [{
	userId: "789789",
	password: "123456",
	name: "Smart Teacher 1",
	username: "smartteacher1",
	isAdmin: true,
},{
	userId: "789789",
	password: "123456",
	name: "Smart Teacher 2",
	username: "smartteacher2",
	isAdmin: true,
}]; */

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//middleware that checks if JWT token exists and verifies it if it does exist.
//In all future routes, this helps to know if the request is authenticated or not.
app.use(function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.headers["authorization"];
	if (!token) return next(); //if no token, continue

	token = token.replace("Bearer ", "");
	jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
		if (err) {
			return res.status(401).json({
				error: true,
				message: "Invalid user.",
			});
		} else {
			req.user = user; //set the user to req so other routes can use it
			next();
		}
	});
});

//fetch data from db
// fetch student tables
app.get('/student',function(req,resp){

	connection.query("SELECT * FROM student",function(error,rows,fields){
		if(error){
 		console.log(error);
 	} else {
		 stlen=rows.length;
		 userData[0]=new Array(rows.length);

		 for(var i=0;i<rows.length;i++)
		 {
			 userData[0][i]=rows[i];
			// console.log("std data: ", userData[0][1]);
		 }
 		
 		resp.send(rows);		
		// console.log(rows[0]);	
 	}
	});
})


//fetch teachers table

app.get('/teacher',function(req,resp){

	connection.query("SELECT * FROM teacher",function(error,rows,fields){
		if(error){
 		console.log(error);
 	} else {
		 telen=rows.length;
		 userData[1]=new Array(rows.length);
		console.log(typeof(userData[1]));
		 for(var i=0;i<rows.length;i++)
		 {
			 userData[1][i]=rows[i];
		 }
 		//console.log(userData[0][1].ST_Firstname);
 		resp.send(rows);		
		 //console.log(userData[1][0]);
		// console.log(rows[0]);	
 	}
	});
})
console.log(userData);

// request handlers
app.get("/", (req, res) => {
	if (!req.user)
		return res
			.status(401)
			.json({ success: false, message: "Invalid user to access it." });
	res.send("Welcome to the Smart Kaksha - " + req.user.name);
});

// validate the user credentials
app.post("/users/signin", function (req, res) {
	const user = req.body.username;
	const pwd = req.body.password;
	const user_type = req.body.user_type;

	console.log(user,pwd,user_type)

	// return 400 status if username/password is not exist
	if (!user || !pwd || !user_type) {
		return res.status(401).json({
			error: true,
			message: "Username or Password required.",
		});
	}

	// return 401 status if the credential is not match.
	var i;

	if(user_type=="student")
	{
		for(i=0;i<userData[0].length;i++)
		{
			if (user ==userData[0][i].ST_Username && pwd == userData[0][i].ST_Password)
			{flag=1;
					// generate token
			const token = utils.generateToken(userData[0][i]);
			// get basic user details
			const userObj = utils.getCleanUser(userData[0][i]);
			// return the token along with user details
			return res.json({ user: userObj, token });
			}
		}
		if(flag==0)
		{
			return res.status(401).json({
				 		error: true,
			 			message: "Username or Password is Wrong.",
				 	});
		}
	}

	else if(flag==0)
	{
		return res.status(401).json({
					 error: true,
					 message: "Username or Password is Wrong.",
				 });
	}

	/* else
	{
		return res.status(401).json({
			error: true,
			message: "Username or Password is Wrong.",
		});

	} */

	else if(user_type=="teacher")
	{
		for(i=0;i<userData[1].length;i++)
		{
			if (user == userData[1][i].TE_Emailid && pwd == userData[1][i].TE_Password)
			{flag=1;
				// generate token
			const token = utils.generateToken(userData[1][i]);
			// get basic user details
			const userObj = utils.getCleanUser(userData[1][i]);
			// return the token along with user details
			return res.json({ user: userObj, token });
			}

		}
		if(flag==0)
		{
			return res.status(401).json({
				 		error: true,
			 			message: "Username or Password is Wrong.",
				 	});
		}
	}

	else if(flag==0)
	{
		return res.status(401).json({
					 error: true,
					 message: "Username or Password is Wrong.",
				 });
	}
	
});

// verify the token and return it if it's valid
app.get("/verifyToken", function (req, res) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token;
	if (!token) {
		return res.status(400).json({
			error: true,
			message: "Token is required.",
		});
	}
	// check token that was passed by decoding token using secret
	jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
		if (err)
			return res.status(401).json({
				error: true,
				message: "Invalid token.",
			});

		// return 401 status if the userId does not match.
		if (user.userId !== userData.userId) {
			return res.status(401).json({
				error: true,
				message: "Invalid user.",
			});
		}
		// get basic user details
		var userObj = utils.getCleanUser(userData);
		return res.json({ user: userObj, token });
	});
});

app.listen(port, () => {
	console.log("Server started on: " + port);
});