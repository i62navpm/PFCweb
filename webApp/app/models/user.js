// load the things we need
var mongoose = require('mongoose');
var crypto = require('crypto');


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
    }

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