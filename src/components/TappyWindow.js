import { Container } from "@material-ui/core";
import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";

import StartButton from "./StartButton";
import TappyList from "./TappyList";

function TappyWindow() {

  const [running, setRunning] = useState(false);

  const handleStartStop = () => {
    setRunning(!running);
  };

  return (
    <Container maxWidth='sm'>
      <Grid
        container
        alignItems="center"
        justify="center"
        align = "center"
        
        style={{ minHeight: "100vh"}}
      >
        <Grid item>
          <StartButton onStartStop={handleStartStop} running={running} />

            <div>
            {running ? "App is running" : "App is stopped"}

            </div>
          

          <TappyList />
        </Grid>
      </Grid>

    </Container>
  );
}

export default TappyWindow;
