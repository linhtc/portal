let mongoose = require('mongoose');
let dateFormat = require('dateformat');

let day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

let kindSchema = mongoose.Schema({
    created: { type: Date, default: day },
    modified: { type: Date, default: day },
    kind: { type: String, default: "SmartPhone" },
    name: { type: String, default: "N/A" },
    removed: { type: Boolean, default: false }
});

let kindModel = mongoose.model('kinds', kindSchema);

module.exports = kindModel;