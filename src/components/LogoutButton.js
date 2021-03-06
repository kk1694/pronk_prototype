
import React from 'react';
import Button from '@material-ui/core/Button';

import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
        <Button color="inherit" onClick={() => logout()} >Logout</Button>
    )
  )
}

export default LogoutButton