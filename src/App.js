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
        gridX={5}
        gridY={5}
        gridWidth={100}
        gridHeight={100}
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
