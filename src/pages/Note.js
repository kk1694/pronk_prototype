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
import { useInterval } from "../components/useInterval";
import Loading from "../components/Loading";
import TagDisplay from "../components/TagDisplay";
import TranscriptDisplay from "../components/TranscriptDisplay";

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

const getTranscriptStatus = (noteID) => {
  return fetch("/api/transcript/" + noteID, {
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
  const [transcript, setTranscript] = useState([]);
  const [tags, setTags] = useState([]);
  const [tStatus, setTStatus] = useState("Not Started");

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

  useEffect(() => {
    if (tStatus !== "Completed") {
      getTranscriptStatus(noteID).then((result) => {
        setTStatus(result.status);
        setTranscript(result.lines);
        setTags(result.tags);
      });
    }
  }, [noteID]);

  const handleClick = () => {
    history.push({
      pathname: "/",
      state: { project_id: projectID },
    });
  };

  useInterval(() => {
    if (tStatus !== "Completed") {
      console.log("Calling interval code");

      getTranscriptStatus(noteID).then((result) => {
        setTStatus(result.status);
        setTranscript(result.lines);
        setTags(result.tags);
      });
    }
  }, 5000);

  const handleUploaded = () => updateURL();

  return (
    <div className={classes.dashboardBody}>
      <Container>
        <div>
          <Grid container spacing={10}>
            <Grid item xs={6}>
              <Typography variant="h3">{title}</Typography>
              <Typography variant="subtitle">{subtitle}</Typography>
              <br></br>

              <Button variant="contained" onClick={handleClick}>
                Back
              </Button>
              <Divider></Divider>
              {videoURL === "" ? (
                <FileUpload noteID={noteID} handleUploaded={handleUploaded} />
              ) : (
                "Video comes here: " + videoURL
              )}
              <Divider></Divider>
              {/* {(tStatus === 'Not started' ? "" : "")} */}
              {tStatus === "In Progress" ? <Loading /> : ""}
              {tStatus === "Completed" ? (
                <TranscriptDisplay transcript={transcript} />
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={6}>
              {tStatus === "Not started" ? "Upload video to see tags" : ""}
              {tStatus === "In Progress" ? "Transcription in progress..." : ""}
              {tStatus === "Completed" ? <TagDisplay tags={tags} /> : ""}
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default Note;
