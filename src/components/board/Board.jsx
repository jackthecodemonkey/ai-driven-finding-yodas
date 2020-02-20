import React from 'react';
import '../../App.css';
import { Grid, TreasurePosition } from '../../models';
import { EventTypes } from '../../common';
import { GridRow } from '../grid';
import Treasure from '../Treasure';

/**
 * Component of Board
 * Display this.state.grid robot and treasures
 */
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.treasure = null;
        this.state = {
            treaurePositions: [],
            grid: new Grid(props),
        }
    }

    componentDidMount() {
        this.props.event
            .emit(EventTypes.RobotDemension, this.state.grid.gridWidth, this.state.grid.gridHeight)
            .on(EventTypes.FoundTreasure, ({ x, y }) => {
                this.treasure.RemoveTreasue(x, y);
                this.setState({
                    treaurePositions: this.treasure.GetPositionPixels(this.state.grid.gridWidth),
                })
            })
        this.props.event
            .on(EventTypes.RobotControllerInitialized, () => {
                this.props.event.emit(EventTypes.BoardGrid, this.state.grid);
            })
            .on(EventTypes.SetTreasure, (x, y) => {
                this.treasure = new TreasurePosition(x, y, this.state.grid.gridX);
                this.setState({
                    treaurePositions: this.treasure.GetRandomPositionOfTresure(10, this.state.grid.gridWidth),
                }, () => {
                    this.props.event.emit(EventTypes.TreasureInitialized, this.treasure);
                })
            })
            .on(EventTypes.RegenerateMap, () => {
                this.setState({ grid: new Grid(this.props) }, () => {
                    this.props.event.emit(EventTypes.BoardGrid, this.state.grid);
                })
            })
    }

    render() {
        const gridCell = this.state.grid
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
