const express = require('express');
const router = express.Router();
let mongoClient = require('mongodb').MongoClient

router.get('/', function (req, res, next) {

    let lat = parseFloat(req.query.lat);
    let long = parseFloat(req.query.long);

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
                    $maxDistance:10000,
                }
            },
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




module.exports = router;
