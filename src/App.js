import React from 'react';
import './App.css';
import { Event } from './common';
import Board from './components/Board';
import { RobotController, Robot } from './components/robot';

function App() {
  const event = Event();
  return (
    <div className="simulator">
      <Board
        event={event}
        gridX={10}
        gridY={10}
        gridWidth={50}
        gridHeight={50}
      >
        <Robot
          event={event}
        />
      </Board>
      <RobotController
        event={event}
      />
    </div>
  );
}

export default App;
