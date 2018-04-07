let mongoose = require('mongoose');
let dateFormat = require('dateformat');

let day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

let articalSchema = mongoose.Schema({
    created: { type: Date, default: day },
    modified: { type: Date, default: day },
    title: { type: String, default: "N/A" },
    slug: { type: String, default: "N/A" },
    summary: { type: String, default: "N/A" },
    content: { type: String, default: "N/A" },
    seo: { type: String, default: "N/A" }
});

let articalrModel = mongoose.model('artical', articalSchema);

module.exports = articalrModel;