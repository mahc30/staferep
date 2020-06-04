const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObraSchema = new Schema({
    name: {
        type: String,
        required: [true, 'No name specified']
    },
    composer: { 
        type: String,
        required: [true, 'No composer specified']
    },
    level: {
        type: String,
        required: [true, 'No level specified']
    },
    file_exists: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('obra',ObraSchema);