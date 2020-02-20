import React from 'react';
import EventTypes from '../../common/eventTypes';

class BoardController extends React.Component {
    constructor(props) {
        super(props);
        this.RegenerateMap = this.RegenerateMap.bind(this);
    }

    RegenerateMap() {
        this.props.event.emit(EventTypes.RegenerateMap);
    }

    render() {
        return (
            <div>
                Board controller
                <button onClick={this.RegenerateMap}>RegenerateMap</button>
            </div>
        )
    }
}

export default BoardController;
