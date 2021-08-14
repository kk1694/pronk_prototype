import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    fontSize: 18,
    minWidth: '300px',
    minHeight: '60px',
  },
  container: {
    padding: 5
  },
  single: {
    margin: 5,
  }
});


function TappyButton(props) {

  const buttonStyles = useStyles();

  const [numClicks, setNumClicks] = useState(0);

  const handleClick = (e) => {
    e.preventDefault();

    setNumClicks(numClicks + 1);

    props.onButtonClick({
      //key: Math.floor(Math.random() * 100000),
      name: props.name,
      time: new Date().toISOString(),
    });
  };

  if (numClicks === 0) {
    return (
      <Button
        className={`${buttonStyles.root} ${buttonStyles.single}`}
        onClick={handleClick}
        color="primary"
        variant='outlined'
      >
        {props.name}
      </Button>
    );
  } else {
    return (

      <ButtonGroup className={`${buttonStyles.root} ${buttonStyles.container}`} color="primary" aria-label="outlined primary button group">
        <Button className={buttonStyles.root} onClick={handleClick} style={{minWidth: "75%"}}>{props.name}</Button>
        <Button className={buttonStyles.root} onClick={handleClick} style={{minWidth: "25%"}}> {numClicks}</Button>
      </ButtonGroup>
    );
  }
}

export default TappyButton;
