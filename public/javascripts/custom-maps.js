function initialiserMapVilleQc(element) {
    let positionUlaval = new google.maps.LatLng(46.779249, -71.269680);

    map = new google.maps.Map(element, {
        center: positionUlaval,
        zoom: 12
    });

    let marker = new google.maps.Marker({position: positionUlaval});
    marker.setMap(map);

    let infoWindow = new google.maps.InfoWindow({content: "test"});
    google.maps.event.addListener(marker, 'click', function (event) {
        infoWindow.open(map, marker);
    });


    let acOptions = {
        types: ['establishment']
    };

    let searchField = new google.maps.places.Autocomplete(document.getElementById('map-autocomplete-search'));
    searchField.bindTo('bounds', map);

    google.maps.event.addListener(searchField,'place_changed',function () {
        infoWindow.close();

        let place = searchField.getPlace();

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        }
        else
        {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }

        marker.setPosition(place.geometry.location);

    })
}