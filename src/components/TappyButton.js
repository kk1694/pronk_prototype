import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";

function TappyButton(props) {
  const [numClicks, setNumClicks] = useState(0);

  const handleClick = (e) => {
    e.preventDefault();

    setNumClicks(numClicks + 1);

    props.onButtonClick({
      name: props.name,
      time: new Date().toISOString(),
    });
  };

  if (numClicks === 0) {
    return (
      <Button
        className="Button"
        onClick={handleClick}
        variant="contained"
        style={{ fontSize: 18, minWidth: "300px", minHeight: "60px" }}
      >
        {props.name}
      </Button>
    );
  } else {
    return (

      <ButtonGroup color="primary" aria-label="outlined primary button group" style={{ fontSize: 18, minWidth: "300px", minHeight: "60px" }}>
        <Button onClick={handleClick} style={{ fontSize: 18, minWidth: "75%"}}>Bookmark</Button>
        <Button onClick={handleClick} style={{ fontSize: 18, minWidth: "25%"}}> {numClicks}</Button>
      </ButtonGroup>
    );
  }
}

export default TappyButton;
