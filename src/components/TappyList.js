import { Container } from "@material-ui/core";
import React from "react";
import TappyButton from "./TappyButton";

function TappyList(props) {
  return props.buttonList.map((buttonName, index) => (
    <Container key={index}>
      <TappyButton
        onButtonClick={props.handleTap}
        name={buttonName}
        id={index}
        numClicks={props.numClicks[index]}
      />
    </Container>
  ));
}

export default TappyList;
