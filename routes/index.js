var express = require('express');
var router = express.Router();
const passport = require('passport');


var config = require('../config/config')
var request = require('request')
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

const env = {
  AUTH0_CLIENT_ID: 'Ra_Fi5ZaAbpyRZDRD7x2fLeIaVAWgo0I',
  AUTH0_DOMAIN: 'smdigitalcrafts.auth0.com',
  AUTH0_CALLBACK_URL: 'http://localhost:3000/welcome'
};



var connection = mysql.createConnection({
	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database
});
connection.connect((error)=>{
	if (error){
		throw error;
	}
	console.log(error);
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Whadup playa!");
  res.render('index', { title: 'Express' });
});

router.get('/users', (req, res, next)=>{
    var name = req.session.name;
    res.render('users',{
        name: name,
})
});


router.get('/register', function(req,res,next){
	res.render('register', {})
});

router.get('/hello', function(req,res,next){

	res.render('hello', {})
});

router.get('/profileX', function(req,res,next){

	console.log((req.session) + "****");
	res.render('profile', {user: req.session})
});


// router.get('/profileX', function(req,res,next){

// 	var email = req.body.email;
// 	console.log(email);

// 	var selectQuery = `SELECT * FROM users WHERE email = ?;`;


// 	connection.query(selectQuery,[email],(error,results)=>{
// 		if(error){
// 			throw error;
// 		}else{
// 			if(email === results[0].email){
// 				req.session.name = results[0].name;
// 				req.session.email = results[0].email;
// 				res.redirect('/profile');
// 				console.log(results[0]);
// 			}else{
// 				res.redirect('/login');
// 			}
// 		}
// 	})
	

// });


router.get('/login', function(req,res,next){
	res.render('login', {})
});

router.get('/welcome',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {

    console.log("EMAIL: " + req.session.passport.user.emails[0].value);
    console.log("NAME: " + (req.session.passport.user.name.givenName + " " + req.session.passport.user.name.familyName));

    // console.log(req.user);
    // res.redirect(req.session.returnTo || '/user');
    res.redirect('/loginProcessX');
  }
);

router.post('/registerProcess', (req,res, next)=>{
	// res.json(req.body);

	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var insurance = req.body.insurance;
	var street_address = req.body.address;
	var city = req.body.city;
	var state = req.body.state;
	var zip_code = req.body.zip;
	var phone = req.body.phone;
	
	var insuranceID = config.insurance_ID[insurance];


			console.log(insurance);
			console.log(phone);

	const selectQuery = "SELECT * FROM users WHERE email = ?;";
	connection.query(selectQuery,[email],(error,results)=>{
		if(results.length != 0){
			res.redirect('/login?msg=registered');
		}else{
			var hash = bcrypt.hashSync(password);

			var insertQuery = `INSERT INTO users (name, email, password, street_address, city, state, zip_code, phone, insurance, insurance_ID) VALUES (?,?,?,?,?,?,?,?,?,?);`;
		}
			connection.query(insertQuery,[name, email, hash, street_address, city, state, zip_code, phone, insurance, insuranceID], (error)=>{
				if (error){
					throw error;

				}else{
					res.redirect("/login");
				}
			});
	// 	}else{
	// 		res.redirect("/?msg=fail");
	// 	}
	});
});


router.post('/loginProcess', (req,res,next)=>{
	// res.json(req.body);

	var email = req.body.email;
	var password = req.body.password;

	var selectQuery = `SELECT * FROM users WHERE email = ?;`;
	console.log(email);
	connection.query(selectQuery,[email],(error,results)=>{
		if(error){
			throw error;
		}else {
			if(results.length == 0){
				res.redirect('/login?msg=badUser');
				console.log("NO SUCH USER")
			}else{
				// call compareSync
				var passwordMatch = bcrypt.compareSync(password,results[0].password);
				if(passwordMatch){
					req.session.name = results[0].name;
					req.session.uid = results[0].id;
					req.session.email = results[0].email;
					req.session.address = results[0].address;
					req.session.city = results[0].city;
					req.session.state = results[0].state;
					req.session.zip = results[0].zip;
					req.session.phone = results[0].phone;
					req.session.insurance = results[0].insurance
					res.redirect('/profileX');
					console.log(results[0]);

				}else{
					res.redirect('/login?msg=badPassword');
				}
			}
		}
	});



});

router.get(
  '/loginX',
  passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
    responseType: 'code',
    scope: 'openid profile email'
  }),
  function(req, res) {
    res.redirect('/loginProcessX');
  }
);

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


router.get('/loginProcessX', (req,res,next)=>{
	// res.json(req.body);

	var email = req.session.passport.user.emails[0].value;

	var selectQuery = `SELECT * FROM users WHERE email = ?;`;
	console.log(email);
	connection.query(selectQuery,[email],(error,results)=>{
		if(error){
			throw error;
		}else {
			if(results.length == 0){
				res.redirect('/register?msg=badUser');
				// res.send("That email is not registered.");

				console.log("NO SUCH USER")
			}else{
				// call compareSync
				// var emailMatch = compareSync(email,results[0].email);

				if (email === results[0].email){
					req.session.name = results[0].name;
					req.session.uid = results[0].id;
					req.session.email = results[0].email;
					req.session.address = results[0].address;
					req.session.city = results[0].city;
					req.session.state = results[0].state;
					req.session.zip = results[0].zip;
					req.session.phone = results[0].phone;
					req.session.insurance = results[0].insurance
					res.redirect('/profileX');
					console.log(results[0]);

				}else{
					res.redirect('/login?msg=badPassword');
					res.render("That email is not registered.");
					console.log("GET OUT");
				}
			}
		}
	});
});

// Perform the final stage of authentication and redirect to '/user'
// router.get(
//   '/callback',
//   passport.authenticate('auth0', {
//     failureRedirect: '/'
//   }),
//   function(req, res) {
//     res.redirect(req.session.returnTo || '/user');
//   }
// );






module.exports = router;
