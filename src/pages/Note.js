import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import RecordingCard from "../components/RecordingCard";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { DropzoneArea } from "material-ui-dropzone";
import FileUpload from "../components/FileUpload";

const useStyles = makeStyles({
  dashboardBody: { marginTop: 30 },

  uploadButtonArea: {
    width: 400,
    height: 400,
  },

  uploadButton: { fontSize: 200 },
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
        <Grid container spacing={3}>
          <Grid element xs={6}>
            <Typography variant="h1">{title}</Typography>

            <Typography variant="subtitle">{subtitle}</Typography>

            <Divider></Divider>

              Note ID: {noteID}
             <FileUpload noteID = {noteID}></FileUpload>

          </Grid>
          <Grid element xs={6}>
            TODO add tags!
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Note;
