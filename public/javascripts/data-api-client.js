$(".form-control").change(function () {
    updateAll();
});

$(document).ready(function () {
    updateAll();
});

let updateAll = function () {
    updateHouses();
    updatePieCharts();
};

let updatePieCharts = function () {

    let lat = map.data.map.center.lat();
    let long = map.data.map.center.lng();
    let distance = $("#search-range").val();
    let minmaxString = $("#price-range-filter").attr("data-value");

    let minmax = minmaxString.split(",");

    let queryLat = "lat=".concat(lat);
    let queryLong = "&long=".concat(long);
    let queryDistance = "&distance=".concat(distance);
    let queryMin = "&min=".concat(minmax[0]);
    let queryMax = "&max=".concat(minmax[1]);


    let pieChartQuery = "/queries/piechart-by-external/?".concat(queryLat).concat(queryLong).concat(queryDistance).concat(queryMin).concat(queryMax);

    $.get(pieChartQuery, function (data, status) {
        console.log(data);
        let label = [];
        let values = [];
        data.forEach(function (index, value, a) {
            label.push(index['_id']);
            values.push(index['total_value']);
        });

        generateCustomPieChart('#averagePrice', 'Distribution ponderee du materiel de construction de la facade exterieure', label, values)
    });


    let barChartQuery = "/queries/bar-chart-by-price/?".concat(queryLat).concat(queryLong).concat(queryDistance).concat(queryMin).concat(queryMax);

    $.get(barChartQuery, function (data, status) {
        console.log(data);
        let label = [];
        let values = [];
        data.forEach(function (index, value, a) {
            label.push(index['_id']);
            values.push(index['count']);
        });
        generateCustomBarChart('#houseTypeCount', 'Distribution des valeurs de maison', label, values)

    });


};


let updateHouses = function () {
    let lat = map.data.map.center.lat();
    let long = map.data.map.center.lng();
    let distance = $("#search-range").val();
    let minmaxString = $("#price-range-filter").attr("data-value");


    let minmax = minmaxString.split(",");

    let queryLat = "lat=".concat(lat);
    let queryLong = "&long=".concat(long);
    let queryDistance = "&distance=".concat(distance);
    let queryMin = "&min=".concat(minmax[0]);
    let queryMax = "&max=".concat(minmax[1]);

    let query = "/queries/?".concat(queryLat).concat(queryLong).concat(queryDistance).concat(queryMin).concat(queryMax);

    $.get(query, function (data, status) {

        let housePrice = data.averageHousePrice;
        housePrice = parseFloat(Math.round(housePrice)).toLocaleString("fr-CA");
        $("#average-sale-price").text(String(housePrice).concat(" $"));

    });

};

