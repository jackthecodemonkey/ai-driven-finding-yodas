import React from 'react';
import '../../App.css';
import { RobotMover, Direction } from '../../models';
import { EventTypes } from '../../common';

/**
 * Component of RobotController
 * Control the robot by notifing events 
 * Todo:: refactor. componentDidMount and render are bloated
 *        status section doesn't need to be part of this component
 */
class RobotController extends React.Component {
    constructor(props) {
        super(props);
        this.SetPosition = this.SetPosition.bind(this);
        this.UpdateXposition = this.UpdateXposition.bind(this);
        this.UpdateYposition = this.UpdateYposition.bind(this);
        this.robotMover = new RobotMover(null, null);
        this.tresurePositions = [];
        this.grid = null;
        this.state = {
            x: 0,
            y: 0,
            direction: null,
            invalidPosition: true,
        }
    }

    IsNotValidMove() {
        return (this.state.x < 0)
            || (this.state.x >= (this.grid && this.grid.gridX))
            || (this.state.y < 0)
            || (this.state.y >= (this.grid && this.grid.gridY))
    }

    SetPosition() {
        if (this.IsNotValidMove()) {
            this.setState({
                invalidPosition: true,
            })
        } else {
            this.setState({
                invalidPosition: false
            }, () => {
                this.robotMover.SetPosition(this.state.x * 1, this.state.y * 1);
                this.props.event.emit(EventTypes.MoveRobot, this.robotMover);
                this.props.event.emit(EventTypes.SetTreasure, this.state.x * 1, this.state.y * 1);
            })
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

    FindTreasures() {
        const found = this.tresurePositions.filter(({ x, y }) => this.robotMover.x === x && this.robotMover.y === y);
        if (found.length) {
            this.props.event.emit(EventTypes.FoundTreasure, found[0]);
            this.tresurePositions = this.tresurePositions.filter(({ x, y }) => !(found[0].x === x && found[0].y === y))
        }
    }

    componentDidMount() {
        this.props.event.emit(EventTypes.PassGrid);
        this.props.event.on(EventTypes.GetGrid, grid => { this.grid = grid; });
        this.props.event.on(EventTypes.TreasureInitialized, (treaurePositions) => { this.tresurePositions = treaurePositions });
        window.addEventListener('keydown', (e) => {
            if (e.path[0].nodeName === "INPUT") return;
            if (this.state.invalidPosition) return;
            if (this.robotMover.ValidateKeyCode(e.keyCode)) {
                this.props.event.emit(EventTypes.ValidKeyPressed);
                if (this.robotMover.CanRobotMove(e.keyCode, this.grid)) {
                    this.robotMover.UpdateRobotPosition(e.keyCode);
                    this.robotMover.UpdateDirection(e.keyCode);
                    this.props.event.emit(EventTypes.MoveRobot, this.robotMover);
                    this.FindTreasures();
                    this.UpdateXposition(this.robotMover.x);
                    this.UpdateYposition(this.robotMover.y);
                    this.UpdateDirection(this.robotMover.currentDirection);
                } else {
                    this.props.event.emit(EventTypes.WrongDirection);
                }
            } else {
                this.props.event.emit(EventTypes.InvalidKeyPressed);
            }
        })
    }

    render() {
        return (
            <div className="robot-controller">
                <div className="wrapper">
                    <div className="status">
                        <div style={{ marginBottom: '5px' }}>Position X : {!this.IsNotValidMove() && this.state.x}</div>
                        <div style={{ marginBottom: '5px' }}>Position Y : {!this.IsNotValidMove() && this.state.y}</div>
                        <div style={{ marginBottom: '5px' }}>Last entered direction</div>
                        <div style={{ padding: '10px', marginBottom: '10px', border: '1px solid lightcoral', background: this.state.direction === Direction.UP ? '#ffc5c580' : '' }}>Up</div>
                        <div style={{ padding: '10px', marginBottom: '10px', border: '1px solid lightcoral', background: this.state.direction === Direction.DOWN ? '#ffc5c580' : '' }}>Down</div>
                        <div style={{ padding: '10px', marginBottom: '10px', border: '1px solid lightcoral', background: this.state.direction === Direction.LEFT ? '#ffc5c580' : '' }}>Left</div>
                        <div style={{ padding: '10px', marginBottom: '10px', border: '1px solid lightcoral', background: this.state.direction === Direction.RIGHT ? '#ffc5c580' : '' }}>Right</div>
                    </div>
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
                    </div>
                </div>
            </div>
        );
    }
}

export default RobotController;
