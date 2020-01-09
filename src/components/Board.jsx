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
        this.props.event.emit(EventTypes.RobotDemension, this.grid.gridWidth, this.grid.gridHeight);
        this.props.event.emit(EventTypes.PassGrid);
        this.props.event.on(EventTypes.FoundTreasure, ({ x, y }) => {
            this.treasure.RemoveTreasue(x, y);
            this.setState({
                treaurePositions: this.treasure.GetPositionPixels(this.grid.gridWidth),
            })
        })
        this.props.event.on(EventTypes.PassGrid, () => {
            this.props.event.emit(EventTypes.GetGrid, this.grid);
        })
        this.props.event.on(EventTypes.SetTreasure, (x, y) => {
            this.treasure = new TreasurePosition(x, y, this.grid.gridX);
            this.setState({
                treaurePositions: this.treasure.GetRandomPositionOfTresure(1, this.grid.gridWidth),
            }, () => {
                this.props.event.emit(EventTypes.TreasureInitialized, this.treasure.tresurePositions);
            })

        })
    }

    render() {
        const gridCell = this.grid
            .GetGridCells
            .map((gridRow,i) => <GridRow key={i} gridRow={gridRow} />)
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
