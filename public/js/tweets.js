var tweetList;

var count = 0;

var appendTweet = function(tweet){
    count = count + 1;
    var list = $('#list');
    list.prepend("<li>" + tweet["text"] + "</li>");
    if (count > 30){
      $('#list li:last-child').remove();
    }
};

// -------------- Maps -------------------------
var map;

var initGoogleMap = function() {
    mapOptions={
        scrollwheel: true,
        navigationControl: true,
        mapTypeControl: true,
        scaleControl: true,
        draggable: true,
        center: new google.maps.LatLng(20.7127,-30.0059),
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
    var markers =[];

    $(lat_lon_array).each(function(i, marker){

        var profileUrl = "http://www.twitter.com/" + tweet["user"]["screen_name"];
        var statusUrl = profileUrl + "/status/" + tweet["id_str"];

        var contentString = '<div id="content" class="tweetMarker" style="max-width: 400px;">'+
            '<a href="' + profileUrl + '" target="_target">' +
            '<img style="float: left; border-radius: 4px; margin-right: 6px; width: 60px;" src="' +
            tweet["user"]["profile_image_url"] +
            '">' +
            '</a>' +
            '<div style="float: left; max-width: 300px;">' +
            '<a href="' + profileUrl + '" target="_target">' +
            '<b>' + tweet["user"]["name"] + '</b>' +
            ' <span style="color: #8899a6">@' + tweet["user"]["screen_name"] + '</span>' +
            '</a>' +
            '<br>' +
            '<a href="' + statusUrl + '" target="_target">' +
            tweet["text"] +
            '</a>' +
            '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        var lat_lon =  new google.maps.LatLng(marker[0],marker[1]);
        var marker = new google.maps.Marker({
            position: lat_lon,
            map: map,
            title: tweet["text"],
            icon: iconTweet,
            animation: google.maps.Animation.DROP
        });

        google.maps.event.addListener(marker, 'click', function() {
            $(".tweetMarker").parent().parent().parent().fadeOut();
            infowindow.open(map, marker);
        });

    });
}
var appendToHeatMap = function (tweet) {
    var geo;
    geo = tweet.coordinates;
    if(geo) {
        pushHeatMarkers([geo.coordinates], tweet);
    }
}

window.onload = loadGoogleMapScript;
//-------------------------------------------

$(document).ready(function(){
    $(document).ready(function () {
        setInterval(function () {
            $.getJSON("http://localhost:8181/tweets.json", function (data) {
                appendTweet(data);
                appendToHeatMap(data);
            });
        }, 200);
    });
});