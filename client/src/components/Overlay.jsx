import React from 'react';

const closePopup = () => {

}

const Overlay = () => {
  return (
    <div id="overlay">
      <div id="save" className="popup w3-animate-zoom">
        <div id="close_button" onClick={closePopup('save', 'overlay')}>×</div>
        <div id="save_instructions">Copy this ID to save your quiz!</div>
        <textarea readOnly style={{width: "155px", height: "14px", resize: "none", textAlign: "center"}} id="custom_quiz_link" onClick={e => e.target.select()}></textarea>
      </div>
      <div id="load" className="popup w3-animate-zoom">
        <div id="close_button" onClick={closePopup('load', 'overlay')} style={{left: "485px", top: "-10px"}}>×</div>
        <textarea id="quiz_to_load" maxLength="20" onClick={e => e.target.select()} placeholder="Paste your quiz ID here!" onFocus={ e => e.target.placeholder = ''} onBlur={e => e.target.placeholder = 'Paste your quiz ID here!'} spellCheck="false"></textarea>
      </div>
    </div>
  );
};

export default Overlay;
