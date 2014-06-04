var ws = new WebSocket('ws://' + location.hostname + ':8080/');
var map, markers = [];
var currentLocation;
var iconBase = '/assets/';
var iconTweet = iconBase + 'tweet__.png';
var count = 0;

// Socket open event
ws.onopen = function () {
    console.log('Socket connection established.');
}

// Socket message
ws.onmessage = function (message) {
    handleTweet(message);
}

// Log errors
ws.onerror = function (error) {
    console.log('WebSocket Error ' + error);
};

// Socket close event
ws.onclose = function () {
    console.log('Socket connection interrupted.');
}

// Handle tweet
function handleTweet(message) {
    var tweet = JSON.parse(message.data);
    var geo = tweet.coordinates;

    // Check if the geo type is a Point (it can also be a Polygon).
    if (geo && geo.type === 'Point') {
        var lat_lon = new google.maps.LatLng(geo.coordinates[1], geo.coordinates[0]);
        var bounds = map.getBounds();
        if (bounds && bounds.contains(lat_lon)) {

            // Place marker
            var marker = new google.maps.Marker({
                position: lat_lon,
                map: map,
                title: tweet["text"],
                icon: iconTweet,
                animation: google.maps.Animation.DROP
            });

            markers.push(marker);

            // Remove old markers when there are more than 300 on the map.
            if (markers.length > 300) {
                markers[0].setMap(null);
                markers.shift();
            }

            // Construct Info Window
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

            google.maps.event.addListener(marker, 'click', function () {
                $(".tweet").parent().parent().parent().fadeOut();
                infowindow.open(map, marker);
            });

            // Increment counter
            count = count + 1;

            // Append to list
            var list = $('#list');
            list.prepend("<li>" + tweet["text"] + "</li>");
            if ($("#list li").size() > 30) {
                $('#list li:last-child').remove();
            }
        }
    }
}

// Calculate a TPM every 4s
setInterval(function () {
    var tpm = count * 15;
    $("#tpm").html(tpm);
    count = 0;
}, 4000);

// Callback function when the geolocation is retrieved.
function geolocationSuccess(position) {
    if (currentLocation) {
        return;
    }

    currentLocation = position;
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;

    // Position the map.
    var centerPosition = new google.maps.LatLng(latitude, longitude);

    map.setCenter(centerPosition);
}

// Callback function when the geolocation is not supported.
function geolocationError() {
    // Center and show the US
    var centerPosition = new google.maps.LatLng(39.159, -100.518);
    map.setCenter(centerPosition);
    map.setZoom(4);
}

// Initialize the map.
function initializeMap() {
    var mapOptions = {
        zoom: 7
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Request the user geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    } else {
        geolocationError();
    }
}

// Listen to the load event.
google.maps.event.addDomListener(window, 'load', initializeMap);