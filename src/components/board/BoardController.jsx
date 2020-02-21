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
                <h4>Board Setting</h4>
                <div>
                    <select onChange={this.OnSelect}>
                        {
                            GetOptions()
                        }
                    </select>
                    <button onClick={this.RegenerateMap}>RegenerateMap</button>
                </div>
            </div>
        )
    }
}

export default BoardController;
