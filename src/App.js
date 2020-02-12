import React from 'react';
import './App.css';
import { Event } from './common';
import Board from './components/Board';
import { RobotController, Robot } from './components/robot';

function App() {
  const event = Event();
  return (
    <div className="simulator">
      <div className="overlay">
        <div className="container-inner">
          <div className="board-container">
            <Board
              event={event}
              gridX={9}
              gridY={9}
              gridWidth={80}
              gridHeight={80}
            >
              <Robot
                event={event}
              />
            </Board>
          </div>
          <RobotController
            event={event}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
