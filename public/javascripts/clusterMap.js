mapboxgl.accessToken = mapToken;

// Creating clustermap using mapboxgl object
const map = new mapboxgl.Map({
    container: 'cluster-map',
    // Mapbox's core styles
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    center: [78.9629, 20.5937],
    zoom: 2,
    attributionControl: false
});
 
map.on('load', () => {
    // Adding a new source from our GeoJSON data and
    // setting the 'cluster' option to true. GL-JS will
    // add the point_count property to source data.
    map.addSource('campgrounds', {
    type: 'geojson',
    // Point to GeoJSON data. 
    data: campgrounds,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });
    
    // Adding the 'clusters' layer to display clustered points as circles 
    map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
    // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 30
    //   * Yellow, 30px circles when point count is between 30 and 50
    //   * Pink, 40px circles when point count is greater than or equal to 50
    'circle-color': [
    'step',
    ['get', 'point_count'],
    'blue',
    30,
    'green',
    50,
    'yellow'
    ],
    'circle-radius': [
    'step',
    ['get', 'point_count'],
    20,
    10,
    30,
    30,
    40
    ]
    }
    });

    // Adding the 'cluster-count' layer to display the count of points 
    // within each cluster
    map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
    'text-field': ['get', 'point_count_abbreviated'],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
    }
    });

    // Adding the 'unclustered-point' layer
    // to display individual points that are not clustered
    map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
    'circle-color': '#FFFF99',
    'circle-radius': 10,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
    }
    });
 
    // Handling click events on clustered points
    map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
            });

            const clusterId = features[0].properties.cluster_id;
        map.getSource('campgrounds').getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
            if (err) return;
            map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
            });
            }
        );
    });
    
    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const popUpMarkup=e.features[0].properties.popUpMarkup; 
    // Ensure that if the map is zoomed out such that
    // multiple copies of the feature are visible, the
    // popup appears over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Popup properties on clicking at campground
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(popUpMarkup)
    .addTo(map);
    });
    
    // Changing cursor style when hovering over clusters
    map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
    });
});

// Adding navigation control and fullscreen control to the map
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());