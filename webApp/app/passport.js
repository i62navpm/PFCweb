// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User       = require('./models/user');
// var User = new Models.User();

// load the auth variables
var configAuth = require('../config/auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'Usuario no encontrado.'));

                if (!user.validPassword(user.generateHash(password)))
                    return done(null, false, req.flash('loginMessage', 'Contraseña incorrecta.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {

        process.nextTick(function() {
            // check if the user is already logged ina
            if (!req.user) {
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'Este correo ya existe.'));
                    } else {

                        // create the user
                        var newUser            = new User();
                        initNewUser(newUser);
                        newUser.local.email    = email;
                        newUser.local.password = User.generateHash(password);
                        newUser.local.userName = req.body.name;

                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newUser);
                        });
                    }

                });
            } else {

                var user            = req.user;
                user.local.email    = email;
                user.local.password = User.generateHash(password);
                user.local.userName = req.body.name;

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }
        });

    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.local.userName  = profile.name.givenName + ' ' + profile.name.familyName;
                            //user.local.email = profile.emails[0].value;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser            = new User();
                        initNewUser(newUser);
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.local.userName = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.local.email = profile.emails[0].value;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.local.userName = profile.name.givenName + ' ' + profile.name.familyName;
                //user.local.email = profile.emails[0].value;

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }
        });

    }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, tokenSecret, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.twitter.token) {
                            user.twitter.token       = token;
                            user.twitter.username    = profile.username;
                            user.local.userName      = profile.displayName;

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser                 = new User();
                        initNewUser(newUser);
                        newUser.twitter.id          = profile.id;
                        newUser.twitter.token       = token;
                        newUser.twitter.username    = profile.username;
                        newUser.local.userName      = profile.displayName;

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user                 = req.user; // pull the user out of the session

                user.twitter.id          = profile.id;
                user.twitter.token       = token;
                user.twitter.username    = profile.username;
                user.local.userName      = profile.displayName;

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }

        });

    }));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {

                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.google.token) {
                            user.google.token    = token;
                            user.local.userName  = profile.displayName;
                            //user.local.email     = profile.emails[0].value; // pull the first email

                            user.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new User();
                        initNewUser(newUser);
                        newUser.google.id       = profile.id;
                        newUser.google.token    = token;
                        newUser.local.userName  = profile.displayName;
                        newUser.local.email     = profile.emails[0].value; // pull the first email

                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user               = req.user; // pull the user out of the session

                user.google.id    = profile.id;
                user.google.token = token;
                user.local.userName  = profile.displayName;
                //user.local.email = profile.emails[0].value; // pull the first email

                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });

            }

        });

    }));

    initNewUser = function(user){
        user.pongConf.push({
            name    :   'Fácil',
            board   :{
                backgroundColor : '#ffffff',
                lineColor       : '#000000',
                raquetColor     : '#000000',
                textColor       : '#000000',
                numberZone      : '5'
            },
            pieces  :{
                leftSpeed       : '5',
                rightSpeed      : '5',
                ballSpeed       : '5',
                raquetWidth     : '10',
                raquetHeight    : '80'
            },
            difficult   :{
                goals           : '5',
                points          : '10',
                incBallSpeed    : '1',
                incOpSpeed      : '0.5'
            }
        });

        user.pongConf.push({
            name    :   'Normal',
            board   :{
                backgroundColor : '#ffffff',
                lineColor       : '#000000',
                raquetColor     : '#000000',
                textColor       : '#000000',
                numberZone      : '5'
            },
            pieces  :{
                leftSpeed       : '5',
                rightSpeed      : '5',
                ballSpeed       : '5',
                raquetWidth     : '10',
                raquetHeight    : '80'
            },
            difficult   :{
                goals           : '5',
                points          : '10',
                incBallSpeed    : '2',
                incOpSpeed      : '1'
            }
        });
        user.pongConf.push({
            name    :   'Difícil',
            board   :{
                backgroundColor : '#ffffff',
                lineColor       : '#000000',
                raquetColor     : '#000000',
                textColor       : '#000000',
                numberZone      : '5'
            },
            pieces  :{
                leftSpeed       : '5',
                rightSpeed      : '5',
                ballSpeed       : '5',
                raquetWidth     : '10',
                raquetHeight    : '80'
            },
            difficult   :{
                goals           : '5',
                points          : '10',
                incBallSpeed    : '3',
                incOpSpeed      : '2.5'
            }
        });

        user.tetrisConf.push({
            name    :   'Fácil',
            board   :{
                backgroundColor : '#ffffff',
                lineColor       : '#000000',
                textColor       : '#000000',
                colNumber       : '10',
                rowNumber       : '15'

            },
            pieces  :{
                pieceSpeed      : '200'
            },
            difficult   :{
                points          : '10',
                incPieceSpeed   : '10'
            }
        });
        user.tetrisConf.push({
            name    :   'Normal',
            board   :{
                backgroundColor : '#ffffff',
                lineColor       : '#000000',
                textColor       : '#000000',
                colNumber       : '10',
                rowNumber       : '15'

            },
            pieces  :{
                pieceSpeed      : '200'
            },
            difficult   :{
                points          : '10',
                incPieceSpeed   : '20'
            }
        });
        user.tetrisConf.push({
            name    :   'Difícil',
            board   :{
                backgroundColor : '#ffffff',
                lineColor       : '#000000',
                textColor       : '#000000',
                colNumber       : '10',
                rowNumber       : '15'

            },
            pieces  :{
                pieceSpeed      : '200'
            },
            difficult   :{
                points          : '10',
                incPieceSpeed   : '30'
            }
        });

        user.dragMeConf.push({
            name    :   'Fácil',
            board   :{
                backgroundInColor   : '#ffffff',
                backgroundOutColor  : '#000000',
                textColor       : '#000000'

            },
            pieces  :{
                opponentSpeed   : '5',
                playerSize      : '50'
            },
            difficult   :{
                timePieceSpeed  : '2',
                incPieceSpeed   : '4'
            }
        });
        user.dragMeConf.push({
            name    :   'Normal',
            board   :{
                backgroundInColor   : '#ffffff',
                backgroundOutColor  : '#000000',
                textColor       : '#000000'

            },
            pieces  :{
                opponentSpeed   : '5',
                playerSize      : '50'
            },
            difficult   :{
                timePieceSpeed  : '2',
                incPieceSpeed   : '3'
            }
        });
        user.dragMeConf.push({
            name    :   'Difícil',
            board   :{
                backgroundInColor   : '#ffffff',
                backgroundOutColor  : '#000000',
                textColor       : '#000000'

            },
            pieces  :{
                opponentSpeed   : '5',
                playerSize      : '50'
            },
            difficult   :{
                timePieceSpeed  : '2',
                incPieceSpeed   : '2'
            }
        });
    };

};
