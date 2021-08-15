import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Divider, IconButton, makeStyles } from "@material-ui/core/";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import React from "react";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  projectBar: {
    width: drawerWidth,
  },

  projectBarPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
}));

function ProjectBar(props) {
  const classes = useStyles();

  const projectList = ["Default Project"];
  return (
    <div>
      <Drawer
        className={classes.projectBar}
        variant="persistent"
        anchor="left"
        open={props.open}
        classes={{ paper: classes.projectBarPaper }}
      >
        <List>
          <div className={classes.drawerHeader}>
            <IconButton onClick={props.handleClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <ListItem>
            <ListItemText
              primary={"Multiple project funcitonality will be added later"}
            />
          </ListItem>
          {projectList.map((text, index) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}

export default ProjectBar;
