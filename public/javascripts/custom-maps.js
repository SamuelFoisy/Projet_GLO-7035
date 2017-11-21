var map, searchCenterPoint, searchRangeCircle, marker;

function initializeMapQuebec(element) {
    const POSITION_ULAVAL = new google.maps.LatLng(46.779249, -71.269680);

    function initSearchCenterPoint() {
        let searchCenterPointInput = document.getElementById('search-center-point');
        $('#search-center-point').val('Université Laval');
        searchCenterPoint = new google.maps.places.Autocomplete(searchCenterPointInput);
        searchCenterPoint.bindTo('bounds', map);

        google.maps.event.addListener(searchCenterPoint, 'place_changed', placeMarker);
    }

    function initSearchRange() {
        $("#search-range").on('change', drawSearchRange);
    }

    function placeMarker() {
        let place = searchCenterPoint.getPlace();

        map.setCenter(place.geometry.location);
        map.setZoom(12);

        marker.setPosition(place.geometry.location);

        drawSearchRange();
    }

    function drawSearchRange() {
        let place = searchCenterPoint.getPlace();

        let location = place ? place.geometry.location : POSITION_ULAVAL;

        if (searchRangeCircle) {
            searchRangeCircle.setMap();
        }

        searchRangeCircle = new google.maps.Circle({
            strokeColor: '#2E6DA4',
            strokeOpacity: 0.7,
            strokeWeight: 1,
            fillColor: '#337AB7',
            fillOpacity: 0.15,
            map: map,
            center: location,
            radius: getSearchRange() * 1000
        });
    }

    function getSearchRange() {
        let searchRangeText = $("#search-range").val();
        return searchRangeText ? parseInt(searchRangeText) : 5;
    }

    map = new google.maps.Map(element, {
        zoom: 12,
        center: POSITION_ULAVAL
    });

    marker = new google.maps.Marker({position: POSITION_ULAVAL, draggable: false});
    marker.setMap(map);

    initSearchCenterPoint();
    initSearchRange();
    drawSearchRange();
}

