let mongoose = require('mongoose');
let dateFormat = require('dateformat');

let day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

let groupSchema = mongoose.Schema({
    created: { type: Date, default: day },
    modified: { type: Date, default: day },
    key: { type: String, default: "N/A" },
    name: { type: String, default: "N/A" },
    permission: { type: Object, default: {} },
    removed: { type: Boolean, default: false }
});

let groupModel = mongoose.model('groups', groupSchema);

module.exports = groupModel;