// load the things we need
var mongoose = require('mongoose');
var crypto = require('crypto');

var pongScoreSchema = mongoose.Schema({
    date            : { type: Date, default: Date.now },
    points          : String,
    level           : String,
    opponentScore   : String,
    playerScore     : String
});

var tetrisScoreSchema = mongoose.Schema({
    date            : { type: Date, default: Date.now },
    lines           : String,
    level           : String
});

var dragMeScoreSchema = mongoose.Schema({
    date            : { type: Date, default: Date.now },
    times           : String
});

var dragMeConfSchema = mongoose.Schema({
    name    :   String,
    board   :{
        backgroundInColor   : String,
        backgroundOutColor  : String,
        textColor       : String,
    },
    pieces  :{
        opponentSpeed   : String,
        playerSize      : String
    },
    difficult   :{
        timePieceSpeed  : String,
        incPieceSpeed   : String
    },
    score   :   [dragMeScoreSchema]
});

var tetrisConfSchema = mongoose.Schema({
    name    :   String,
    board   :{
        backgroundColor : String,
        lineColor       : String,
        textColor       : String,
        colNumber       : String,
        rowNumber       : String
    },
    pieces  :{
        pieceSpeed      : String
    },
    difficult   :{
        points          : String,
        incPieceSpeed   : String
    },
    score   :   [tetrisScoreSchema]
});

var pongConfSchema = mongoose.Schema({
    name    :   String,
    board   :{
        backgroundColor : String,
        lineColor       : String,
        raquetColor     : String,
        textColor       : String,
        numberZone      : String
    },
    pieces  :{
        leftSpeed       : String,
        rightSpeed      : String,
        ballSpeed       : String,
        raquetWidth     : String,
        raquetHeight    : String
    },
    difficult   :{
        goals           : String,
        points          : String,
        incBallSpeed    : String,
        incOpSpeed      : String
    },
    score   :   [pongScoreSchema]
});

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        userName     : String,
        email        : String,
        password     : String,
        nif          : String,
        phone        : String,
        address      : String,
        dateIn       : { type: Date, default: Date.now }
    },
    facebook         : {
        id           : { type: String, default: null },
        token        : String
    },
    twitter          : {
        id           : { type: String, default: null },
        token        : String,
        displayName  : String
    },
    google           : {
        id           : { type: String, default: null },
        token        : String
    },
    calibration      : {
        eyeLeft      : { type: String, default: '#ff0000' },
        eyeRight     : { type: String, default: '#00ff00' },
    },
    pongConf         : [pongConfSchema],
    tetrisConf       : [tetrisConfSchema],
    dragMeConf       : [dragMeConfSchema],

});


// generating a hash
userSchema.methods.generateHash = function(password) {
    var shasum =  crypto.createHash('sha1',password);
    shasum.update(password);
    return shasum.digest('hex');
};

userSchema.statics.generateHash = function(password) {
    var shasum =  crypto.createHash('sha1',password);
    shasum.update(password);
    return shasum.digest('hex');
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    if (password == this.local.password)
        return true;
    else
        return false;
};

// create the models and expose it to our app
module.exports = mongoose.model('User', userSchema);