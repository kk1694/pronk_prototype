import { useAuth0 } from "@auth0/auth0-react";
import { Container, Divider, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import RecordingCard from "../components/RecordingCard";

const useStyles = makeStyles({
  dashboardBody: { marginTop: 30 },
});

function Dashboard() {
  const history = useHistory();
  const classes = useStyles();

  const { user } = useAuth0();

  const [projectID, setProjectID] = useState("");
  const [noteList, setNoteList] = useState([]);

  useEffect(() => {
    fetch("/api/opened_dashboard", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user), // body data type must match "Content-Type" header
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setProjectID(data.project_id);
      })
      .catch((error) => {
        console.log("There was an error: ", error);
      });
  }, [user]);

  useEffect(() => {
    if (projectID === "") {
      console.log("Project id is empty string");
    } else {
      fetch("/api/get_notes/" + projectID, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data.status);
          setNoteList(data.note_list);
        })
        .catch((error) => {
          console.log("There was an error: ", error);
        });
    }
  }, [projectID]);

  return (
    <div className={classes.dashboardBody}>
      <Container>
        project: {projectID}
        {/* {JSON.stringify(user, null, 2)}

      Sub: {JSON.stringify(user.sub, null, 2)} */}
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
              onClick={() =>
                history.push({
                  pathname: "/create",
                  state: { project_id: projectID },
                })
              }
            />
          </Grid>

          {noteList.map((carddata) => (
            <Grid item key={carddata.id} xs={12} sm={6} md={3} l={2}>
              <RecordingCard
                carddata={carddata}
                onClick={() =>
                  history.push({
                    pathname: "/note",
                    state: { project_id: projectID, note_data: carddata },
                  })
                }
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
