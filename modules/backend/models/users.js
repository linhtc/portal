let mongoose = require('mongoose');
let dateFormat = require('dateformat');

let day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

let userSchema = mongoose.Schema({
    created: { type: Date, default: day },
    modified: { type: Date, default: day },
    fullname: { type: String, default: "N/A" },
    username: { type: String, default: "N/A" },
    password: { type: String, default: "N/A" },
    phone: { type: String, default: "N/A" },
    email: { type: String, default: "N/A" },
    address: { type: String, default: "N/A" },
    gender: { type: String, default: "N/A" },
    avatar: { type: String, default: "N/A" },
    group: { type: String, default: "thanhvien" },
    permission: { type: Object, default: {} },
    evaluation: { type: Object, default: {} },
    evaluated: { type: Boolean, default: false },
    approval: { type: Boolean, default: false },
    removed: { type: Boolean, default: false }
});

let userModel = mongoose.model('users', userSchema);

module.exports = userModel;