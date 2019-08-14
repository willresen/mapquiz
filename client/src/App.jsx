import React from 'react';
import ReactDOM from 'react-dom';
import MapContainer from './components/Map.jsx';
import Overlay from './components/Overlay.jsx';
import Status from './components/Status.jsx';
import Sidebar from './components/Sidebar.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationInput: '',
      markers: [],
      currentQuestion: null,
      saved: false,
      loaded: false,
    };
    this.fetchMarkers = this.fetchMarkers.bind(this);
    this.handleChange = this.handleChange.bind(this);
  };

  fetchMarkers() {
    fetch('/api/locations/', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: this.state.locationInput
    })
      .then(result => result.json())
      .then(result => this.setState({ markers: result }));
  };

  handleChange(e) {
    this.setState({ locationInput: e.target.value })
  };

  render() {
    return (
      <div id="wrapper">
        <Status />
        <div id="main">
          <Overlay />
          <Sidebar fetchMarkers={this.fetchMarkers}
            handleChange={this.handleChange}
            locationInput={this.state.locationInput} />
          <MapContainer />
        </div>
      </div>
    )
  }

}

export default App;
