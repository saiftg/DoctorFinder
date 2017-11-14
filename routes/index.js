var express = require('express');
var router = express.Router();
const passport = require('passport');


var config = require('../config/config')
var request_module = require('request')
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
const geocode = require('../geocode/geocode.js');



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
  // res.send("Whadup playa!");
  res.render('indexNew', { title: 'Express' });
});

router.get('/users', (req, res, next)=>{
    var name = req.session.name;
    res.render('users',{
        name: name,
})
});


router.post('/search', (request, response) =>{
    var zip = request.body.zip_code;
    var per_page = request.body.per_page;
    (per_page == undefined) ? per_page = 10 : per_page = per_page;
    var insurance = request.body.insurance;
    var specialty = request.body.Specialty;
    var specialty_id = config.specialtyID[specialty];
    var insuranceID = config.insurance_ID[insurance];

	console.log(specialty + ".......")
    console.log(specialty_id + ".......")
    console.log("we received form for: ", zip, per_page, insurance, specialty)
    // console.log(request.body)
    console.log("this is what we got from form", zip, per_page, insuranceID, specialty_id);
    geocode.geocodeAddress(zip).then((result)=>{
        var lat = result.latitude;
        var lng = result.longitute;
        console.log("api for guest search and", lat, lng)
        if (insuranceID == undefined || specialty_id == undefined){
        var baseURL = `https://api.betterdoctor.com/2016-03-01/doctors?location=${lat}%2C${lng}%2C100&skip=0&limit=${per_page}&user_key=b277ca758b6d6b1634f652b3010348e1`;
        }else{
        console.log("api for extended search")
        var baseURL = `https://api.betterdoctor.com/2016-03-01/doctors?specialty_uid=${specialty_id}&insurance_uid=${insuranceID}&location=${lat}%2C${lng}%2C100&skip=0&limit=${per_page}&user_key=b277ca758b6d6b1634f652b3010348e1`;
        }
        request_module ({url:baseURL, json: true}, (error, res, drData) => {
            // console.log(drData)
            var parsedData = (drData);
            console.log(drData)
            console.log("should show paresedData", lat, lng, parsedData.data + "XXXXXXXXXX");
            // console.log(parsedData[0] + "XXXXXXXXXX");
            // console.log(parsedData.data[0].uid + "OOOOOOOOOOOOO");
            var uid = parsedData.data.uid;
            console.log(uid);
            // console.log(parsedData);
        
            response.render('results', {
                header: "Results page",
                latitude: lat,
                longitude: lng,
                parsedData: parsedData
            
            })
        })
    }).catch((errorMessage) => {//if not success - error message
        console.log(errorMessage);
    })
});

router.get('/search/:uid', (request, response)=>{
	console.log("AAAAAAAARRRRRGGGGGGGGHHHHHH");
    var uid = request.params.uid;
    console.log(uid + "&&&&&&&&&&&&&&&&&&&&");
    request_module ({url:`https://api.betterdoctor.com/2016-03-01/doctors/${uid}?user_key=6864ad983287baee8365ce0542f8c459`, json: true}, (error, res, drProfile) => {
            // console.log(drData)
            var parsedProfile = (drProfile);
            // console.log(parsedProfile);
            response.render('searchResults',{
            parsedProfile: parsedProfile
        
        })      
    })
});





router.get('/register', function(req,res,next){
	res.render('register', {})
});

router.get('/searchDoctor', function(req,res,next){
	res.render('searchPage', {})
});

router.get('/hello', function(req,res,next){

	res.render('hello', {})
});

router.post('/changeProcess', function(req,res,next){

	res.render('change', {user: req.session})
});

router.post('/changeSubmit', function(req,res,next){

	res.render('profile', {user: req.session})
});

router.get('/profileX', function(req,res,next){

	console.log((req.session) + "****");
	console.log((req.session.zip) + "****");
	console.log((req.session.address) + "****");
	console.log((req.session.name) + "****");
	console.log((req.session.phone) + "****");
	console.log((req.session.insurance) + "****");
	console.log((req.session.email) + "****");
	

	res.render('profile', {user: req.session})
});


router.post('/profileNew', (req,res,next)=>{
	// res.json(req.body);

	var email = req.session.email;
	// var insurance = req.body.insurance

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
					req.session.name = req.body.name;
					// req.session.uid = results[0].id;
					req.session.email = req.body.email;
					req.session.address = req.body.address;
					req.session.city = req.body.city;
					req.session.state = req.body.state;
					req.session.zip = req.body.zip;
					req.session.phone = req.body.phone;
					req.session.insurance = req.body.insurance;
					req.session.doctor = req.body.doctor;

			var insuranceID = config.insurance_ID[req.body.insurance];


			// var insertQuery = `REPLACE LOW_PRIORITY INTO users (name, street_address, city, state, zip_code, phone, insurance, insurance_ID) VALUES (?,?,?,?,?,?,?,?,?,?);`;
			var insertQuery = `UPDATE users 
							   SET phone = ?, 
							   name = ?,
							   email = ?,
							   street_address = ?,
							   city = ?,
							   state = ?,
							   zip_code = ?,
							   insurance = ?,
							   insurance_ID = ?,
							   doctor = ?
							   WHERE email = ?`;

			console.log(insertQuery);

			connection.query(insertQuery,[req.session.phone,
										  req.session.name,
										  email,
										  req.session.address,
										  req.session.city,
										  req.session.state, 
										  req.session.zip,
										  req.body.insurance,
										  insuranceID,
										  req.body.doctor,
										  email], (error)=>{
				if (error){
					throw error;

				}else{
					res.redirect("/profileX");
					console.log(email);
				}
			});

				}
			}
		}
	});
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
	console.log("LOGIN ATTEMPT");
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
					req.session.address = results[0].street_address;
					req.session.city = results[0].city;
					req.session.state = results[0].state;
					req.session.zip = results[0].zip_code;
					req.session.phone = results[0].phone;
					req.session.insurance = results[0].insurance
					res.redirect('/profileX');
					console.log(results[0]);
					console.log(results[0].zip_code);

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
					req.session.address = results[0].street_address;
					req.session.city = results[0].city;
					req.session.state = results[0].state;
					req.session.zip = results[0].zip_code;
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


router.post('/doctorAdd', (req,res,next)=>{
	// res.json(req.body);

	var email = req.session.email;
	// var insurance = req.body.insurance

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
					req.session.name = req.body.name;
					// req.session.uid = results[0].id;
					req.session.email = req.body.email;
					req.session.address = req.body.address;
					req.session.city = req.body.city;
					req.session.state = req.body.state;
					req.session.zip = req.body.zip;
					req.session.phone = req.body.phone;
					req.session.insurance = req.body.insurance

			var insuranceID = config.insurance_ID[req.body.insurance];
			var doctor = "DOCTOR GIGGLES";


			// var insertQuery = `REPLACE LOW_PRIORITY INTO users (name, street_address, city, state, zip_code, phone, insurance, insurance_ID) VALUES (?,?,?,?,?,?,?,?,?,?);`;
			var insertQuery = `UPDATE users 
							   SET doctor = ?
							   WHERE email = ?`;

			console.log(insertQuery);

			connection.query(insertQuery,[doctor, email], (error)=>{
				if (error){
					throw error;

				}else{
					// res.redirect("/profileX");
					console.log(email);
				}
			});

				}
			}
		}
	});
});

router.post('/doctorRemove', (req,res,next)=>{
	// res.json(req.body);

	var email = req.session.email;
	// var insurance = req.body.insurance

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
					req.session.name = req.body.name;
					// req.session.uid = results[0].id;
					req.session.email = req.body.email;
					req.session.address = req.body.address;
					req.session.city = req.body.city;
					req.session.state = req.body.state;
					req.session.zip = req.body.zip;
					req.session.phone = req.body.phone;
					req.session.insurance = req.body.insurance

			var insuranceID = config.insurance_ID[req.body.insurance];
			var doctor = "";


			// var insertQuery = `REPLACE LOW_PRIORITY INTO users (name, street_address, city, state, zip_code, phone, insurance, insurance_ID) VALUES (?,?,?,?,?,?,?,?,?,?);`;
			var insertQuery = `UPDATE users 
							   SET doctor = ?
							   WHERE email = ?`;

			console.log(insertQuery);

			connection.query(insertQuery,[doctor, email], (error)=>{
				if (error){
					throw error;

				}else{
					// res.redirect("/profileX");
					console.log(email);
				}
			});

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
