import React from 'react';
import '../../App.css';
import { EventTypes } from '../../common';
import Vader from '../../vader.jfif';
import ReactTooltip from 'react-tooltip'

/**
 * Component of Robot ( Vader )
 * Listen events from Board and RobotController and do actions: move and display tooltips
 */
class Robot extends React.Component {
    constructor(props) {
        super(props);
        this.robotRef = React.createRef();
        this.tooltipRef = React.createRef();
        this.state = {
            x: null,
            y: null,
            width: 0,
            height: 0,
        }
    }

    componentDidMount() {
        this.props.event.on(EventTypes.RobotDemension, (width, height) => {
            this.setState({ width, height })
        })
        this.props.event.on(EventTypes.MoveRobot, (robotMover) => {
            this.MoveTo(robotMover.GetCurrentPosition(this.state.width, this.state.height));
            ReactTooltip.hide(this.invalidKey)
            ReactTooltip.hide(this.wrongDirectionRef)
        })
        this.props.event.on(EventTypes.ValidKeyPressed, () => {
            ReactTooltip.hide(this.invalidKey)
        });
        this.props.event.on(EventTypes.InvalidKeyPressed, () => {
            ReactTooltip.show(this.invalidKey)
        });
        this.props.event.on(EventTypes.WrongDirection, () => {
            ReactTooltip.show(this.wrongDirectionRef)
        });
        this.props.event.on(EventTypes.FoundTreasure, () => {
            ReactTooltip.show(this.foundTreasure)
        })
    }

    MoveTo(moveTo) {
        const { x, y } = this.state;
        this.setState({
            x: moveTo.left,
            y: moveTo.top,
        }, () => {
            if (Number.isInteger(x) && Number.isInteger(y)) {
                this.robotRef.current.style.transition = `transform 300ms ease`;
                this.robotRef.current.style.transform = `translateX(${moveTo.left}px) translateY(${moveTo.top}px)`;
            } else {
                this.robotRef.current.style.transform = `translateX(${moveTo.left}px) translateY(${moveTo.top}px)`;
            }
        })
    }

    render() {
        const style = {
            display: Number.isInteger(this.state.x) && Number.isInteger(this.state.y)
                ? 'flex'
                : 'none',
            width: `${this.state.width}px`,
            height: `${this.state.height}px`,
        }

        return (
            <div ref={this.robotRef} style={style} className="robot">
                <p ref={ref => this.wrongDirectionRef = ref} data-tip='dude, wrong direction!'></p>
                <p ref={ref => this.invalidKey = ref} data-tip='invalid command entered'></p>
                <p ref={ref => this.foundTreasure = ref} data-tip='yay!'></p>
                <img style={{ width: '50%', height: '50%' }} src={Vader} />
                <div className="tooltip">
                    <ReactTooltip place="bottom" />
                </div>
            </div>
        );
    }
}

export default Robot;
