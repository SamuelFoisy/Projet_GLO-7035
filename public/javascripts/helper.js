let buildFilter = function (lon, lat, distance, minPrice, maxPrice, housingTypes, externalFacings) {
    let queryLat = "lat=".concat(lat);
    let queryLong = "&long=".concat(long);
    let queryDistance = "&distance=".concat(distance);
    let queryMin = "&min=".concat(minmax[0]);
    let queryMax = "&max=".concat(minmax[1]);
    let queryHousingTypes = "&housingTypes=".concat(housingTypes);
    let queryExternalFacing = "&externalFacing=".concat(externalFacing);

    let query = "/queries/top-houses/?".concat(queryLat).concat(queryLong).concat(queryDistance).concat(queryMin).concat(queryMax);

    if (housingTypes) {
        query = query.concat(queryHousingTypes);
    }

    if (externalFacing) {
        query = query.concat(queryExternalFacing);
    }
};

let createGetRequestFromFields = function (path) {
    let latitude = map.data.map.center.lat();
    let longitude = map.data.map.center.lng();
    let searchRange = $("#search-range").val();
    let minmaxString = $("#price-range-filter").attr("data-value");
    let housingTypes = $("#housing-type-filter").select2('val');
    let externalFacings = $("#external-facing-filter").select2('val');
    let minmax = minmaxString.split(",");

    return createRequest(path, longitude, latitude, searchRange, minmax[0], minmax[1], housingTypes, externalFacings);

};

let createRequest = function (path, longitude, latitude, searchRange, minPrice, maxPrice, housingTypes, externalFacings) {
    let parameters = "lat=".concat(latitude)
        + "&long=".concat(longitude)
        + "&distance=".concat(searchRange)
        + "&min=".concat(minPrice)
        + "&max=".concat(maxPrice);

    if (housingTypes) {
        parameters = parameters + "&housingTypes=".concat(housingTypes.join(':'));
    }

    if (externalFacings) {
        parameters = parameters + "&externalFacing=".concat(externalFacings.join(':'));
    }

    return path.concat(parameters);
};

function SimpleLock() {
    let self = this;
    let locked = false;

    self.lock = function () {
        locked = true;
    };

    self.unlock = function () {
        locked = false
    };

    self.isAvailable = function () {
        return !locked;
    };
}