import { DropzoneArea } from "material-ui-dropzone";
import React from "react";

function FileUpload(props) {
  const handleUpload = (files) => {
    console.log("Files:", files);

    if (files.length > 0) {
      const data = new FormData();
      data.append("file", files[0]);
      data.append("filename", files[0].name);
      data.append("note_id", props.noteID);

      console.log(props.noteID)

      fetch("/api/upload", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        body: data,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          props.handleUploaded();
        })
        .catch((error) => {
          console.log("There was an error: ", error);
        });
    }
  };

  return (
    <DropzoneArea
      acceptedFiles={["video/mp4"]}
      dropzoneText={"Please upload recording mp4 file "}
      onChange={handleUpload}
      filesLimit={1}
      maxFileSize={500000000}
    />
  );
}

export default FileUpload;
