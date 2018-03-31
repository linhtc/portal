var mongoose = require('mongoose');
var dateFormat = require('dateformat');

var day = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");

var activeGuaranteeSchema = mongoose.Schema({
    created: { type: Date, default: day },
    modified: { type: Date, default: day },
    update_by: { type: String, default: "N/A" },
    key: { type: String, default: "N/A" },
    user_name: {
        full_name: { type: String, default: "N/A" },
    },
    user_phone: {
        raw_input: { type: String, default: "N/A" },
        country_code: String,
        region_code: String,
        national_number: String,
        country_code_source: String,
        number_type: String,
    },
    user_email: {
        raw_input: { type: String, default: "N/A" },
        home: String,
        work: String,
    },
    user_dob: {
        date: Date,
        yob: String,
    },
    user_location: {
        country: { type: String, default: "N/A" },
        region: String,
        area: String,
        province: String,
        district: { type: String, default: "N/A" },
        ward: { type: String, default: "N/A" },
        address: { type: String, default: "N/A" },
    },
    model: {
        name: String,
        item_code: String,
    },
    product: {
        imei: String,
        imei_1: String,
        imei_2: String,
    },
    guarantee: {
        cate: String,
        label: { type: String, default: "N/A" },
        date: Date,
        date_detail: {
            day: String,
            time: String,
        },
        location: {
            country: { type: String, default: "N/A" },
            language: { type: String, default: "N/A" },
            current_position: {
                latitude: { type: Number, default: 200 },
                longitude: { type: Number, default: 200 },
            },
        },
        status: { type: Number, default: 0 },
    },
    client_log: {
        app: {
            name: String,
            version: String,
            ip: String,
        },
        android: {
            name: String,
            version: String,
        },
        hardware: {
            version: String,
        }
    },
    platform: {
    	os: { type: String, default: "Android" },
    	version: String,
    	android_id: String,
    },
    timestamp: String,
    status: { type: Number, default: 0 },
    status_log: { type: String, default: "N/A" }
});

var collectionName = 'active_guarantee_logs';

var activeGuaranteeLog = mongoose.model(collectionName, activeGuaranteeSchema);

module.exports = activeGuaranteeLog;