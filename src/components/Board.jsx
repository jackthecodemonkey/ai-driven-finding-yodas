import React from 'react';
import '../App.css';
import { Grid, TreasurePosition } from '../models';
import { EventTypes } from '../common';
import { GridRow } from './grid';
import Treasure from './Treasure';

/**
 * Component of Board
 * Display grid robot and treasures
 */
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.grid = new Grid(props);
        this.treasure = null;
        this.state = {
            treaurePositions: [],
        }
    }

    componentDidMount() {
        this.props.event
            .emit(EventTypes.RobotDemension, this.grid.gridWidth, this.grid.gridHeight)
            .on(EventTypes.FoundTreasure, ({ x, y }) => {
                this.treasure.RemoveTreasue(x, y);
                this.setState({
                    treaurePositions: this.treasure.GetPositionPixels(this.grid.gridWidth),
                })
            })
        this.props.event
            .on(EventTypes.RobotControllerInitialized, () => {
                this.props.event.emit(EventTypes.BoardGrid, this.grid);
            })
            .on(EventTypes.SetTreasure, (x, y) => {
                this.treasure = new TreasurePosition(x, y, this.grid.gridX);
                this.setState({
                    treaurePositions: this.treasure.GetRandomPositionOfTresure(10, this.grid.gridWidth),
                }, () => {
                    this.props.event.emit(EventTypes.TreasureInitialized, this.treasure);
                })

            })
    }

    render() {
        const gridCell = this.grid
            .BoardGridCells
            .map((gridRow, i) => <GridRow key={i} gridRow={gridRow} />)
        return (
            <div className="gridWrapper">
                {gridCell}
                {this.props.children}
                {
                    this.state.treaurePositions.length > 0 &&
                    <div>
                        {this.state.treaurePositions.map(position => <Treasure {...position} />)}
                    </div>
                }
            </div>
        );
    }
}

export default Board;
