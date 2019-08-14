window.initMap = () => {
  var styledMapType = new google.maps.StyledMapType(
    [
      { "elementType": "labels", "stylers": [{ "visibility": "off" }] },
      { "featureType": "administrative.neighborhood", "stylers": [{ "visibility": "off" }] },
      { "featureType": "road", "stylers": [{ "visibility": "off" }] },
    ]
  );

  window.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    minZoom: 2.4,
    center: { lat: 34.397, lng: 10.644 },
    mapTypeControlOptions: { mapTypeIds: ['styled_map'] },
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    backgroundColor: 'hsla(0, 0%, 0%, 0)',
  });

  window.map.mapTypes.set('styled_map', styledMapType);
  window.map.setMapTypeId('styled_map');

  window.geocoder = new google.maps.Geocoder();
  window.service = new google.maps.places.PlacesService(window.map);
} /* End of initMap() */
