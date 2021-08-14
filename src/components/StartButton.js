import React from "react";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #fe6b8b, #ff8e53)',
    border: 0,
    minHeight: '60px',
    minWidth: '300px',
    marginBottom: 40,
    borderRadius: 30,
    color: 'white',
  }
})

function StartButton(props) {

  const classes = useStyles();

  const handleClick = e => {

    e.preventDefault();

    props.onStartStop({});
  };

  return (
      <Button
        className={classes.root}
        onClick={handleClick}
        
        //variant="contained"
        //style={{ fontSize: 24, minWidth: "300px", minHeight: "60px" }}
      >
        {props.running? 'Start' : 'Stop'}
      </Button>
  );
}

export default StartButton;
