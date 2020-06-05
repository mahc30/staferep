const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Auth = new Schema({
    password: {
        type: String,
        required: [true, 'No name specified']
    }
});

module.exports = mongoose.model('auth',Auth);