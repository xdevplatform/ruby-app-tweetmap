var tweetList;

var appendTweet = function(tweet){
    removeOldestTweet();
    var node = $('<li></li>');
    node.html(tweet["text"]);
    tweetList.append(node);
};

var removeOldestTweet = function(){
    if(!tweetList){
        tweetList = $('ol');
    }
    try {
        tweetList.find('li')[0].remove();
    } catch (e){

    }
};

// -------------- Maps -------------------------
var map;

var initGoogleMap = function() {
    mapOptions={
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,center: new google.maps.LatLng(13.0021751,14.4060769),
        zoom: 4

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



var pushHeatMarkers = function(lat_lon_array, text) {
    var markers =[];


    $(lat_lon_array).each(function(i, marker){
        var lat_lon =  new google.maps.LatLng(marker[0],marker[1]);

        new google.maps.Marker({
            position: lat_lon,
            map: map,
            title: text,
            animation: google.maps.Animation.DROP
        });
    });
};

var appendToHeatMap = function (tweets) {
    var geo;
    geo = tweets["geo"]["coordinates"];
    pushHeatMarkers([geo], tweets["text"]);
}

window.onload = loadGoogleMapScript;
//-------------------------------------------

$(document).ready(function(){

    var dispatcher = new WebSocketRails('localhost:3000/websocket');
    var channel = dispatcher.subscribe('tweets');
    console.log(channel);

    channel.bind('stream', function(tweets) {
        $(tweets).each(function(i, tweet){
            console.log(tweet);
            appendTweet(tweet);
            appendToHeatMap(tweet);
        });
    });
});