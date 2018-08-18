var mongoose = require('mongoose');

var DataSchema = new mongoose.Schema({
    tags: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dateCreated: Date,
});


module.exports = mongoose.model('Data', DataSchema);