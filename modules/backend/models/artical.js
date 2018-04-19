let mongoose = require('mongoose');
let dateFormat = require('dateformat');

let day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

let articalSchema = mongoose.Schema({
    created: { type: Date, default: day },
    modified: { type: Date, default: day },
    catalog: { type: Boolean, default: false },
    title: { type: String, default: "N/A" },
    slug: { type: String, default: "N/A" },
    thumbnail: { type: String, default: "N/A" },
    summary: { type: String, default: "N/A" },
    content: { type: String, default: "N/A" },
    seo: { type: String, default: "N/A" },
    public: { type: String, default: 1 },
    group: { type: String, default: 1 },
    removed: { type: Boolean, default: false }
});

let articalModel = mongoose.model('articals', articalSchema);

module.exports = articalModel;