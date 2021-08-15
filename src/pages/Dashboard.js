import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react'
import { useHistory } from 'react-router-dom';
import PrimarySearchAppBar from '../components/PrimarySearchAppBar'

const pleaseLogin = () => {
    return (
      <Typography variant="h3" gutterBottom>
        Please log in
      </Typography>
    );
  };

const useStyles = makeStyles({
    root: {
    }
})

function Dashboard() {

    const history = useHistory();
    const classes = useStyles();

    return (
        
        <div className={classes.root}>
            'Still todo'
            <Button onClick={() => history.push('/create')}>
                Create new
            </Button>
        </div>
    )
}

export default Dashboard
