var ws = new WebSocket('ws://' + location.hostname + ':8080/');
var map, markers = [];
var currentLocation;
var iconBase = '/assets/';
var iconTweet = iconBase + 'tweet__.png';
var count = 0;
var play = true;
var censor = window.location.search.indexOf("censor=true") > -1;
var infoWindow = new google.maps.InfoWindow();

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
    if (play) {
        var tweet = JSON.parse(message.data);

        if (censor && tweet.obscene) {
            return;
        }

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

                marker.set('tweet', tweet);

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.setContent(twt.tweet(marker.get('tweet')).html());
                    infoWindow.open(map, marker);
                });

                // Increment counter for TPM
                count = count + 1;

                // Append to list
                twt.timeline(tweet).prependTo("#list");

                // Only keep last 30 tweets in list
                if ($("#list .twt-standard").size() > 30) {
                    $('#list .twt-standard:last-child').remove();
                }
            }
        }
    }
}

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

    google.maps.event.addListener(map, "click", function () {
        infoWindow.close();
    });
}

$("#btn").click(function () {
    $("#pause").toggle();
    $("#play").toggle();
    play = play ? false : true;
});

// Calculate a TPM every 4s
setInterval(function () {
    var tpm = count * 15 + " TPM";
    $("#tpm").html(tpm);
    count = 0;
}, 4000);

// Listen to the load event.
google.maps.event.addDomListener(window, 'load', initializeMap);