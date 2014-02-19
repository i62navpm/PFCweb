// load the things we need
var mongoose = require('mongoose');

var specialistSchema = mongoose.Schema({
    _user       : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company     : String,
    cif         : String,
    telephone   : Number,
    address     : String,
    photo		: String
});

module.exports = mongoose.model('Specialist', specialistSchema);