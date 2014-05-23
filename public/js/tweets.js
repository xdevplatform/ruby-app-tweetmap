var count = 0;
var sampleRate = 2; // only show 1/n of the total feed
var iconBase = '/assets/';
var iconTweet = iconBase + 'tweet__.png';
var useBrowserGeo = false;

//-------- WebSocket -------------
var ws = new WebSocket('ws://localhost:8080/');

ws.onmessage = function (message) {
    var tweet = JSON.parse(message.data);
    
    count = count + 1;
    $("#count").html(count);
    
    if (count % sampleRate != 0){
      return;
    }
    
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
        zoom: 4
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Request the user geolocation.
    if (navigator.geolocation && useBrowserGeo) {
        navigator.geolocation.getCurrentPosition(geolocationSuccess, manuallyCenterMap);
    } else {
        manuallyCenterMap();
    }
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
    // map.setZoom(7);
}

// Callback function when the geolocation is not supported.
function manuallyCenterMap() {
    map.setCenter(new google.maps.LatLng(36.8547444,-92.823214));
    map.setZoom(4);
}

//----------- Map Logic ----------

var appendTweet = function (tweet) {
    var list = $('#list');
    list.prepend("<li>" + tweet["text"] + "</li>");
    if ($("#list li").size() > 30) {
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