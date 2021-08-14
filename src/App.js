import './App.css';
import React, {useState} from "react";
import StartButton from './components/StartButton';
import TappyButton from './components/TappyButton';

function App() {

  const [running, setRunning] = useState(false);

  const handleStartStop = () => {
    setRunning(!running);
  }

  const handleTap = (name, time) => {
    console.log(name, time)
  }

  return (
    <div className="App">
      <header className="App-header">
        <StartButton onStartStop = {handleStartStop} running={running}/>

        {running? 'App is running' : 'App is stopped'}

        <TappyButton name = 'Bookmark' onButtonClick = {handleTap} />
      </header>
    </div>
  );
}

export default App;
