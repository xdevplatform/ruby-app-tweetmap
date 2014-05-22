var tweetList;

var count = 0;

var appendTweet = function (tweet) {
    count = count + 1;
    var list = $('#list');
    list.prepend("<li>" + tweet["text"] + "</li>");
    if (count > 30) {
        $('#list li:last-child').remove();
    }
};

// -------------- Maps -------------------------
var map;

var initGoogleMap = function () {
    mapOptions = {
        scrollwheel: true,
        navigationControl: true,
        mapTypeControl: true,
        scaleControl: true,
        draggable: true,
        center: new google.maps.LatLng(20.7127, -30.0059),
        zoom: 3
    };

    map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);

}

function loadGoogleMapScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?sensv=3.exp&sensor=true&' +
        'callback=initGoogleMap&libraries=visualization';
    document.body.appendChild(script);
};

var iconBase = '/assets/';
var iconTweet = iconBase + 'tweet__.png';

function pushHeatMarkers(lat_lon_array, tweet) {
    var markers = [];

    $(lat_lon_array).each(function (i, marker) {

        var profileUrl = "http://www.twitter.com/" + tweet["user"]["screen_name"];
        var statusUrl = profileUrl + "/status/" + tweet["id_str"];

        var contentString = '<div id="content" class="tweetMarker" style="max-width: 400px;">' +
            '<a href="' + profileUrl + '" target="_target">' +
            '<img class="profile" src="' +
            tweet["user"]["profile_image_url"] +
            '">' +
            '</a>' +
            '<div class="body">' +
            '<a href="' + profileUrl + '" target="_target">' +
            '<span class="name">' + tweet["user"]["name"] + '</span>' +
            ' <span class="handle">@' + tweet["user"]["screen_name"] + '</span>' +
            '</a>' +
            '<br>' +
            '<a href="' + statusUrl + '" target="_target" class="text">' +
            tweet["text"] +
            '</a>' +
            '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        var lat_lon = new google.maps.LatLng(marker[1], marker[0]);
        var marker = new google.maps.Marker({
            position: lat_lon,
            map: map,
            title: tweet["text"],
            icon: iconTweet,
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(marker, 'click', function () {
            $(".tweetMarker").parent().parent().parent().fadeOut();
            infowindow.open(map, marker);
        });

    });
};

var appendToHeatMap = function (tweet) {
    var geo;
    geo = tweet.coordinates;
    if (geo) {
        pushHeatMarkers([geo.coordinates], tweet);
    }
}

window.onload = loadGoogleMapScript;
//-------------------------------------------
var serverHost = "http://localhost:8181";
var tweetURI = "/tweets.json";

$(document).ready(function () {
    $(document).ready(function () {
        var retries = 0;
        var id = setInterval(function () {
            $.getJSON((serverHost + tweetURI), function (data) {
                appendTweet(data);
                appendToHeatMap(data);
                retries = 0;
            }).fail(function (jqXHR, status, error) {
                retries += 1;
                if (retries > 15) {
                    clearInterval(id);
                }
            });
        }, 250);
    });
});