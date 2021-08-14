import './App.css';
import React from "react";
import { ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';
import { useAuth0 } from '@auth0/auth0-react';


import TappyWindow from './components/TappyWindow';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';

const theme = createTheme({

})

function App() {

  const { isLoading, isAuthenticated} = useAuth0();

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) return <LoginButton/>
  
  return (
    <ThemeProvider theme={theme}>
    <LogoutButton></LogoutButton>
    <div className="App">
      <TappyWindow/>
    </div>
    </ThemeProvider>
  );
}

export default App;
