import React from 'react';
import '../../App.css';
import { RobotMover, Direction } from '../../models';
import { EventTypes, TaskQueue } from '../../common';

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
        this.robotMover.SetPosition(robotI, robotJ);
        this.setState({
            x: robotJ,
            y: robotI,
        }, () => {
            this.props.event.emit(EventTypes.MoveRobot, this.robotMover, done);
            this.FindTreasures(destJ, destI, callback);
        })
    }

    MoveToTreasure() {
        // this.grid.GetShortestDestinationFromCurrent(this.tresure.tresurePositions, this.robotMover.x, this.robotMover.y);
        const nextTreasure = this.tresure && this.tresure.GetFromFront();
        if (nextTreasure) {
            const paths = this.grid.GetPathFromTo(this.robotMover, nextTreasure)
            paths.forEach((path) => {
                this.taskQueue.AddTask(this.MoveRobot)(path.j, path.i, nextTreasure.x, nextTreasure.y, () => {
                    this.MoveToTreasure()
                });
            })
        }
    }

    FindTreasures(destJ, destI, callback) {
        const found = this.tresure.HasTreasureFound(this.robotMover.x, this.robotMover.y);
        if (found.length) {
            this.props.event.emit(EventTypes.FoundTreasure, found[0]);
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
                this.FindTreasures();
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
            .on(EventTypes.TreasureInitialized, treasure => { this.tresure = treasure });
    }

    render() {
        return (
            <div className="robot-controller">
                <div className="wrapper">
                    <div className="setRobot">
                        <div className="input-group">
                            <div className="label">X</div>
                            <div className="input-wrapper"><input type="text" onChange={(e) => this.UpdateXposition(e.target.value)} value={this.state.x} /></div>
                        </div>
                        <div className="input-group">
                            <div className="label">Y</div>
                            <div className="input-wrapper"><input type="text" onChange={(e) => this.UpdateYposition(e.target.value)} value={this.state.y} /></div>
                        </div>
                        <button className="set-position clickable" onClick={this.SetPosition}>Set Position</button>
                        <button onClick={this.MoveToTreasure}>Temp button</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default RobotController;
