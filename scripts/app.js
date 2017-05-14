// define globals
var weekly_quakes_endpoint = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

var shape = {
   coords: [1, 1, 1, 20, 18, 20, 18, 1],
   type: 'poly'
 };


$(document).ready(function() {
  console.log("Sanity Check");

  callAjax();

}); //end documentready


function onSubmitReqSuccess(json){
  //  map generator
    var center ={lat: 30.2682, lng: -97.74295};
    var map = new google.maps.Map(document.getElementById('map'), {
      center: center,
      zoom: 3,
      mapTypeId: 'terrain'
    });

    console.log(json.features);
    json.features.forEach(function(earthquake){
      // parsing for location
      var titleSplit = earthquake.properties.title.split(" ");
      var protoTitleSplit = titleSplit.slice(6, titleSplit.length);

        //Time calculations
        var thePresent = new Date();
        var quakeTime = earthquake.properties.time;
        var days = Math.floor((thePresent-quakeTime)/(60*60*1000*24));
        var hours = Math.floor((thePresent-quakeTime)/(60*60*1000));
        var min = Math.floor((thePresent-quakeTime) /60000);
          if (hours === 1) {
            var timeHolder = ' hour ago in:'
          } else if (hours < 1){
            hours=min;
            timeHolder = ' minutes ago in:'
          } else if (hours > 48){
            hours=days;
            timeHolder = ' days ago in:'
          } else {
            timeHolder = ' hours ago in:'
          }
      // append information from JSON
      $('#info').append(hours + timeHolder);
      $("#info").append(`<p><b>${protoTitleSplit.join(" ")}</b></p>`);
      $("#info").append(`<p>${new Date(earthquake.properties.time)}</p><br></br>`);

      var pinlocations = {lat:earthquake.geometry.coordinates[1], lng: earthquake.geometry.coordinates[0]};
      var scaleSize = Math.pow(2, earthquake.properties.mag) / 2;
      var marker = new google.maps.Marker({
          position: pinlocations,
          map: map,
          // title: protoTitleSplit,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: scaleSize,
            fillColor: 'red',
            fillOpacity: .2,
            strokeColor: 'white',
            strokeWeight: .5
          },
          shape: shape
      });
    });
}

function onError(xhr, status, errorThrown) {
      alert("Sorry, there was a problem!");
      console.log("Error: " + errorThrown);
      console.log("Status: " + status);
      console.dir(xhr);
  }

function callAjax() {
  $.ajax({
    method: 'GET',
    url: weekly_quakes_endpoint,
    dataType: 'json',
    success: onSubmitReqSuccess,
    error: onError
  });
}
