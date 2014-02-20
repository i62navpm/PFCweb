// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        userName     : String,
        email        : String,
        password     : String,
        nif          : String,
        telephone    : Number,
        address      : String,
        dateIn       : { type: Date, default: Date.now }
    },
    facebook         : {
        id           : String,
        token        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String
    },
    google           : {
        id           : String,
        token        : String
    }

});


// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the models and expose it to our app
module.exports = mongoose.model('User', userSchema);