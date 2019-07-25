import React from 'react';

const Status = () => {
  return (
    <div>
      <div id="questioncontainer">
        <div style={{textAlign: "center"}}>
          <button className='button' id='playagain'>Play Again</button>
        </div>
        <div id="question"><i>There are no markers placed on the map.</i></div>
      </div>
      <div id="answer"></div>
    </div>
  );
};

export default Status;