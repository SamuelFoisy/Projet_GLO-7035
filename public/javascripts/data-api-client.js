$(".form-control").change(function () {
    updateAll();
});

$(document).ready(function () {
    updateAll();
});

let updateAll = function () {
    updateHouses();
    updatePieCharts();
    updateTable();
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
        console.log("DATA", data);
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



let updateTable = function () {
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

    let query = "/queries/top-houses/?".concat(queryLat).concat(queryLong).concat(queryDistance).concat(queryMin).concat(queryMax);
    let table;

    $.get(query, function (data, status) {
        console.log("INFOS", data);

        table = $('#topResults').DataTable({
            data: data,
            bsort: false,
            columns: [
                {data: "price", title: "Prix"},
                {data: "construction_year", title: "Construit le"},
                {data: "postal_code", title: "Code Postal"},
                {data: "external_facing", title: "Matériaux"},
                {
                    data: "facade_image", title: "Images", render: function (data, type, row) {
                    let result = "";
                    console.log(data);
                    data.forEach(function (url) {
                        result += `<a target="_blank" href="https://photos.duproprio.com/${url}">image</a><br/>`
                    });
                    return result;
                }
                },
                {
                    data: "listing_id", title: "URL", render: function (data, type, row) {
                    return `<a target="_blank" href="${data}">lien</a>`;
                }
                },
            ]
        })
        
        table.destroy();
    });

};