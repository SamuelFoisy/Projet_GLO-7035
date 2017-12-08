const express = require('express');
const router = express.Router();
let mongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;
module.exports = router;

const mongoUrl = 'mongodb://DuproprioWebApp:CetteApplicationEstVraimentExcellente@ds133796.mlab.com:33796/duproprio';

router.get('/', function (req, res) {
    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let distance = parseFloat(req.query.distance) * 1000;
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);
    let housingTypes;
    if (req.query.housingTypes) {
        housingTypes = req.query.housingTypes.split(':');
    }

    let externalFacing;
    if (req.query.externalFacing) {
        externalFacing = req.query.externalFacing.split(':');
    }

    mongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        let query = {
            coordinates: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lat, long]
                    },
                    $maxDistance: distance,
                }
            },
            $and: [
                {price: {$gte: min}},
                {price: {$lte: max}},
                createFilter({"housing_type": {$in: housingTypes}}, housingTypes, true),
                createFilter({"external_facing": {$in: externalFacing}}, externalFacing, true)
            ]
        };

        db.collection("listing_properties").find(query).toArray(function (err, result) {
            if (err) throw err;

            let totalPrice = 0;
            let totalHouse = 0;
            result.forEach(function (value, index, a) {
                let housePrice = value["price"];
                if (Number.isInteger(housePrice)) {
                    totalPrice += value["price"];
                    totalHouse += 1;
                }
            });
            let answer = {'averageHousePrice': totalPrice / totalHouse};
            res.json(answer);
            db.close();
        });
    });

});


router.get('/piechart-by-external', function (req, res) {
    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let distance = parseFloat(req.query.distance) * 1000;
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);
    let housingTypes;
    if (req.query.housingTypes) {
        housingTypes = req.query.housingTypes.split(':');
    }

    let externalFacing;
    if (req.query.externalFacing) {
        externalFacing = req.query.externalFacing.split(':');
    }

    mongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;

        let aggregate_pipeline = [{
            $geoNear: {
                distanceField: "coordinates",
                spherical: true,
                near: {
                    type: "Point",
                    coordinates: [lat, long]
                },
                maxDistance: distance,
                query: {
                    $and: [
                        {price: {$gte: min}},
                        {price: {$lte: max}},
                        createFilter({"housing_type": {$in: housingTypes}}, housingTypes, true),
                        createFilter({"external_facing": {$in: externalFacing}}, externalFacing, true)
                    ]
                }
            }
        },
            {$unwind: "$external_facing"},
            {$group: {_id: "$external_facing", total_value: {$sum: "$price"}, house_count: {$sum: 1}}},
            {$sort: {_id: 1}}

        ];

        db.collection("listing_properties").aggregate(aggregate_pipeline).toArray(function (err, result) {
            if (err) throw err;

            res.json(result);
            db.close();
        })
    })
});


router.get('/piechart-by-heating', function (req, res) {
    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let distance = parseFloat(req.query.distance) * 1000;
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);
    let housingTypes;
    if (req.query.housingTypes) {
        housingTypes = req.query.housingTypes.split(':');
    }

    let externalFacing;
    if (req.query.externalFacing) {
        externalFacing = req.query.externalFacing.split(':');
    }

    mongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;


        let aggregate_pipeline = [{
            $geoNear: {
                distanceField: "coordinates",
                spherical: true,
                near: {
                    type: "Point",
                    coordinates: [lat, long]
                },
                maxDistance: distance,
                query: {
                    $and: [
                        {price: {$gte: min}},
                        {price: {$lte: max}},
                        createFilter({"housing_type": {$in: housingTypes}}, housingTypes, true),
                        createFilter({"external_facing": {$in: externalFacing}}, externalFacing, true)
                    ]
                }
            }
        },
            {$unwind: "$heating_source"},
            {$group: {_id: "$heating_source", total_value: {$sum: "$price"}, house_count: {$sum: 1}}},
            {$sort: {_id: 1}}

        ];


        db.collection("listing_properties").aggregate(aggregate_pipeline).toArray(function (err, result) {
            if (err) throw err;

            res.json(result);
            db.close();
        })
    })
});


router.get('/bar-chart-by-price', function (req, res) {
    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let distance = parseFloat(req.query.distance) * 1000;
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);
    let housingTypes;
    if (req.query.housingTypes) {
        housingTypes = req.query.housingTypes.split(':');
    }

    let externalFacing;
    if (req.query.externalFacing) {
        externalFacing = req.query.externalFacing.split(':');
    }

    let boundaries = [];
    let boundaryStep = 50000;
    let defaultValue = "";
    for (let i = 0; i <= 20; i++) {
        boundaries.push(i * boundaryStep);
        defaultValue = String(i * boundaryStep).concat(" +")
    }
    mongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;

        let aggregate_pipeline = [{
            $geoNear: {
                distanceField: "coordinates",
                spherical: true,
                near: {
                    type: "Point",
                    coordinates: [lat, long]
                },
                maxDistance: distance,
                query: {
                    $and: [
                        {price: {$gte: min}},
                        {price: {$lte: max}},
                        createFilter({"housing_type": {$in: housingTypes}}, housingTypes, true),
                        createFilter({"external_facing": {$in: externalFacing}}, externalFacing, true)
                    ]
                }
            }
        },
            {
                $bucket: {
                    groupBy: "$price",
                    boundaries: boundaries,
                    default: defaultValue
                }
            }

        ];

        db.collection("listing_properties").aggregate(aggregate_pipeline).toArray(function (err, result) {
            if (err) throw err;

            res.json(result);
            db.close();
        })
    })
});

router.get('/top-houses', function (req, res) {
    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let distance = parseFloat(req.query.distance) * 1000;
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);
    let housingTypes;
    if (req.query.housingTypes) {
        housingTypes = req.query.housingTypes.split(':');
    }

    let externalFacing;
    if (req.query.externalFacing) {
        externalFacing = req.query.externalFacing.split(':');
    }

    mongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;

        let aggregate_pipeline = [{
            $geoNear: {
                distanceField: "coordinates",
                spherical: true,
                near: {
                    type: "Point",
                    coordinates: [lat, long]
                },
                maxDistance: distance,
                query: {
                    $and: [
                        {price: {$gte: min}},
                        {price: {$lte: max}},
                        createFilter({"housing_type": {$in: housingTypes}}, housingTypes, true),
                        createFilter({"external_facing": {$in: externalFacing}}, externalFacing, true)
                    ]
                }
            }
        }, {$sort: {coordinates: 1}},
            {
                $project: {
                    "_id": 1,
                    "construction_year": 1,
                    "coordinates": 1,
                    "postal_code": 1,
                    "housing_type": 1,
                    "external_facing": 1,
                    "price": 1,
                    "facade_image": 1,
                    "listing_id": 1
                }
            }
        ];

        db.collection("listing_properties").aggregate(aggregate_pipeline).toArray(function (err, result) {
            if (err) throw err;

            res.json(result);
            db.close();
        })
    })
});

router.post('/delete-image', function (req, res) {
    let imageToRemove = String(req.query.image);
    let house = String(req.query.house);

    mongoClient.connect(mongoUrl, function (err, db) {
        if (err) throw err;
        let houseId = ObjectID(house);
        let query = {"_id": houseId};
        let update = {$pull: {"facade_image": imageToRemove}};
        console.log(query);
        console.log(update);
        db.collection("listing_properties").updateOne(query, update).then(function () {
            res.json({'ok': 1});
            window.close();
            db.close()
            }
        );
    })

});

let createFilter = function (filter, value, dismissNull = false) {
    if (dismissNull && !value) {
        console.log('return {}');
        return {};
    }
    else {
        console.log('return', filter);
        return filter;
    }
};