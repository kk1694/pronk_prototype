import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";

function TranscriptDisplay(props) {
  return (
    <Grid container>
      {props.transcript.map(({ speaker, time, line }) => (
        <Typography variant="body1" align="justify">
          <b>{speaker}</b> <i>{time}</i>: {line}
        </Typography>
      ))}
    </Grid>
  );
}

export default TranscriptDisplay;
