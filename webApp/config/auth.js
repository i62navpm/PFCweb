// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '264546943721619', // your App ID
		'clientSecret' 	: 'bf502eee161a016470b676fbefaf45ab', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'AaMsHExHaCTdcOLIfnIQPg',
		'consumerSecret' 	: 'bNhDqOg1pRS8HN4jKE8a2GYgbRd3ID650FmJuJu73Nk',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '971783213393.apps.googleusercontent.com',
		'clientSecret' 	: 'tL1_hdMB1Ein8Z5QZThHl2-d',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

};