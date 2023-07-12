
mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
      center: campground.geometry.coordinates, // starting position [lng, lat]
      zoom: 10, // starting zoom
      attributionControl: false
  });

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h6>${campground.title}</h6>`
    )
)
.addTo(map);  

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
directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    interactive: false,
});
map.addControl(directions,'top-left');
map.on('load',  function() {
    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //       directions.setOrigin([position.coords.longitude, position.coords.latitude]);
    //     });
    //   }
    // can be address in form setOrigin("12, Elm Street, NY")
    directions.setDestination(campground.location); // can be address
})
map.addControl(new mapboxgl.FullscreenControl());