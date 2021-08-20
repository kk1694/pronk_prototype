import { Container } from "@material-ui/core";
import React, { useState } from "react";

import StartButton from "./StartButton";
import TappyList from "./TappyList";
import TappyComment from "./TappyComment";
import { useAuth0 } from "@auth0/auth0-react";

function TappyWindow() {
  const buttonList = [
    "Bookmark",
    "Positive",
    "Negative",
    "Insight",
    "Action Item",
  ];

  const {user} = useAuth0();

  const tapInfoInit = buttonList.map( category => {
    return ({'category': category,
     'tap_times': [],
     comments: []});
  });

  const [tapInfo, setTapInfo] = useState(tapInfoInit)

  //const numClicks = new Array(buttonList.length).fill(0);
  const [running, setRunning] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [numClicks, setNumClicks] = useState(
    new Array(buttonList.length).fill(0)
  );
  const [currentTapID, setcurrentTapID] = useState(0)
  const [currentTapTime, setCurrentTapTime] = useState(0)

  const handleStartStop = () => {
    setRunning(!running);
  };

  const handleTap = ({ id, name, time }) => {
    const copyNums = numClicks.slice();

    copyNums[id] += 1;
    setNumClicks(copyNums);
    console.log(id, name, time);

    setcurrentTapID(id);
    setCurrentTapTime(time);
    setIsForm(true);
  };

  const handleComment = ({ id, time, comment }) => {
    console.log(id, time, comment);
    const copyTapInfo = tapInfo.slice();

    copyTapInfo[id]['tap_times'].concat(time);
    copyTapInfo[id]['comments'].concat(comment);

    setTapInfo(copyTapInfo);

    setIsForm(false);
  };

  return (
    <Container maxWidth="sm" justify="center" align="center">
      <Container style={{ marginTop: "20vh" }}>
        <StartButton onStartStop={handleStartStop} running={running} />
      </Container>

      <Container>

        {JSON.stringify(tapInfo)}

      </Container>

      <Container>
        {isForm ? (
          <TappyComment handleComment={handleComment} id={currentTapID} time={currentTapTime} />
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
