import React from 'react';

class ControllerPanel extends React.Component {
    render() {
        return (
            <div className="control-panel">
                <h4>Set Poision of the Mando and R2D2s</h4>
                <div className="input-group-wrapper">
                    <div className="input-group">
                        <div className="label">X</div>
                        <div className="input-wrapper">
                            <input type="text" onChange={(e) => this.props.UpdateXposition(e.target.value)} value={this.props.x} />
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="label">Y</div>
                        <div className="input-wrapper">
                            <input type="text" onChange={(e) => this.props.UpdateYposition(e.target.value)} value={this.props.y} />
                        </div>
                    </div>
                </div>
                <div className="button-group">
                    <button className="set-position clickable" onClick={this.props.SetPosition}>Set Position</button>
                    <button className="start-btn clickable" onClick={this.props.MoveToTreasure}>Start</button>
                </div>
            </div>
        );
    }
}

export default ControllerPanel;
