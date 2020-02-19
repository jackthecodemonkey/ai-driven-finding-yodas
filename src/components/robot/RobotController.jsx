import React from 'react';
import '../../App.css';
import { RobotMover, Direction } from '../../models';
import { EventTypes, TaskQueue } from '../../common';
import { StatTable, ControllerPanel } from '../StatTable';

class StatMonitor {
    constructor() {
        this.totalRobotMoves = 0;
        this.remainingTreasures = null;
    }

    IncrementRobotMove() {
        this.totalRobotMoves++;
    }

    DecrementTreasure() {
        if (this.remainingTreasures && this.remainingTreasures > 0) this.remainingTreasures--;
    }

    SetInitialTreasures(numOftreasures) {
        this.initialNumberOfTreasures = numOftreasures;
        this.remainingTreasures = numOftreasures;
    }

    ClearStats() {
        this.totalRobotMoves = 0;
        this.remainingTreasures = this.initialNumberOfTreasures || null;
    }
}

class RobotController extends React.Component {
    constructor(props) {
        super(props);
        this.SetPosition = this.SetPosition.bind(this);
        this.UpdateXposition = this.UpdateXposition.bind(this);
        this.UpdateYposition = this.UpdateYposition.bind(this);
        this.MoveToTreasure = this.MoveToTreasure.bind(this);
        this.HandleKeyDown = this.HandleKeyDown.bind(this);
        this.MoveRobot = this.MoveRobot.bind(this);
        this.ResetStatsAndSetPosition = this.ResetStatsAndSetPosition.bind(this);
        this.robotMover = new RobotMover(null, null);
        this.taskQueue = new TaskQueue();
        this.statMonitor = new StatMonitor();
        this.tresure = null;
        this.grid = null;
        this.state = {
            x: 0,
            y: 0,
            direction: null,
        }
    }

    SetPosition() {
        if (!this.grid.IsInValidMove(this.state.x, this.state.y)) {
            this.robotMover.SetPosition(this.state.x * 1, this.state.y * 1);
            this.props.event
                .emit(EventTypes.MoveRobot, this.robotMover)
                .emit(EventTypes.SetTreasure, this.state.x * 1, this.state.y * 1);
        }
    }

    UpdateXposition(value) {
        this.setState({
            x: value
        })
    }

    UpdateYposition(value) {
        this.setState({
            y: value
        })
    }

    UpdateDirection(value) {
        this.setState({
            direction: value
        })
    }

    MoveRobot(robotI, robotJ, destJ, destI, callback, done) {
        this.robotMover.SetPosition(robotJ, robotI);
        this.setState({
            x: robotJ,
            y: robotI,
        }, () => {
            this.statMonitor.IncrementRobotMove();
            this.props.event.emit(EventTypes.MoveRobot, this.robotMover, this.statMonitor, done);
            this.findAndUpdateTreasures(destJ, destI, callback);
        })
    }

    MoveToTreasure() {
        const shortestDest = this.grid.GetDestinationFromCurrent(this.tresure.tresurePositions, this.robotMover.x, this.robotMover.y);
        if (shortestDest && shortestDest.length) shortestDest.shift();
        const nextTreasure = shortestDest && shortestDest.length && shortestDest[shortestDest.length - 1];
        if (nextTreasure) {
            shortestDest.forEach((path) => {
                this.taskQueue.AddTask(this.MoveRobot)(path.y, path.x, nextTreasure.x, nextTreasure.y, () => {
                    this.MoveToTreasure()
                });
            })
        }
    }

    ResetStatsAndSetPosition() {
        this.statMonitor.ClearStats();
        this.SetPosition();
    }

    findAndUpdateTreasures(destJ, destI, callback) {
        const found = this.tresure.HasTreasureFound(this.robotMover.x, this.robotMover.y);
        if (found.length) {
            this.statMonitor.DecrementTreasure();
            this.props.event.emit(EventTypes.FoundTreasure, found[0], this.statMonitor);
            this.tresure.FilterPositionsBy(({ x, y }) => !(found[0].x === x && found[0].y === y));
            if (this.robotMover.x === destJ && this.robotMover.y === destI) callback && callback();
        }
    }

    HandleKeyDown(e) {
        if (e.path[0].nodeName === "INPUT") return;
        if (this.robotMover.ValidateKeyCode(e.keyCode)) {
            this.props.event.emit(EventTypes.ValidKeyPressed);
            if (this.robotMover.CanRobotMove(e.keyCode, this.grid)) {
                this.robotMover
                    .UpdateRobotPosition(e.keyCode)
                    .UpdateDirection(e.keyCode);
                this.props.event.emit(EventTypes.MoveRobot, this.robotMover);
                this.findAndUpdateTreasures();
                this.UpdateXposition(this.robotMover.x);
                this.UpdateYposition(this.robotMover.y);
                this.UpdateDirection(this.robotMover.currentDirection);
            }
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.HandleKeyDown);
        this.props.event
            .emit(EventTypes.RobotControllerInitialized)
            .on(EventTypes.BoardGrid, grid => { this.grid = grid; })
            .on(EventTypes.TreasureInitialized, treasure => {
                this.tresure = treasure;
                this.statMonitor.SetInitialTreasures(this.tresure.tresurePositions.length);
            });
    }

    render() {
        return (
            <div className="robot-controller">
                <div className="wrapper">
                    <div className="setRobot">
                        <div className="main-status-wrapper">
                            <StatTable event={this.props.event} />
                            <ControllerPanel
                                UpdateXposition={this.UpdateXposition}
                                UpdateYposition={this.UpdateYposition}
                                ResetStatsAndSetPosition={this.ResetStatsAndSetPosition}
                                MoveToTreasure={this.MoveToTreasure}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RobotController;
