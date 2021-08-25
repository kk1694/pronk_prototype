import { Container } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import StartButton from "./StartButton";
import TappyList from "./TappyList";
import TappyComment from "./TappyComment";


function TappyWindow(props) {
  const buttonList = [
    "Bookmark",
    "Positive",
    "Negative",
    "Insight",
    "Action Item",
  ];

  const history = useHistory();


  const tapInfoInit = buttonList.map( category => {
    return ({'category': category,
     'tap_times': [],
     comments: []});
  });

  const [tapInfo, setTapInfo] = useState(tapInfoInit)

  //const numClicks = new Array(buttonList.length).fill(0);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [isForm, setIsForm] = useState(false);
  const [numClicks, setNumClicks] = useState(
    new Array(buttonList.length).fill(0)
  );
  const [currentTapID, setcurrentTapID] = useState(0)
  const [currentTapTime, setCurrentTapTime] = useState(0)

  const handleStartStop = () => {

    //Stop button was pressed
    if (running) {
      fetch('/api/create_new_note', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({'project_id': props.project_id, "data": tapInfo, 
          'start_time': startTime,
          'end_time': new Date().toISOString()}),
    }).then(response => {
      console.log(response)
    }).catch(error => {
      console.log('There was an error: ', error)
    });
    history.push("/")
    }
    else {
      setStartTime(new Date().toISOString());
    }

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

    copyTapInfo[id]['tap_times']= copyTapInfo[id]['tap_times'].concat(time);
    copyTapInfo[id]['comments'] = copyTapInfo[id]['comments'].concat(comment);

    setTapInfo(copyTapInfo);

    setIsForm(false);
  };

  return (
    <Container maxWidth="sm" justify="center" align="center">
      <Container style={{ marginTop: "20vh" }}>
        <StartButton onStartStop={handleStartStop} running={running} />
      </Container>

      <Container>
        {isForm ? (
          <TappyComment handleComment={handleComment} id={currentTapID} time={currentTapTime} />
        ) : (
          <TappyList
            handleTap={handleTap}
            buttonList={buttonList}
            numClicks={numClicks}
            disabled={!running}
          />
        )}
      </Container>
    </Container>
  );
}

export default TappyWindow;
