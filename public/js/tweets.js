var count = 0;
var iconBase = '/assets/';
var iconTweet = iconBase + 'tweet__.png';

//-------- WebSocket -------------
var ws = new WebSocket('ws://localhost:8080/');

ws.onmessage = function (message) {
    var tweet = JSON.parse(message.data);
    appendTweet(tweet);
    placeMarker(tweet);
};

ws.onopen = function () {
    console.log("Websocket connection opened")
}

// ------- Google Maps Setup -----
var map;

// Initialize the map.
function initializeMap() {
    var mapOptions = {
        scrollwheel: true,
        navigationControl: true,
        mapTypeControl: true,
        scaleControl: true,
        draggable: true,
        zoom: 3
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Request the user geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else {
        geolocationError();
    }

    // Create the search box and link it to the UI element.
    var input = /** @type {HTMLInputElement} */(
        document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var searchBox = new google.maps.places.SearchBox(
        /** @type {HTMLInputElement} */(input));

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        var places = searchBox.getPlaces();

        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }

        // For each place, get the icon, place name, and location.
        markers = [];
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, place; place = places[i]; i++) {
            var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
            });

            markers.push(marker);

            bounds.extend(place.geometry.location);
        }

        map.fitBounds(bounds);
    });

    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    google.maps.event.addListener(map, 'idle', function () {
        var bounds = map.getBounds();
        searchBox.setBounds(bounds);

        adjustStreamForMap()
    });
}

// Listen to the load event.
google.maps.event.addDomListener(window, 'load', initializeMap);

// Callback function when the geolocation is retrieved.
function geolocationSuccess(position) {
    currentLocation = position;
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;

    // Position the map.
    var centerPosition = new google.maps.LatLng(latitude, longitude);

    map.setCenter(centerPosition);
}

function adjustStreamForMap() {
    // Bounds of the map.
    var bounds = map.getBounds();

    if (bounds) {
        // String representing the bounding box (SW coordinates, NE coordinates).
        var locations = bounds.getSouthWest().lng() + ',' +
            bounds.getSouthWest().lat() + ',' +
            bounds.getNorthEast().lng() + ',' +
            bounds.getNorthEast().lat();

        // Emit the `stream` event with the locations on the socket.
        console.log(locations);

        if (ws.readyState) {
            ws.send(locations);
        }
    }
}

// Callback function when the geolocation is not supported.
function geolocationError() {
    var options = {
        map: map,
        center: new google.maps.LatLng(20.7127, -30.0059),
        content: 'Oops, location not found.'
    };

    var errorNotice = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

//----------- Map Logic ----------

var appendTweet = function (tweet) {
    count = count + 1;
    var list = $('#list');
    list.prepend("<li>" + tweet["text"] + "</li>");
    if (count > 30) {
        $('#list li:last-child').remove();
    }
};

function placeMarker(tweet) {
    var geo = tweet.coordinates;

    // Check if the geo type is a Point (it can also be a Polygon).
    if (geo && geo.type === 'Point') {

        var profileUrl = "http://www.twitter.com/" + tweet["user"]["screen_name"];
        var statusUrl = profileUrl + "/status/" + tweet["id_str"];

        var contentString = '<div id="tweet" class="tweet">' +
            '<a href="' + profileUrl + '" target="_target">' +
            '<img class="profile" src="' +
            tweet["user"]["profile_image_url"] +
            '">' +
            '</a>' +
            '<div class="body">' +
            '<a href="' + profileUrl + '" target="_target">' +
            '<div><span class="name">' + tweet["user"]["name"] + '</span>' +
            ' <span class="handle">@' + tweet["user"]["screen_name"] + '</span></div>' +
            '</a>' +
            '<a href="' + statusUrl + '" target="_target" class="text">' +
            tweet["text"] +
            '</a>' +
            '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        var lat_lon = new google.maps.LatLng(geo.coordinates[1], geo.coordinates[0]);
        var marker = new google.maps.Marker({
            position: lat_lon,
            map: map,
            title: tweet["text"],
            icon: iconTweet,
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(marker, 'click', function () {
            $(".tweet").parent().parent().parent().fadeOut();
            infowindow.open(map, marker);
        });
    }
};