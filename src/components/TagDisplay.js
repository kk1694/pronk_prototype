import { Button, Divider, Typography } from "@material-ui/core";
import React from "react";

function TagDisplay(props) {
  return (
    <div>
      <Typography variant="h3">Bookmarks</Typography>
      <br></br>
      <Button variant="contained">Export</Button>
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
