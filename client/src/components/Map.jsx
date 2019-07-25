import React from 'react';

const Map = () => {
  return (
    <div id="mapframe">
      <div id="mapoverlay">
        <div id="status" className="w3-animate-zoom"></div>
        <div id="instructions" className="w3-animate-zoom">
          <div id="instructions_title">Instructions</div>
          <div id="instructionslist">
              <li>Enter one location per line in the sidebar.</li>
              <li>Click <i>Create Quiz</i>.</li>
              <p>To save a quiz, click <i>Save</i> and store your quiz ID somewhere safe. To load a map, click <i>Load</i>, paste your quiz ID and hit Enter.</p>
              <p><b>Tip:</b> To move a marker, right-click and drag it to a new location.</p>
          </div>
        </div>
      </div>
      <div id="map"></div>
    </div>
  )
};

export default Map;