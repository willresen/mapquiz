import React from 'react';

const Status = (props) => {
  return (
    <div id="status">
      <div id="questioncontainer">
        <div style={{textAlign: "center"}}>
          <button className='button' id='playagain'>Play Again</button>
        </div>
        <div id="question"><i>{props.question}</i></div>
      </div>
      <div id="answer">{props.result}</div>
    </div>
  );
};

export default Status;