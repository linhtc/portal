var express = require("express");
var vietnamProvince = express();

vietnamProvince.get = function () {
    return ["An Giang","Bà Rịa Vũng Tàu","Bắc Cạn","Bắc Giang","Bạc Liêu","Bắc Ninh","Bến Tre","Bình Định","Bình Dương","Bình Phước","Bình Thuận","Cà Mau","Cần Thơ","Cao Bằng","Đà Nẵng","Đăk Lăk","Đắk Nông","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Giang","Hạ Long","Hà Nam","Hà Nội","Hà Tĩnh","Hải Dương","Hải Phòng","Hồ Chí Minh","Hưng Yên","Khánh Hòa","Kiên Giang","KonTum","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai","Long An","Nam Định","Nghệ An","Ninh Bình","Ninh Thuận","Phú Thọ","Phú Yên","Quảng Bình","Quảng Nam","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sóc Trăng","Sơn La","Tây Ninh","Thái Nguyên","Thanh Hóa","Thừa Thiên Huế","Tiền Giang","Trà Vinh","Tuyên Quang","Vĩnh Long","Vĩnh Phúc","Yên Bái"];
};

vietnamProvince.map = function () {
    return {
        'An Giang': {'latitude': 10.5720083, 'longitude': 104.8945539},
        'Bà Rịa Vũng Tàu': {'latitude': 9.7168157, 'longitude': 106.4977057},
        'Bắc Cạn': {'latitude': 22.272135, 'longitude': 105.5579424},
        'Bắc Giang': {'latitude': 21.2916743, 'longitude': 106.1725826},
        'Bạc Liêu': {'latitude': 9.2683808, 'longitude': 105.7180247},
        'Bắc Ninh': {'latitude': 21.1740144, 'longitude': 106.0425307},
        'Bến Tre': {'latitude': 10.0650584, 'longitude': 106.280949},
        'Bình Định': {'latitude': 14.1026666, 'longitude': 108.4178372},
        'Bình Dương': {'latitude': 11.1820521, 'longitude': 106.3701165},
        'Bình Phước': {'latitude': 11.7993331, 'longitude': 106.6380471},
        'Bình Thuận': {'latitude': 10.8973519, 'longitude': 108.1037466},
        'Cà Mau': {'latitude': 9.1753578, 'longitude': 105.1169599},
        'Cần Thơ': {'latitude': 10.1230032, 'longitude': 105.3917765},
        'Cao Bằng': {'latitude': 22.7385251, 'longitude': 105.7716581},
        'Đà Nẵng': {'latitude': 16.0717633, 'longitude': 107.9376986},
        'Đăk Lăk': {'latitude': 12.7873449, 'longitude': 107.6779752},
        'Đắk Nông': {'latitude': 12.2799563, 'longitude': 107.3798671},
        'Điện Biên': {'latitude': 21.4139184, 'longitude': 103.0060648},
        'Đồng Nai': {'latitude': 11.0517255, 'longitude': 106.8835175},
        'Đồng Tháp': {'latitude': 10.5546685, 'longitude': 105.2836325},
        'Gia Lai': {'latitude': 13.7989509, 'longitude': 107.5995595},
        'Hà Giang': {'latitude': 22.7781696, 'longitude': 104.4012876},
        'Hạ Long': {'latitude': 20.967364, 'longitude': 106.9726626},
        'Hà Nam': {'latitude': 20.5389845, 'longitude': 105.8993715},
        'Hà Nội': {'latitude': 20.973445, 'longitude': 105.3718034},
        'Hà Tĩnh': {'latitude': 18.3600801, 'longitude': 105.5230739},
        'Hải Dương': {'latitude': 20.9408286, 'longitude': 106.2893231},
        'Hải Phòng': {'latitude': 20.8467333, 'longitude': 106.6636414},
        'Hồ Chí Minh': {'latitude': 10.7546658, 'longitude': 106.4143531},
        'Hưng Yên': {'latitude': 20.8100609, 'longitude': 105.9403324},
        'Khánh Hòa': {'latitude': 12.3185715, 'longitude': 108.7883122},
        'Kiên Giang': {'latitude': 9.896884, 'longitude': 103.9368939},
        'KonTum': {'latitude': 14.3428572, 'longitude': 107.8992582},
        'Lai Châu': {'latitude': 22.2513392, 'longitude': 102.8706779},
        'Lâm Đồng': {'latitude': 11.7651411, 'longitude': 107.7169586},
        'Lạng Sơn': {'latitude': 21.8928274, 'longitude': 106.4484973},
        'Lào Cai': {'latitude': 22.3597562, 'longitude': 103.7986659},
        'Long An': {'latitude': 10.525838, 'longitude': 106.3682317},
        'Nam Định': {'latitude': 20.2053663, 'longitude': 105.9754113},
        'Nghệ An': {'latitude': 19.2734437, 'longitude': 104.2786564},
        'Ninh Bình': {'latitude': 20.245116, 'longitude': 105.9403463},
        'Ninh Thuận': {'latitude': 11.5993863, 'longitude': 108.9498705},
        'Phú Thọ': {'latitude': 21.3179773, 'longitude': 104.8543507},
        'Phú Yên': {'latitude': 13.2011058, 'longitude': 108.7842777},
        'Quảng Bình': {'latitude': 17.5049575, 'longitude': 106.0214592},
        'Quảng Nam': {'latitude': 15.5090407, 'longitude': 107.6935958},
        'Quảng Ngãi': {'latitude': 15.1537722, 'longitude': 108.8072414},
        'Quảng Ninh': {'latitude': 21.1514308, 'longitude': 106.9928191},
        'Quảng Trị': {'latitude': 16.7350102, 'longitude': 106.6715596},
        'Sóc Trăng': {'latitude': 9.6097044, 'longitude': 105.9427065},
        'Sơn La': {'latitude': 21.3009206, 'longitude': 103.5567962},
        'Tây Ninh': {'latitude': 11.365861, 'longitude': 106.0945483},
        'Thái Nguyên': {'latitude': 21.5773739, 'longitude': 105.7683844},
        'Thanh Hóa': {'latitude': 19.9773235, 'longitude': 104.6631821},
        'Thừa Thiên Huế': {'latitude': 16.3686343, 'longitude': 107.3230325},
        'Tiền Giang': {'latitude': 10.3880824, 'longitude': 106.0296789},
        'Trà Vinh': {'latitude': 9.9514489, 'longitude': 106.3097507},
        'Tuyên Quang': {'latitude': 22.0962335, 'longitude': 104.6612673},
        'Vĩnh Long': {'latitude': 10.2518877, 'longitude': 105.9039881},
        'Vĩnh Phúc': {'latitude': 21.3629465, 'longitude': 105.4178295},
        'Yên Bái': {'latitude': 21.7223388, 'longitude': 104.8522477}
    };
};

module.exports = vietnamProvince;