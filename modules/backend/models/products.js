let mongoose = require('mongoose');
let dateFormat = require('dateformat');

let day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

let productSchema = mongoose.Schema({
    created: { type: Date, default: day },
    modified: { type: Date, default: day },
    name: { type: String, default: "N/A" },
    kind: { type: String, default: "SmartPhone" },
    icon: { type: String, default: "N/A" },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    spec: { type: Object, default: {} },
    overview: { type: String, default: "N/A" },
    intro: { type: String, default: "N/A" },
    status: { type: Number, default: 1 },
    rating: { type: Number, default: 0 },
    comment: { type: Object, default: {} },
    removed: { type: Boolean, default: false }
});

let productModel = mongoose.model('products', productSchema);

module.exports = productModel;