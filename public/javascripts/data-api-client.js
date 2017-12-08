var topHouseTable;
var tableRefreshLock = new SimpleLock();

$(".form-control").change(function () {
    if (tableRefreshLock.isAvailable()) {
        updateAllCharts();
    }
});

let updateAllCharts = function () {
    updateHouses();
    updateCharts();
    updateTable();
};

let updateCharts = function () {
    let pieChartRequest = createGetRequestFromFields('/queries/piechart-by-external/?');

    $.get(pieChartRequest, function (data, status) {
        let label = [];
        let values = [];
        let total_value = 0;
        data.forEach(function (index, value, a) {
            total_value += index['total_value'];
        });


        data.forEach(function (index, value, a) {
            label.push(index['_id']);
            values.push(Math.round(index['total_value'] / total_value * 1000) / 100);
        });

        generateCustomPieChart('#averagePrice', 'Distribution pondérée du matériel de construction de la façade extérieure', label, values)
    });

    let barChartRequest = createGetRequestFromFields('/queries/bar-chart-by-price/?');

    $.get(barChartRequest, function (data, status) {
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
    let housesRequest = createGetRequestFromFields('/queries/?');
    /*let lat = map.data.map.center.lat();
    let long = map.data.map.center.lng();
    let distance = $("#search-range").val();
    let minmaxString = $("#price-range-filter").attr("data-value");

    let minmax = minmaxString.split(",");

    let queryLat = "lat=".concat(lat);
    let queryLong = "&long=".concat(long);
    let queryDistance = "&distance=".concat(distance);
    let queryMin = "&min=".concat(minmax[0]);
    let queryMax = "&max=".concat(minmax[1]);

    let query = "/queries/?".concat(queryLat).concat(queryLong).concat(queryDistance).concat(queryMin).concat(queryMax);*/

    $.get(housesRequest, function (data, status) {
        let housePrice = data.averageHousePrice;
        housePrice = parseFloat(Math.round(housePrice)).toLocaleString("fr-CA");
        $("#average-sale-price").text(String(housePrice).concat(" $"));
    });
};

let updateTable = function () {
    let tableRequest = createGetRequestFromFields('/queries/top-houses/?');

    resetTopHouseTable();

    tableRefreshLock.lock();

    $.get(tableRequest, function (data, status, table) {
        let current_id = null;
        topHouseTable = $('#topResults').DataTable({
            data: data,
            bsort: false,
            columns: [
                {
                    data: "_id", "visible": false, "defaultContent": "", render: function (data, type, row) {
                        current_id = data;
                    }
                },
                {data: "price", title: "Prix"},
                {data: "construction_year", title: "Construit le"},
                {data: "postal_code", title: "Code Postal"},
                {data: "housing_type", "defaultContent": "", title: "Type de propriété"},
                {data: "external_facing", title: "Matériaux"},
                {
                    data: "facade_image", title: "Images", render: function (data, type, row) {
                        let result = "";
                        data.forEach(function (url) {
                            result += `<a href="javascript:openPopupImage('https://photos.duproprio.com/${url}');" data-url="https://photos.duproprio.com/${url}">image</a>`;
                            result += '&nbsp;';
                            result += `<a class="badge warning" onclick="deleteImage('${url}', '${current_id}');">` + '<i class="fa fa-times"></i>' + '</a>';
                            result += '<br/>';
                        });
                        return result;
                    }
                },
                {
                    data: "listing_id", title: "URL", render: function (data, type, row) {
                        return `<a target="_blank" href="${data}">lien</a>`;
                    }
                }
            ]
        });
        tableRefreshLock.unlock();
    });
};

let deleteImage = function (houseUrl, imageId) {
    $.confirm({
        title: 'Voulez-vous réellement supprimer cette image?',
        type: 'red',
        content: '',
        closeIcon: true,
        buttons: {
            ok: {
                text: "Oui",
                btnClass: 'btn-danger',
                keys: ['enter'],
                action: function () {
                    let postUrl = '/queries/delete-image/?image=' + houseUrl + '&house=' + imageId;

                    $.post(postUrl, function (data) {
                        updateTable();
                    });
                }
            },
            cancel: {
                text: "Non",
                action: function () {
                }
            }
        }
    });
};

let resetTopHouseTable = function () {
    if (topHouseTable) {
        topHouseTable.destroy();
    }
};