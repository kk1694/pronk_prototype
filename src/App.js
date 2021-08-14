import './App.css';
import React from "react";
import { ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '@material-ui/core/styles';

import TappyWindow from './components/TappyWindow';

const theme = createTheme({

})

function App() {

  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <TappyWindow/>
    </div>
    </ThemeProvider>
  );
}

export default App;
