
$(".form-control").change(function() {

    updateHouses();
});

var updateHouses = function(){
    var lat = map.data.map.center.lat();
    var long = map.data.map.center.lng();
    var distance = $("#search-range").val();
    var minmaxString = $("#price-range-filter").attr("data-value");



    var minmax = minmaxString.split(",");

    var queryLat = "lat=".concat(lat);
    var queryLong = "&long=".concat(long);
    var queryDistance = "&distance=".concat(distance);
    var queryMin = "&min=".concat(minmax[0]);
    var queryMax = "&max=".concat(minmax[1]);

    var query = "/queries/?".concat(queryLat).concat(queryLong).concat(queryDistance).concat(queryMin).concat(queryMax);

    $.get(query , function (data, status) {

        let housePrice = data.averageHousePrice
        housePrice = parseFloat(Math.round(housePrice)).toLocaleString("fr-CA");
        $("#average-sale-price").text(String(housePrice).concat(" $"));

    });

};
