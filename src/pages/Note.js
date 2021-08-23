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

const getVideoURL = (noteID) => {
  return fetch("/api/get_video_url/" + noteID, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Video URL result: ", data);
      return data;
    })
    .catch((error) => {
      console.log("There was an error: ", error);
    });
};

function Note() {
  const location = useLocation();
  const history = useHistory();

  const classes = useStyles();

  const projectID = location.state.project_id;
  const noteID = location.state.note_data.note_id;
  const subtitle = location.state.note_data.subtitle;

  const [title, setTitle] = useState(location.state.note_data.title);
  const [desc, setDesc] = useState(location.state.note_data.description);

  const [videoURL, setVideoURL] = useState("");

  const updateURL = () => {
    getVideoURL(noteID)
      .then((data) => {
        console.log("getting video URL");
        if (data.status !== "Success") {
          console(
            "Did not receive Success status for video upload from backend!!!"
          );
        }
        if (data.url !== "") {
          setVideoURL(data.url);
        }
      })
      .catch((error) => {
        console.log("There was an error: ", error);
      });
  };

  useEffect(() => {
    if (videoURL === "") {
      updateURL();
    }
  }, [noteID, videoURL]);

  const handleClick = () => {
    history.push({
      pathname: "/",
      state: { project_id: projectID },
    });
  };

  const handleUploaded = () => updateURL();

  return (
    <div className={classes.dashboardBody}>
      <Container>
        <Grid container spacing={3}>
          <Grid element xs={6}>
            <Button variant="contained" onClick={handleClick}>
              Back
            </Button>
            <Typography variant="h1">{title}</Typography>
            <Typography variant="subtitle">{subtitle}</Typography>
            <Divider></Divider>
            {videoURL === "" ? (
              <FileUpload noteID={noteID} handleUploaded={handleUploaded} />
            ) : (
              "Video comes here: " + videoURL
            )}
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
