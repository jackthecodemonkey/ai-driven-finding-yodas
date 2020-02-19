import React from 'react';
import EventTypes from '../../common/eventTypes';

class StatTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalMoves: 0,
            remainingTreasures: null,
        }
    }

    componentDidMount() {
        this.props.event
            .on(EventTypes.MoveRobot, (robotMover, statMonitor, done) => {
                if (statMonitor) {
                    this.setState({
                        totalMoves: statMonitor.totalRobotMoves,
                    })
                }
            })
            .on(EventTypes.FoundTreasure, (found, statMonitor) => {
                if (statMonitor) {
                    this.setState({
                        remainingTreasures: statMonitor.remainingTreasures,
                    })
                }
            })
            .on(EventTypes.TreasureInitialized, ({tresurePositions}) => {
                this.setState({
                    totalMoves: 0,
                    remainingTreasures: tresurePositions && tresurePositions.length,
                })
            })
    }

    render() {
        return (
            <div className="status-table">
                <h4>Results</h4>
                <table>
                    <thead>
                        <tr>
                            <td>Total Movement</td>
                            <td>Remaning R2D2</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.state.totalMoves}</td>
                            <td>{this.state.remainingTreasures}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default StatTable;


