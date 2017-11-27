
$(".form-control").change(function() {
    var lat = map.data.map.center.lat();
    var lng = map.data.map.center.lng();
    updateHouses(lat, lng)
});

var updateHouses = function(lat,long){
    $.get("/queries/?lat=".concat(lat).concat("&long=").concat(long), function (data, status) {
        console.log(data);

        // data.forEach(function (value, index, a) {
        //
        //
        // });
    });
};

