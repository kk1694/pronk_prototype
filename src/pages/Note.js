import { useAuth0 } from "@auth0/auth0-react";
import {
  Container,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import RecordingCard from "../components/RecordingCard";

const useStyles = makeStyles({
  dashboardBody: { marginTop: 30 },
});

function Note() {
  const location = useLocation();

  const classes = useStyles();

  const projectID = location.state.project_id;
  const noteID = location.state.note_data.note_id;
  const subtitle = location.state.note_data.subtitle;

  const [title, setTitle] = useState(location.state.note_data.title);
  const [desc, setDesc] = useState(location.state.note_data.description);


  return (
    <div className={classes.dashboardBody}>
      <Container>
        <Typography variant="h1">{title}</Typography>
        project: {projectID}
      </Container>
    </div>
  );
}

export default Note;
