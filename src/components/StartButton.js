import React from "react";
import Button from "@material-ui/core/Button";

function StartButton(props) {

  const handleClick = e => {

    e.preventDefault();

    props.onStartStop({});
  };

  return (
    <div>
      <Button
        className="StartButton"
        onClick={handleClick}
        variant="contained"
        style={{ fontSize: 24, minWidth: "300px", minHeight: "60px" }}
      >
        {props.running? 'Start' : 'Stop'}
      </Button>
    </div>
  );
}

export default StartButton;
