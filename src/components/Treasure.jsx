import React from 'react';
import '../App.css';
import Rd2d from '../rd2d.png';

const Treasure = (props) => {
    const style = {
        position: 'absolute',
        left: props.left,
        top: props.top,
        width: props.demension,
        height: props.demension,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    }
    return (
        <div style={style}>
            <img style={{ width: '50%', height: '50%' }} src={Rd2d} />
        </div>
    );
}

export default Treasure;
