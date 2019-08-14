import React from 'react';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({locations: e.target.value})
  }

  render() {
    return (
      <div id="sidebar">
        <div id="sidebar_contents">
          <textarea
            onChange={(e) => this.handleChange(e)}
            value={this.state.locations}
            id="address"
            rows="8"
            placeholder="Enter one location per line">
          </textarea>
          <div id="control_buttons">
            <button id="createnewquiz" onClick={() => this.props.fetchMarkers(this.state.locations)}>Create Quiz</button><br></br>
            <button id="savequiz">Save</button>
            <button onClick={() => { closePopup('instructions', 'mapoverlay'); openPopup('load', 'overlay') }}
              id="load_tab_button">Load</button>
          </div>
        </div>
      </div>
    )
  }

}

export default Sidebar;