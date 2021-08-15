import { Button, makeStyles } from '@material-ui/core';
import React from 'react'
import { useHistory } from 'react-router-dom';

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
