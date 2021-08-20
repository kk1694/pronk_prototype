import { useAuth0 } from "@auth0/auth0-react";
import { Container, Divider, Grid, makeStyles } from "@material-ui/core";
import React, {useEffect} from "react";
import { useHistory } from "react-router-dom";
import RecordingCard from "../components/RecordingCard";

const useStyles = makeStyles({
  dashboardBody: { marginTop: 30 },
});

function Dashboard() {
  const history = useHistory();
  const classes = useStyles();

  const {user} = useAuth0();

  useEffect(() => {
    fetch('/api/opened_dashboard', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(user), // body data type must match "Content-Type" header
  }).then(response => {
    console.log(response)
  }).catch(error => {
    console.log('There was an error: ', error)
  })
  }, [])

  const sampleData = [
    {
      id: 6,
      title: "example ",
      subtitle: "2020 / 08 / 16",
      description: "asdfasdfkjlkjlkajkdsf",
    },
    {
      id: 1,
      title: "example ",
      subtitle: "2020 / 08 / 16",
      description: "asdfasdfkjlkjlkajkdsf",
    },
    {
      id: 2,
      title: "example ",
      subtitle: "2020 / 08 / 16",
      description: "asdfasdfkjlkjlkajkdsf",
    },
    {
      id: 3,
      title: "example ",
      subtitle: "2020 / 08 / 16",
      description: "asdfasdfkjlkjlkajkdsf",
    },
    {
      id: 4,
      title: "example ",
      subtitle: "2020 / 08 / 16",
      description: "asdfasdfkjlkjlkajkdsf",
    },
    {
      id: 5,
      title: "example ",
      subtitle: "2020 / 08 / 16",
      description: "asdfasdfkjlkjlkajkdsf",
    },
  ];

  return (
    <div className={classes.dashboardBody}>
      <Container>

      {JSON.stringify(user, null, 2)}

      Sub: {JSON.stringify(user.sub, null, 2)}

      {/* Name: {user.name}

      Id: {JSON.stringify(user.identities, null, 2)} */}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} l={2}>
            <RecordingCard
              carddata={{
                id: 0,
                title: "New Note",
                subtitle: "Go to recording screen",
                description: "Make notes for a new recording",
              }}
              onClick={() => history.push({pathname: "/create", state: {project_id: 'asdfasdf'}})}
            />
          </Grid>

          {sampleData.map((carddata) => (
            <Grid item key={carddata.id} xs={12} sm={6} md={3} l={2}>
              <RecordingCard
                carddata={carddata}
                onClick={() => alert("TODO")}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Divider />
    </div>
  );
}

export default Dashboard;
