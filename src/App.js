import "./App.css";
import React from "react";

import Typography from "@material-ui/core/Typography";
import { ThemeProvider } from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";
import { useAuth0 } from "@auth0/auth0-react";

import TappyWindow from "./components/TappyWindow";

import PrimarySearchAppBar from "./components/PrimarySearchAppBar";

const theme = createTheme({});

const pleaseLogin = () => {
  return (
    <Typography variant="h3" gutterBottom>
      Please log in
    </Typography>
  );
};

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ThemeProvider theme={theme}>
      <PrimarySearchAppBar />
      {isAuthenticated ? <TappyWindow /> : pleaseLogin()}
    </ThemeProvider>
  );
}

export default App;
