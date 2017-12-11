/** dead code **/

let createStandardAggregation = function (request) {
    let standardAggregation = new Aggregation();
    standardAggregation.setSearchZone(parseFloat(request.query.long), parseFloat(request.query.lat), parseFloat(request.query.distance) * 1000);
    standardAggregation.addFilter({price: {$gte: parseInt(request.query.min)}});
    standardAggregation.addFilter({price: {$lte: parseInt(request.query.max)}});
    let housingTypes = strToTable(request.query.housingTypes);
    standardAggregation.addFilter({"housing_type": {$in: housingTypes}}, housingTypes, true);
    let externalFacings = strToTable(request.query.externalFacing);
    standardAggregation.addFilter({"external_facing": {$in: standardAggregation}}, externalFacings, true);

    return standardAggregation;
};

function Aggregation() {
    let self = this;
    let longitude, latitude, maxDistance, filters, additionalArguments;

    self.setSearchZone = function (longitude, latitude, maxDistance) {
        self.longitude = longitude;
        self.latitude = latitude;
        self.maxDistance = maxDistance;
    };

    self.addFilter = function (filter, valueToValidate = null, dismissNull = false) {
        if (!self.filters) {
            self.filters = [];
        }
        if (dismissNull && !valueToValidate) {
        }
        else {
            self.filters.push(filter);
        }
    };

    self.addStep = function (step) {
        if (!self.steps) {
            self.steps = [];
        }
        self.steps.push(step);
    };

    self.generate = function () {
        return [{
            $geoNear: {
                distanceField: "coordinates",
                spherical: true,
                near: {
                    type: "Point",
                    coordinates: [self.latitude, self.longitude]
                },
                maxDistance: self.maxDistance,
                query: {
                    $and: self.filters
                }
            }
        }].concat(self.steps);
    };
}