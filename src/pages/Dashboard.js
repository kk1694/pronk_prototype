import { Container, Divider, Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import RecordingCard from "../components/RecordingCard";

const useStyles = makeStyles({
  dashboardBody: { marginTop: 30 },
});

function Dashboard() {
  const history = useHistory();
  const classes = useStyles();

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
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3} l={2}>
            <RecordingCard
              carddata={{
                id: 0,
                title: "New Note",
                subtitle: "Go to recording screen",
                description: "Make notes for a new recording",
              }}
              onClick={() => history.push("/create")}
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
