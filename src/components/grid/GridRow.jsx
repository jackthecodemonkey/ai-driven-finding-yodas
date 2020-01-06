import React from 'react';
import '../../App.css';
import GridCell from './GridCell';

/**
 * Component of displaying a single grid row
 */
const GridRow = (props) => {
    const gridCell = props.gridRow
        .map((cell, index) => <GridCell key={`${index}${cell.i}`} {...cell} />)

    const style = {
        display: 'flex',
        flexWrap: 'shrink',
        margin: 'auto',
        flexDirection: 'row',
    }

    return (
        <div style={style}>
            {gridCell}
        </div>
    );
}

export default GridRow;
