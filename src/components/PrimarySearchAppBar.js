import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import ProjectBar from './ProjectBar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex'
  },
  appBar: {
    position: 'relative',
    zIndex: 1400
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpenClose = () => {
    setDrawerOpen(!drawerOpen);
    console.log(drawerOpen)
  };


  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleDrawerOpenClose}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Noki.ai
          </Typography>
          <LoginButton/>
          <LogoutButton/>
        </Toolbar>
      </AppBar>
      <ProjectBar open={drawerOpen}/>
    </div>
  );
}