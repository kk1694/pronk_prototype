import { TextField, Typography } from "@material-ui/core";
import React from "react";
import { useState } from "react";

function ClickableText(props) {
  const [clicked, setClicked] = useState(false);

  const handleChange = (event => {
    
      props.setTitle(event.target.value)
    
  })

  const handleKey = (event => {
    if (event.key === "Enter") {
        setClicked(false);
        fetch("/api/update_title/" + props.noteID, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({'title': props.title})
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
      }
  })
  return (
    <div>
      {clicked ? (
        <TextField label={props.title} onChange={handleChange} onKeyPress={handleKey}></TextField>
      ) : (
        <Typography variant={props.variant} onClick={() => (setClicked(true))}>
          {props.title}
        </Typography>
      )}
    </div>
  );
}

export default ClickableText;
