import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import TextField from "@material-ui/core/TextField";

function TappyComment(props) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    props.handleComment({
      comment: comment,
    });
  };

  const handleKey = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <ButtonGroup color="primary" style={{ minWidth: "300px" }}>
      <TextField
        label="Add comment"
        variant="outlined"
        multiline
        minRows={3}
        autoFocus
        color="primary"
        onKeyPress={handleKey}
        onChange={(e) => {
          setComment(e.target.value);
        }}
        style={{ minWidth: "75%" }}
      />

      <Button style={{ minWidth: "25%" }} onClick={handleSubmit}>
        {">"}
      </Button>
    </ButtonGroup>
  );
}

export default TappyComment;
