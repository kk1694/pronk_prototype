
import React from 'react';
import Button from '@material-ui/core/Button';

import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = ({color, variant}) => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
        <Button color={color} variant={variant} onClick={() => loginWithRedirect()} >Login</Button>
    )
  )
}

export default LoginButton