import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map.jsx';
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
  }

  render() {
    return (
      <div id="wrapper">
        {/* <Status /> */}
        <div id="main">
          <Overlay />
          <Sidebar />
          <Map />
        </div>
      </div>
    )
  }

}

export default App;
