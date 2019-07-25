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
       <Overlay/>
       <Sidebar/>
       <Map/>
       <Status/>
     </div>
    )
  }

}

export default App;
