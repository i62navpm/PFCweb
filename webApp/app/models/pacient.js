// load the things we need
var mongoose = require('mongoose');

var pacientSchema = mongoose.Schema({
    _user       : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    nif         : String,
    telephone   : Number,
    address     : String,
    photo		: String
});

module.exports = mongoose.model('Pacient', pacientSchema);