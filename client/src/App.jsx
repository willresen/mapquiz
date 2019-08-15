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
      quizPool: [],
      currentQuestion: null,
      saved: false,
      loaded: false,
    };
    this.fetchMarkers = this.fetchMarkers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.generateQuiz = this.generateQuiz.bind(this);
  };

  fetchMarkers() {
    fetch('/api/locations/', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: this.state.locationInput
    })
      .then(result => result.json())
      .then(result => this.setState({ markers: result }))
      .then(this.renderMarkers)
      .then(this.generateQuiz)
  };

  renderMarkers() {
    let quizPool = [];
    this.state.markers.forEach(marker => {
      const mark = new google.maps.Marker({ map: map, position: marker.position });
      mark.addListener('click', () => this.checkAnswer(marker.location));
      quizPool.push(marker.location);
    });
    this.setState({quizPool: quizPool});
  };

  generateQuiz() {
    this.setState({quizPool: this.shuffle(this.state.quizPool)});
  };

  shuffle(array) {
    let current = array.length;
    let temp, random;
    while(current) {
      random = Math.floor(Math.random() * current--);
      temp = array[random];
      array[random] = array[current];
      array[current] = temp;
    }
    return array;
  };

  checkAnswer(location) {
    console.log(`Clicked location: ${location}. Current Question: ${this.state.currentQuestion}`);
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
    );
  };

};

export default App;
