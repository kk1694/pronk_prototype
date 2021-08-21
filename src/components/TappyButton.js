import React from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    fontSize: 18,
    minWidth: "300px",
    minHeight: "60px",
  },
  container: {
    padding: 5,
  },
  single: {
    margin: 5,
  },
});

function TappyButton(props) {
  const buttonStyles = useStyles();

  const handleClick = (e) => {
    e.preventDefault();

    console.log(props.numClicks);

    props.onButtonClick({
      id: props.id,
      name: props.name,
      time: new Date().toISOString(),
    });
  };

  if (props.numClicks === 0) {
    return (
      <Button
        className={`${buttonStyles.root} ${buttonStyles.single}`}
        onClick={handleClick}
        disabled={props.disabled}
        color="primary"
        variant="outlined"
      >
        {props.name}
      </Button>
    );
  } else {
    return (
      <ButtonGroup
        className={`${buttonStyles.root} ${buttonStyles.container}`}
        color="primary"
        aria-label="outlined primary button group"
      >
        <Button
          className={buttonStyles.root}
          onClick={handleClick}
          disabled={props.disabled}
          style={{ minWidth: "75%" }}
        >
          {props.name}
        </Button>
        <Button
          className={buttonStyles.root}
          onClick={handleClick}
          disabled={props.disabled}
          style={{ minWidth: "25%" }}
        >
          {" "}
          {props.numClicks}
        </Button>
      </ButtonGroup>
    );
  }
}

export default TappyButton;
