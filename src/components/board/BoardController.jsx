import React from 'react';
import EventTypes from '../../common/eventTypes';
import { MapSizeSelectOptions } from './MapOptions';

const GetOptions = () => {
    return Object.keys(MapSizeSelectOptions).map(key => {
        return <option value={MapSizeSelectOptions[key].value}>
            {MapSizeSelectOptions[key].display}
        </option>
    })
}

class BoardController extends React.Component {
    constructor(props) {
        super(props);
        this.RegenerateMap = this.RegenerateMap.bind(this);
        this.OnSelect = this.OnSelect.bind(this);
    }

    OnSelect(e) {
        this.props.event.emit(EventTypes.ChangeMapSize, e.target.value);
    }

    RegenerateMap() {
        this.props.event.emit(EventTypes.RegenerateMap);
    }

    render() {
        return (
            <div className="control-panel board-controller-container">
                <h4>Board Options</h4>
                <div className="grid-wrapper">
                    <h5>Grid Size</h5>
                    <div className="custom-dropdown clickable">
                        <select className="clickable" onChange={this.OnSelect}>
                            {
                                GetOptions()
                            }
                        </select>
                        <button className="start-btn regenerate-btn clickable" onClick={this.RegenerateMap}>Regenerate Map</button>
                    </div>
                </div>

            </div>
        )
    }
}

export default BoardController;
