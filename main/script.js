var map;
var startMarker = null;
var endMarker = null;
var routingControl = null;
var graph = {};

function initMap() {
    map = L.map('map').setView([0, 0], 1);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function(event) {
        handleMapClick(event.latlng);
    });
}

function resetMap() {
    map.setView([0, 0], 1);
    map.removeLayer(startMarker);
    map.removeLayer(endMarker);
    map.removeControl(routingControl);
    startMarker = null;
    endMarker = null;
    routingControl = null;
    graph = {};
}

function handleMapClick(latlng) {
    if (!startMarker) {
        startMarker = L.marker(latlng).addTo(map).bindPopup('Start Location').openPopup();
        console.log('Start Location:', latlng.lat, latlng.lng);
        map.flyTo(latlng, 14);
    } else if (!endMarker) {
        endMarker = L.marker(latlng).addTo(map).bindPopup('End Location').openPopup();
        console.log('End Location:', latlng.lat, latlng.lng);

        findShortestPath();
    }
}
//Dijkstra's algorithm starts here
function findShortestPath() {
    var start = startMarker.getLatLng();
    var end = endMarker.getLatLng();
    console.log('Finding shortest path between:', start, end);

    if (routingControl) {
        map.removeLayer(routingControl);
    }

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(start.lat, start.lng),
            L.latLng(end.lat, end.lng)
        ],
        routeWhileDragging: false
    }).addTo(map);

    routingControl.on('routesfound', function(e) {
        var routes = e.routes;
        if (routes && routes.length > 0) {
            var route = routes[0];
            var coordinates = route.coordinates;
            graph['path'] = coordinates;
            console.log('Path:', coordinates);

            // Simulate traffic details
            var trafficDetails = "Traffic is moderate. Estimated time: 15 minutes.";
            graph['traffic'] = trafficDetails;
        }
    });
}

function createGraphVisualization() {
    if (graph && graph.path) {
        var pathCoordinates = graph.path;

        // Save the graph data in sessionStorage to pass it to graph.html
        sessionStorage.setItem('graphData', JSON.stringify({
            path: pathCoordinates,
            traffic: graph.traffic || "No traffic information available."
        }));

        // Open the graph.html in a new window
        var popupWindow = window.open("graph.html", "_blank");
    }
}

initMap();