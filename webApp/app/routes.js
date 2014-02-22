var User       = require('../app/models/user');

module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	app.get('/', function(req, res) {
		res.render('index.html/');
	});

	// PROFILE SECTION =========================

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('jugador.html', {
			userID : req.user.id
		});
	});

	app.get('/profile/:id', isLoggedIn, function(req, res) {
		User.findById(req.params.id, function(err, user) {
            if (err)
                res.send({message: "Se ha producido un error"});
            // if no user is found, return the message
            if (!user)
                res.send({message: "Usuario no encontrado"});

            else
            	res.json(user);
        });
	});

	app.put('/profile/:id', isLoggedIn, function(req, res) {
		console.log(req.params.id);
		console.log(req.body)
		User.findById(req.params.id, function(err, user) {
			if (req.body.password){
				//Se adjunta contraseña
				if (user.local.password){
					//Si existe se cambia
					var password = user.generateHash(req.body.oldPassword);


					if (user.validPassword(password)){
						//validado
						//console.log("La contraseña sí coincide.")
						var keys = (Object.keys(req.body));
						for(var i in keys){
							if (keys[i] != 'oldPassword')
								user.local[keys[i]] = req.body[keys[i]];
							if (keys[i] == 'password')
								user.local[keys[i]] = user.generateHash(req.body[keys[i]]);
						}
							
						user.save(function (err) {
						  if (err)
						  	res.send({message: "Error al guardar."})
						});			

						res.send(true);
					}
					else{
						//console.log("La contraseña NO coincide.")
						res.send({message: "La contraseña no coincide con la anterior."})
					}
				}
				else{
					//Si no existe contraseña se crea
					//console.log("no tiene");
					var keys = (Object.keys(req.body));
						for(var i in keys){
							if (keys[i] != 'oldPassword')
								user.local[keys[i]] = req.body[keys[i]];
							if (keys[i] == 'password')
								user.local[keys[i]] = user.generateHash(req.body[keys[i]]);
						}
							
						user.save(function (err) {
						  if (err)
						  	res.send({message: "Error al guardar."})
						});			

						res.send(true);
				}
			}
			else{
				//Cambia todo menos contraseña
				var keys = (Object.keys(req.body));
				for(var i in keys)
					user.local[keys[i]] = req.body[keys[i]];
					
				user.save(function (err) {
				  if (err)
				  	res.send({message: "Error al guardar."})
				});			

				res.send(true);
			}
			
		});
	});

	app.post('/pongConfiguration/:id', isLoggedIn, function(req, res) {
		console.log(req.params.id);
		console.log(req.body);
		User.findById(req.params.id, function(err, user) {
			user.pongConf.push(req.body);
			user.save(function (err) {
				if (err)
			   		res.send({message: "Error al guardar."})
			});			

			res.send(true);
			
		});

	});

	app.put('/calibration/:id', isLoggedIn, function(req, res) {
		console.log(req.params.id);
		console.log(req.body)
		User.findById(req.params.id, function(err, user) {
			console.log("OJOIZ"+req.body.eyeLeft);
			console.log("OJODE"+req.body.eyeRight);

			user.calibration.eyeLeft = req.body.eyeLeft;
			user.calibration.eyeRight = req.body.eyeRight;
			user.save(function (err) {
				if (err)
			   		res.send({message: "Error al guardar."})
			});			

			res.send(true);
			
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.html', { message: req.flash('loginMessage') });

		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.html', { message: req.flash('signupMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
		 	successRedirect : '/profile', // redirect to the secure profile section
		 	failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
		
		app.post('/auth', function(req, res) {
			if(req.body.button == 'facebook')
				res.redirect('/auth/facebook');
			else if(req.body.button == 'twitter')
				res.redirect('/auth/twitter');
			else if(req.body.button == 'google')
				res.redirect('/auth/google');
			res.end();
		});
	// facebook -------------------------------

		// send to facebook to do the authentication
		var dir = null;
		app.get('/auth/facebook', function(req,res,next){
			dir='/profile';
			passport.authenticate('facebook', { scope : 'email' })(req,res,next)
		});
		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',function(req,res,next){
			
			passport.authenticate('facebook', {
				successRedirect : dir,
				failureRedirect : '/'
			})(req,res,next);
		});

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', function(req,res,next){
			dir='/profile';
			passport.authenticate('twitter', { scope : 'email' })(req,res,next);
		});

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',function(req,res,next){
			passport.authenticate('twitter', {
				successRedirect : dir,
				failureRedirect : '/'
			})(req,res,next);
		});


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', function(req,res,next){
			dir='/profile';
			passport.authenticate('google', { scope : ['profile', 'email'] })(req,res,next);
		});

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',function(req,res,next){
			passport.authenticate('google', {
				successRedirect : dir,
				failureRedirect : '/'
			})(req,res,next);
		});

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', function(req,res,next){
			dir = '/profile';
			passport.authorize('facebook', { scope : 'email' })(req,res,next);
		});

		app.get('/register/facebook', function(req,res,next){
			dir = '/profile#/social';
			passport.authorize('facebook', { scope : 'email' })(req,res,next);
		});

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', function(req,res,next){
			dir = '/profile';
			passport.authorize('twitter', { scope : 'email' })(req,res,next);
		});

		app.get('/register/twitter', function(req,res,next){
			dir = '/profile#/social';
			passport.authorize('twitter', { scope : 'email' })(req,res,next);
		});

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', function(req,res,next){
			dir = '/profile';
			passport.authorize('google', { scope : ['profile', 'email'] })(req,res,next);
		});

		app.get('/register/google', function(req,res,next){
			dir = '/profile#/social';
			passport.authorize('google', { scope : ['profile', 'email'] })(req,res,next);
		});

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile#/social');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile#/social');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile#/social');
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}