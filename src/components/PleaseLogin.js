import { Typography } from "@material-ui/core";
import { Container, Divider } from "@material-ui/core";
import React , {useState, useEffect}from "react";
import LoginButton from "./LoginButton";

function PleaseLogin() {

  /// This is for the dummy flask integration
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  const [userList, setUserList] = useState('no luck');

  useEffect(() => {
    fetch('/api/list_users').then(res => res.json()).then(data => {
      setUserList(JSON.stringify(data));
    });
  }, []);

  const domain = process.env.REACT_APP_AUTH0_DOMAIN;

  return (
    <Container maxWidth="sm" justify="center" align="center">

      Users: {userList}

      <Container style={{ marginTop: "20vh" }}>
        <Typography variant="h2" gutterBottom>
          Noki.ai
          domain: {(domain) ? 'not null' : 'null'}
        </Typography>
        <Typography variant="body" gutterBottom>
          Please log in to continue using the app. 
          <Divider/>
          {/* Below is for testing backend comm  */}
          Current time is {currentTime}
        </Typography>

        <Divider style={{ margin: 20 }} />
        <LoginButton color="primary" variant="contained" />
      </Container>
    </Container>
  );
}

export default PleaseLogin;
