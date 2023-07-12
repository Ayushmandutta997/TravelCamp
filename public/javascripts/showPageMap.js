mapboxgl.accessToken = mapToken;
// Create a new map instance
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
    attributionControl: false
});

// Add a marker to the map  
new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h6>${campground.title}</h6>`
    )
)
.addTo(map);  

// Add navigation control to the map
map.addControl(new mapboxgl.NavigationControl());
map.addControl(  
new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
    }),
);

// Check window width to determine if profile switcher should be enabled
let ps;
const windowWidth = window.innerWidth || document.documentElement.clientWidth;
if (windowWidth < 768) {
    ps=false;
}
else
{
    ps=true;
}

// Create a new MapboxDirections instance
directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    profile: "mapbox/driving-traffic",
    controls:{
        // Enable or disable the profile switcher and directions based on screen size
        profileSwitcher: ps,
        instructions:ps
    }
});

// Add MapboxDirections control to the map
map.addControl(directions,'top-left');

// Set the destination for directions
map.on('load',  function() {
    directions.setDestination(campground.location); // can be address
})

// Add fullscreen control to the map
map.addControl(new mapboxgl.FullscreenControl());