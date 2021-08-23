import { Container, Typography } from "@material-ui/core";
import React from "react";

function TranscriptDisplay(props) {
  return (
    <Container>
      {props.transcript.map(({ speaker, time, line }) => (
        <Typography variant="body1">
          <b>{speaker}</b> <i>{time}</i>: {line}
        </Typography>
      ))}
    </Container>
  );
}

export default TranscriptDisplay;
