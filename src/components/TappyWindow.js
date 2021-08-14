import { Container } from "@material-ui/core";
import React, { useState } from "react";

import StartButton from "./StartButton";
import TappyList from "./TappyList";
import TappyComment from "./TappyComment";

function TappyWindow() {
  const [running, setRunning] = useState(false);
  const [isForm, setIsForm] = useState(false);

  const handleStartStop = () => {
    setRunning(!running);
  };

  const handleTap = (name, time) => {
    console.log(name, time);
    setIsForm(true);
  };

  const handleComment = (comment) => {
      console.log(comment)
    setIsForm(false);
  }

  return (
    <Container
      maxWidth="sm"
      justify="center"
      align="center"
    >
      <Container style={{marginTop: '20vh'}}>
        <StartButton onStartStop={handleStartStop} running={running} />
      </Container>

      <Container>
        {isForm ? <TappyComment handleComment={handleComment}/> : <TappyList handleTap={handleTap} />}
      </Container>
    </Container>

  );
}

export default TappyWindow;
