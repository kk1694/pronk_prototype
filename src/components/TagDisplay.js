import { Button, Divider, Typography } from "@material-ui/core";
import React from "react";

function TagDisplay(props) {
  return (
    <div>
      <Typography variant="h3">Bookmarks</Typography>
      <Button
        variant="contained"
        style={{
          float: "right",
          position: "relative",
          transform: "translateY(-100%)",
          height: 30,
        }}
      >
        Export
      </Button>
      <br></br>

      <Divider gutterBottom />
      {props.tags.map(({ category, comment, line, speaker, time }) => (
        <div>
          <Typography variant="h6">
            {" "}
            <b> {category} </b>
          </Typography>
          <Typography>
            {" "}
            <i>{comment}</i>{" "}
          </Typography>
          <Typography gutterBottom> {line}</Typography>
        </div>
      ))}
    </div>
  );
}

export default TagDisplay;
