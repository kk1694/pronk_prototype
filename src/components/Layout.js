import { makeStyles } from '@material-ui/core'
import React from 'react'
import PrimarySearchAppBar from './PrimarySearchAppBar'

const useStyles = makeStyles({
    page: {
        background: '#f9f9f9',
    },
    root: {
       // display: 'flex'
    }
})

function Layout({children}) {

    const classes = useStyles();

    return (         

        <div className={classes.root}>

{/* <PrimarySearchAppBar /> */}

        <div className={classes.page}>
            {children}
        </div>
        </div>

    )
}

export default Layout
