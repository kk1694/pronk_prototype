import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@material-ui/core';
import React from 'react'

import TappyWindow from '../components/TappyWindow';

const pleaseLogin = () => {
  return (
    <Typography variant="h3" gutterBottom>
      Please log in
    </Typography>
  );
};

function Create() {

    const { isAuthenticated } = useAuth0();

    return (
        <div> {isAuthenticated ? <TappyWindow /> : pleaseLogin()} </div>
    )
}

export default Create
