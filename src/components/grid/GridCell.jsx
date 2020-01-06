import React from 'react';
import '../../App.css';

/**
 * Component of displaying each grid cell
 */
class GridCell extends React.Component {
    render() {
        const defaultBorder = '1px solid lightgrey';
        const transparent = '1px solid transparent';
        const defaultStyle = {
            borderRight: defaultBorder,
            borderBottom: defaultBorder,
        }

        if (this.props.ShouldDisplayTop) {
            defaultStyle.borderTop = defaultBorder;
        };

        if (this.props.ShouldDisplayLeft) {
            defaultStyle.borderLeft = defaultBorder;
        };

        const finalStyle = {
            ...defaultStyle,
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            opacity: 0.7,
        }

        if (!this.props.walls[0]) {
            finalStyle.borderTop = 'none';
        }

        if (!this.props.walls[1]) {
            finalStyle.borderRight = transparent;
        }

        if (!this.props.walls[2]) {
            finalStyle.borderBottom = transparent;
        }

        if (!this.props.walls[3]) {
            finalStyle.borderLeft = 'none';
        }

        return (
            <div style={finalStyle}></div>
        );
    }
}

export default GridCell;
