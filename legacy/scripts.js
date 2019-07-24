/*  **********************
This is the OG source code
for the original 2018 project.
Proceed with caution!
************************* */

var global = {
  firstLoad: true,
  googleMarkers: [],
  markerPositions: {},
  markersArray: [],
  saved: false,
  loaded: false,
  quizID: "",
  correctSound: new Audio("correct.mp3"),
}

function initMap() {
  var styledMapType = new google.maps.StyledMapType(
    [
      { "elementType": "labels", "stylers": [{ "visibility": "off" }] },
      { "featureType": "administrative.neighborhood", "stylers": [{ "visibility": "off" }] },
      { "featureType": "road", "stylers": [{ "visibility": "off" }] },
    ]);

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    minZoom: 2.4,
    center: { lat: 34.397, lng: 10.644 },
    mapTypeControlOptions: { mapTypeIds: ['styled_map'] },
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    backgroundColor: 'hsla(0, 0%, 0%, 0)',
  });

  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  var geocoder = new google.maps.Geocoder();
  var service = new google.maps.places.PlacesService(map);

  document.getElementById('createnewquiz').addEventListener('click', function () {
    if(document.getElementById('address').value.trim() === ""){
      alert("Please enter at least two locations before creating a quiz.")
    } else {
      global.googleMarkers = document.getElementById('address').value.split("\n").map(elem=>elem.trim()).filter(elem => elem.length != 0);
      global.markerPositions = {};
      global.saved = false;
      global.loaded = false;
      generateQuiz(geocoder, map, service);
    }
  });

  document.getElementById('quiz_to_load').addEventListener('keydown', function(event){
    if(event.keyCode === 13){
      loadQuiz();
      closePopup('load', 'overlay');
      setTimeout(function(){ generateQuiz(geocoder, map, service) }, 100);
    }
  })

  document.addEventListener('keydown', function(event){
    if(event.keyCode === 221){
      event.preventDefault();
      closePopup('instructions', 'mapoverlay');
      openPopup('load', 'overlay');
    }
  })

  document.getElementById('savequiz').addEventListener('click', function () {
    if (Object.keys(global.markerPositions).length === 0) {
      alert("Please create or load a map!")
    } else if (global.saved === true){  // If quiz has already been saved and not edited, don't generate new ID (only for retrieval of ID)
      openPopup('save', 'overlay');
    } else {
      saveQuiz();
      openPopup('save', 'overlay');
    }
  });
  /* End of initMap() */
}

function generateQuiz(geocoder, resultsMap, service) {
  global['markerBounds'] = new google.maps.LatLngBounds();
  clearExistingQuiz();

  var quizPool = [];
  var count = 0;
  var loadCount = 0;
  var delay = 100;
  var currentQuestion;

  if (global.loaded === true) {
    /* Render markers from savefile */
    Object.keys(global.markerPositions).forEach(location => {
      quizPool.push(location);
      setTimeout(function () { renderMarker(global.markerPositions[location], location) }, delay);
      delay += 50;
    });
  } else {
    /* Create markers from Google Geocoding and/or Places */
    global.googleMarkers.forEach(location => {
      quizPool.push(location);
      makeRequest('db_search.php?q=' + location, function (data) { /* Search database for address name */
        var id = data.responseText;
        if (!id) {
          createGeocodeMarker(location); /* If marker is not already in database, get its Geocode information from Google */
        } else {
          createDatabaseMarker(id, location); /* If marker is already in database, request its place_id */
        }
      });
    });
  }

  function createGeocodeMarker(address) {
    setTimeout(function () {
      geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
          renderMarker(results[0].geometry.location, address);

          /* Add marker to database */
          $.ajax({
            type: "POST",
            url: "db_add.php",
            data: 'name1=' + address.toLowerCase() + '&id1=' + results[0].place_id,
            cache: false,
          });

        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            delay = 5000;
            setTimeout(createGeocodeMarker(address), 100);
        } else {
            alert('Unable to mark "' + address + '" due to error '  + status);
            quizPool.splice(quizPool.indexOf(address), 1);
        }
      });
    }, delay);
    delay += 500;
  }

  function createDatabaseMarker(id, locationName) {
    setTimeout(function () {
      service.getDetails({ placeId: id }, function (result, status) {
        if (status === 'OK') {
          renderMarker(result.geometry.location, locationName);
        } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
          delay = 1000;
          console.log("Over query limit. Requesting data for " + locationName + " again.")
          setTimeout(createDatabaseMarker(id, locationName), 100);
        } else {
          alert('Unable to mark "' + locationName + '" due to error '  + status);
          quizPool.splice(quizPool.indexOf(locationName), 1);
        }
      });
    }, delay);
    delay += 350;
  }

  function renderMarker(position, locationName) {
    loadCount++;
    if (loadCount === quizPool.length) {
      closePopup('status', 'mapoverlay');
      setTimeout(() => {
        resultsMap.fitBounds(global.markerBounds);
        resultsMap.setCenter(global.markerBounds.getCenter());
      }, 0);
      askQuestion();
    } else {
      openPopup('status', 'mapoverlay');
    }
    document.getElementById('status').innerHTML = "Marking location " + loadCount + " of " + quizPool.length + "...";
    var marker = new google.maps.Marker({ map: resultsMap, position: position });
    global.markerPositions[locationName] = position;
    global.markersArray.push(marker);

    marker.addListener('click', function () {
      checkAnswer(locationName);
    });
    /* Enable marker dragging by right-clicking. Used to fix erroneous marker placement */
    marker.addListener('rightclick', function (event) {
      marker.setOptions({draggable: true});
      marker.setIcon("http://maps.google.com/mapfiles/ms/icons/blue-dot.png");
    });
    /* Save new position of marker */
    marker.addListener('dragend', function () {
      marker.setIcon();
      marker.setOptions({draggable: false});
      global.saved = false;
      global.markerPositions[locationName] = marker.position;
    });

    global.markerBounds.extend(position);
    /* End of renderMarker() */
  }

  function askQuestion() {
    if(count === 0){
      quizPool = shuffle(quizPool);
      setTimeout(() => currentQuestion = quizPool[count], 0);
    }
    if (quizPool[count].toLowerCase().includes(" islands") || quizPool[count].toLowerCase().includes(" mountains")) {
      document.getElementById('question').innerHTML = "Where are the " + quizPool[count].trim() + "?";
    } else if (quizPool[count].toLowerCase().includes(" canal") || quizPool[count].toLowerCase().includes(" strait") ||
               quizPool[count].toLowerCase().includes(" channel") || quizPool[count].toLowerCase().includes(" peninsula") ||
               quizPool[count].toLowerCase().includes(" river") || quizPool[count].toLowerCase().includes(" ocean") ||
               quizPool[count].toLowerCase().includes(" sea") || quizPool[count].toLowerCase().includes(" of ") ||
               quizPool[count].toLowerCase().includes(" gulf")) {
      document.getElementById('question').innerHTML = "Where is the " + quizPool[count].trim() + "?";
    } else {
      document.getElementById('question').innerHTML = "Where is " + quizPool[count].trim() + "?";
    }
  }

  function checkAnswer(address) {
    if (address === currentQuestion) {
      if (count === quizPool.length - 1) {
        global.correctSound.play();
        document.getElementById('question').innerHTML = "";
        document.getElementById('answer').innerHTML = '<div id="blink">You win!</div>';
        document.getElementById("answer").style.backgroundImage = "linear-gradient(to top, #0ba360 0%, #3cba92 100%)";
        document.getElementById('playagain').style.display = "inline"; /* Show "play again" button */
      } else {
        count++;
        global.correctSound.play();
        document.getElementById('answer').innerHTML = '<div id="blink">Correct!</div>';
        document.getElementById("answer").style.backgroundImage = "linear-gradient(to top, #0ba360 0%, #3cba92 100%)";
        askQuestion();
      }
      currentQuestion = quizPool[count];
    } else {
      document.getElementById('answer').innerHTML = '<div id="blink">Try again!</div>';
      document.getElementById("answer").style.backgroundImage = "linear-gradient(to top, #eb3349, #f45c43)";
    }
  }

  document.getElementById('playagain').addEventListener('click', function () { playAgain(); });
  function playAgain(){
    document.getElementById('playagain').style.display = "none";
    document.getElementById('answer').innerHTML = "";
    document.getElementById("answer").style.backgroundImage = "linear-gradient(to top, #dfe9f3 0%, white 100%)";
    count = 0;
    quizPool = shuffle(quizPool);
    currentQuestion = quizPool[count];
    setTimeout(function(){ askQuestion() }, 200);
  }
  /* End of generateQuiz() */
}

function clearExistingQuiz() {
    global.markersArray.forEach(marker => { marker.setMap(null) });
    global.markersArray.length = 0;
    closePopup('instructions', 'mapoverlay');
    document.getElementById('question').innerHTML = "";
    document.getElementById('answer').innerHTML = "";
    document.getElementById("answer").style.backgroundImage = "linear-gradient(to top, #dfe9f3 0%, white 100%)";
    document.getElementById('playagain').style.display = "none";
  }

/* Randomize question order */
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function openPopup(popup, overlay) {
  document.getElementById(popup).classList.remove("w3-animate-zoomout");
  void document.getElementById(popup).offsetWidth;
  document.getElementById(popup).classList.add("w3-animate-zoom");
  document.getElementById(overlay).style.display = "block";
  document.getElementById(popup).style.display = "block";
  $(document).keydown(function (event) {
    if (event.keyCode === 27) {
      closePopup(popup, overlay);
    }
  });
}

function closePopup(popup, overlay) {
  document.getElementById(popup).classList.remove("w3-animate-zoom");
  void document.getElementById(popup).offsetWidth;
  document.getElementById(popup).classList.add("w3-animate-zoomout");
  setTimeout(function () {
    document.getElementById(overlay).style.display = "none";
    document.getElementById(popup).style.display = "none";
  }, 0)
}

function toggleSidebar(){
  var x = document.getElementById("sidebar_contents");
  var y = document.getElementById("sidebar");
  if (x.style.display === 'block'){
    x.style.display = 'none';
    y.style.width = '11px';
  } else {
    x.style.display = 'block';
    y.style.width = '16%';
  }
}

function loadQuiz(){
  global.quizID = document.getElementById('quiz_to_load').value;
  global.loaded = true;
  global.saved = true;
  document.getElementById('address').value = "";
  document.getElementById('playagain').style.display = "none";
  document.getElementById('answer').innerHTML = "";
  document.getElementById("answer").style.backgroundImage = "linear-gradient(to top, #dfe9f3 0%, white 100%)";

  makeRequest('load_quiz.php?q=' + global.quizID, function (data) {
    if (!data.responseText) {
      alert("That quiz ID is invalid!");
      document.getElementById('quiz_to_load').value = "";
    } else {
      global.markerPositions = JSON.parse(data.responseText);
      Object.keys(global.markerPositions).forEach(location => {
        document.getElementById('address').value += location + "\n";
      });
    }
  });
  document.getElementById('custom_quiz_link').innerHTML = global.quizID;
}

function saveQuiz(){
  $.ajax({
          type: "POST",
          url: "save_quiz.php",
          data: 'markerPositions=' + JSON.stringify(global.markerPositions),
          cache: false,
          success: function(data){
            global.saved = true;
            global.quizID = data;
            document.getElementById('custom_quiz_link').innerHTML = data;
          }
        });
}

/* Get information from MySQL database */
function makeRequest(url, callback) {
  var request = window.ActiveXObject ?
  new ActiveXObject('Microsoft.XMLHTTP') :
  new XMLHttpRequest;
  function doNothing(){}
  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };
  request.open('GET', url, true);
  request.send(null);
}