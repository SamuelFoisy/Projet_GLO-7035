const express = require('express');
const router = express.Router();
let mongoClient = require('mongodb').MongoClient
module.exports = router;


router.get('/', function (req, res, next) {

    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let distance = parseFloat(req.query.distance)*1000;
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);

    var url = 'mongodb://localhost:27017/duproprio'

    mongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var query = {
            coordinates:{
                $near:{
                    $geometry:{
                        type: "Point",
                        coordinates:[lat, long]
                    },
                    $maxDistance:distance,
                }
            },
            $and:[
                {price:{$gte:min}},
                {price:{$lte:max}}
            ]
        };


        db.collection("listing_properties").find(query).toArray(function(err, result) {
            if (err) throw err;

            var totalPrice = 0;
            var totalHouse = 0;
            result.forEach(function (value, index, a){
                var housePrice = value["price"];
                if(Number.isInteger(housePrice)){
                    totalPrice += value["price"];
                    totalHouse += 1;
                }
            });
            var answer = {'averageHousePrice':totalPrice/totalHouse};
            res.json(answer)
            db.close();
        });
    });


});


router.get('/piechart-by-external', function (req, res, next) {


    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let distance = parseFloat(req.query.distance) * 1000;
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);

    var url = 'mongodb://localhost:27017/duproprio';

    mongoClient.connect(url, function (err, db) {
        if (err) throw err;


        var aggregate_pipeline = [{
            $geoNear: {
                distanceField:"coordinates",
                spherical:true,
                near:{type: "Point",
                    coordinates: [lat, long]
                },
                maxDistance: distance,
                query: {
                    $and: [
                        {price: {$gte: min}},
                        {price: {$lte: max}}
                    ]
                }
            }
        },
            {$unwind: "$external_facing"},
            {$group: {_id: "$external_facing", total_value: {$sum: "$price"}, house_count:{$sum: 1}}},
            {$sort:{_id:1}}

        ]


        db.collection("listing_properties").aggregate(aggregate_pipeline).toArray(function (err, result) {
            if (err) throw err;

            res.json(result);
            db.close();
        })
    })
})




router.get('/bar-chart-by-price', function (req, res, next) {


    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);
    let distance = parseFloat(req.query.distance) * 1000;
    let min = parseInt(req.query.min);
    let max = parseInt(req.query.max);

    var url = 'mongodb://localhost:27017/duproprio';

    let boundaries = []
    let boundaryStep = 50000;
    let defaultValue = "";
    for(var i=0;i<=20;i++){
        boundaries.push(i*boundaryStep)
        defaultValue = String(i*boundaryStep).concat(" +")
    }

    console.log(boundaries);
    mongoClient.connect(url, function (err, db) {
        if (err) throw err;


        var aggregate_pipeline = [{
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
                        {price: {$lte: max}}
                    ]
                }
            }
        },
            {$bucket: {
                groupBy:"$price",
                boundaries:boundaries,
                default:defaultValue
            }}

        ]


        db.collection("listing_properties").aggregate(aggregate_pipeline).toArray(function (err, result) {
            if (err) throw err;

            res.json(result);
            db.close();
        })
    })
})