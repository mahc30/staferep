const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    name: {
        type: String,
        required: [true, 'No name specified']
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        required: [true, 'No Parent ID specified']
    },
    data: {
        type: Buffer,
        required: [true, 'No Data']
    },
    content_type: {
        type: String,
        required: [true, 'No type specified']
    }
});

module.exports = mongoose.model('file',FileSchema);