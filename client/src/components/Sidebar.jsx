import React from 'react';

const Sidebar = (props) => (
  <div id="sidebar">
    <div id="sidebar_contents">
      <textarea
        onChange={props.handleChange}
        value={props.locationInput}
        id="address"
        rows="8"
        placeholder="Enter one location per line">
      </textarea>
      <div id="control_buttons">
        <button id="createnewquiz" onClick={props.fetchMarkers}>Create Quiz</button><br></br>
        <button id="savequiz">Save</button>
        <button id="load_tab_button">Load</button>
      </div>
    </div>
  </div>
);

export default Sidebar;