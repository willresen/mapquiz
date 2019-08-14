import React from 'react';
import ReactDOM from 'react-dom';
import MapContainer from './components/Map.jsx';
import Overlay from './components/Overlay.jsx';
import Status from './components/Status.jsx';
import Sidebar from './components/Sidebar.jsx';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      markers: [],
      currentQuestion: null,
      saved: false,
      loaded: false,
    }
    this.closePopup = this.closePopup.bind(this);
    this.fetchMarkers = this.fetchMarkers.bind(this);
  }

  closePopup(popup, overlay) {
    document.getElementById(popup).classList.remove("w3-animate-zoom");
    void document.getElementById(popup).offsetWidth;
    document.getElementById(popup).classList.add("w3-animate-zoomout");
    setTimeout(function () {
      document.getElementById(overlay).style.display = "none";
      document.getElementById(popup).style.display = "none";
    }, 0)
  }

  fetchMarkers(locations) {
    fetch('/api/locations/', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: locations
    })
      .then(result => result.json())
      .then(result => this.setState({ markers: result }));
  }

  render() {
    return (
      <div id="wrapper">
        <Status />
        <div id="main">
          <Overlay closePopup={this.closePopup}/>
          <Sidebar fetchMarkers={this.fetchMarkers}/>
          <MapContainer />
        </div>
      </div>
    )
  }

}

export default App;
