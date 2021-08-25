
import { TextField, Typography } from '@material-ui/core'
import React from 'react'



function ClickableText(props) {
    return (
        <div>
            <Typography variant={props.variant} onClick={() => alert("todo")}>{props.content}</Typography>
            {/* <TextField></TextField> */}
        </div>
    )
}

export default ClickableText
