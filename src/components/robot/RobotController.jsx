import React from 'react';
import '../../App.css';
import { RobotMover } from '../../models';
import { EventTypes, TaskQueue } from '../../common';
import { StatTable, ControllerPanel } from '../StatTable';
import FasterMove from '../../models/PathFinders/FasterMove';

class RobotController extends React.Component {
    constructor(props) {
        super(props);
        this.SetPosition = this.SetPosition.bind(this);
        this.UpdateXposition = this.UpdateXposition.bind(this);
        this.UpdateYposition = this.UpdateYposition.bind(this);
        this.MoveToTreasure = this.MoveToTreasure.bind(this);
        this.HandleKeyDown = this.HandleKeyDown.bind(this);
        this.MoveRobot = this.MoveRobot.bind(this);
        this.robotMover = new RobotMover(null, null);
        this.taskQueue = new TaskQueue();
        this.tresure = null;
        this.grid = null;
        this.state = {
            x: 0,
            y: 0,
            direction: null,
        }
    }

    componentDidMount() {
        window.addEventListener('keydown', this.HandleKeyDown);
        this.props.event
            .emit(EventTypes.RobotControllerInitialized, this.robotMover)
            .on(EventTypes.BoardGrid, grid => { this.grid = grid; })
            .on(EventTypes.TreasureInitialized, treasure => { this.tresure = treasure });
    }

    SetPosition() {
        if (!this.grid.IsInValidMove(this.state.x, this.state.y)) {
            this.robotMover.SetPosition(this.state.x * 1, this.state.y * 1);
            this.props.event
                .emit(EventTypes.MoveRobot)
                .emit(EventTypes.SetTreasure, this.state.x * 1, this.state.y * 1);
        }
    }

    UpdateXposition(x) {
        this.setState({ x })
    }

    UpdateYposition(y) {
        this.setState({ y })
    }

    UpdateDirection(direction) {
        this.setState({ direction })
    }

    MoveRobot(y, x, destX, destY, callback, done) {
        this.robotMover.SetPosition(x, y);
        this.setState({ x, y }, () => {
            this.props.event.emit(EventTypes.MoveRobot, done);
            this.findAndUpdateTreasures(destX, destY, callback);
        })
    }

    MoveToTreasure() {
        const shortestDest = this.grid.GetDestinationFromCurrent(this.tresure.tresurePositions, this.robotMover.x, this.robotMover.y);
        if (shortestDest && shortestDest.length) shortestDest.shift();
        const nextTreasure = shortestDest && shortestDest.length && shortestDest[shortestDest.length - 1];
        if (nextTreasure) {
            const fasterMoves = new FasterMove({ x: this.robotMover.x, y: this.robotMover.y }, [...shortestDest]).GetReducedPath();
            fasterMoves.shift();
            fasterMoves.forEach((path) => {
                this.taskQueue.AddTask(this.MoveRobot)(path.y, path.x, nextTreasure.x, nextTreasure.y, () => {
                    this.MoveToTreasure()
                });
            })
        }
    }

    findAndUpdateTreasures(destX, destY, callback) {
        const found = this.tresure.HasTreasureFound(this.robotMover.x, this.robotMover.y);
        if (found.length) {
            this.props.event.emit(EventTypes.FoundTreasure, found[0]);
            this.tresure.FilterPositionsBy(({ x, y }) => !(found[0].x === x && found[0].y === y));
            if (this.robotMover.x === destX && this.robotMover.y === destY) callback && callback();
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
                this.props.event.emit(EventTypes.MoveRobot);
                this.findAndUpdateTreasures();
                this.UpdateXposition(this.robotMover.x);
                this.UpdateYposition(this.robotMover.y);
                this.UpdateDirection(this.robotMover.currentDirection);
            }
        }
    }

    render() {
        return (
            <div className="robot-controller">
                <div className="wrapper">
                    <div className="setRobot">
                        <div className="main-status-wrapper">
                            <StatTable event={this.props.event} />
                            <ControllerPanel
                                x={this.state.x}
                                y={this.state.y}
                                UpdateXposition={this.UpdateXposition}
                                UpdateYposition={this.UpdateYposition}
                                SetPosition={this.SetPosition}
                                MoveToTreasure={this.MoveToTreasure}
                            />
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RobotController;
