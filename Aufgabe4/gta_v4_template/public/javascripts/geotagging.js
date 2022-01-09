// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function updateLocation() {

    var lat = document.getElementById("in_latitude").value;
    var lon = document.getElementById("in_longitude").value;
    var d_lat = document.getElementById("search_latitude").value;
    var d_lon = document.getElementById("search_longitude").value;
    
    if ((lat == null || lat.length == 0) || (lon == null || lon.length == 0) && (d_lat == null || d_lat.length == 0) || (d_lon == null || d_lon.length == 0)) {

        var set = function(location) {
            let latitude = location.latitude;
            let longitude = location.longitude;

            document.getElementById("in_latitude").setAttribute('value', latitude);
            document.getElementById("in_longitude").setAttribute('value', longitude);
            document.getElementById("search_latitude").setAttribute('value', latitude);
            document.getElementById("search_longitude").setAttribute('value', longitude);

            let map = new MapManager('Fkc6hFHf8lS9AHGTNSrAERPJsXhgq2c4');
            let url = map.getMapUrl(latitude, longitude);

            document.getElementById('mapView').setAttribute('src', url);
        }

        LocationHelper.findLocation(set);
    } else {
        setMap(lat, lon);
    }
    
}

function setMap(lat, lon) {
    var tags = document.getElementById("mapView").getAttribute('data-tags');
    var geotags = JSON.parse(tags);

    console.log(geotags);

    let map = new MapManager('Fkc6hFHf8lS9AHGTNSrAERPJsXhgq2c4');
    let url = map.getMapUrl(lat, lon, geotags);

    document.getElementById('mapView').setAttribute('src', url);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    alert("Please change the script 'geotagging.js'");
    updateLocation();
});