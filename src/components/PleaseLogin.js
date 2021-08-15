import { Typography } from "@material-ui/core";
import { Container, Divider } from "@material-ui/core";
import React from "react";
import LoginButton from "./LoginButton";

function PleaseLogin() {
  return (
    <Container maxWidth="sm" justify="center" align="center">
      <Container style={{ marginTop: "20vh" }}>
        <Typography variant="h2" gutterBottom>
          Noki.ai
        </Typography>
        <Typography variant="body" gutterBottom>
          Please log in to continue using the app
        </Typography>

        <Divider style={{ margin: 20 }} />
        <LoginButton color="primary" variant="contained" />
      </Container>
    </Container>
  );
}

export default PleaseLogin;
