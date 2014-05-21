var tweetList;

var appendTweet = function(tweet){
    // removeOldestTweet();
    // var node = $('<li></li>');
    // node.html(tweet["text"]);
    // tweetList.append(node);
    $('#list').append("<li>" + tweet["text"] + "</li>");
    
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
/*
            console.log(tweet);
            appendTweet(tweet);
            appendToHeatMap(tweet);
*/
          setTimeout( function () {
                appendTweet(tweet);
                appendToHeatMap(tweet);
           }, Math.random() * 2000);
        });
    });
});