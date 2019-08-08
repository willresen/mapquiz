import React from 'react';

const toggleSidebar = () => {

};

const closePopup = () => {

};

const Sidebar = () => {
  return (
    <div id="sidebar">
      <div id="sidebar_toggle" onClick={toggleSidebar}>. . . . .</div>
      <div id="sidebar_contents" style={{display: "block"}}>
        <textarea name="comment" id="address" rows="8" placeholder="Enter one location per line"></textarea>

        <div id="control_buttons">
          <button className="button" id="createnewquiz">Create Quiz</button><br></br>
          <button className="button" id="savequiz">Save</button>
          <button className="button" onClick={() => { closePopup('instructions', 'mapoverlay'); openPopup('load', 'overlay')} }
            id="load_tab_button">Load</button>
        </div>

      </div>
    </div>
  )
}

export default Sidebar;