import { Drawer, List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import React from "react";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    projectBar: {
        width: drawerWidth
    },

    projectBarPaper: {
        width: drawerWidth
    }
}));

function ProjectBar(props) {

    const classes = useStyles();
  return (
    <div>
      <Drawer className={classes.projectBar} variant="persistent" anchor="left" open={props.open} classes={{paper: classes.projectBarPaper}}>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={props.open ? 'open' : 'close'} />
          </ListItem>
        ))}
      </List>
      </Drawer>

    </div>
  );
}

export default ProjectBar;
