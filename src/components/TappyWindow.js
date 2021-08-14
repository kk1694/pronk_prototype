import { Container } from "@material-ui/core";
import React, { useState } from "react";

import StartButton from "./StartButton";
import TappyList from "./TappyList";
import TappyComment from "./TappyComment";

function TappyWindow() {
  const buttonList = [
    "Bookmark",
    "Positive",
    "Negative",
    "Insight",
    "Action Item",
  ];
  //const numClicks = new Array(buttonList.length).fill(0);
  const [running, setRunning] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [numClicks, setNumClicks] = useState(
    new Array(buttonList.length).fill(0)
  );

  const handleStartStop = () => {
    setRunning(!running);
  };

  const handleTap = ({ id, name, time }) => {
    const copyNums = numClicks.slice();

    copyNums[id] += 1;
    setNumClicks(copyNums);
    console.log(id, name, time);

    setIsForm(true);
  };

  const handleComment = (comment) => {
    console.log(comment);
    setIsForm(false);
  };

  return (
    <Container maxWidth="sm" justify="center" align="center">
      <Container style={{ marginTop: "20vh" }}>
        <StartButton onStartStop={handleStartStop} running={running} />
      </Container>

      <Container>
        {isForm ? (
          <TappyComment handleComment={handleComment} />
        ) : (
          <TappyList
            handleTap={handleTap}
            buttonList={buttonList}
            numClicks={numClicks}
          />
        )}
      </Container>
    </Container>
  );
}

export default TappyWindow;
