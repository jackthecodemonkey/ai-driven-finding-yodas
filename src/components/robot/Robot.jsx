import React from 'react';
import '../../App.css';
import { EventTypes } from '../../common';
import Mando from '../../mando.png';
import ReactTooltip from 'react-tooltip'

class Robot extends React.Component {
    constructor(props) {
        super(props);
        this.robotRef = React.createRef();
        this.tooltipRef = React.createRef();
        this.robotMover = null;
        this.state = {
            x: null,
            y: null,
            width: 0,
            height: 0,
        }
    }

    componentDidMount() {
        this.props.event
            .on(EventTypes.RobotControllerInitialized, robotMover => {
                this.robotMover = robotMover;
            })
            .on(EventTypes.RobotDemension, (width, height) => {
                this.setState({ width, height }, () => {
                    this.robotMover && this.MoveTo(this.robotMover.GetCurrentPosition(this.state.width, this.state.height));
                })
            })
            .on(EventTypes.MoveRobot, (done) => {
                this.MoveTo(this.robotMover.GetCurrentPosition(this.state.width, this.state.height), done);
                ReactTooltip.hide()
            })
            .on(EventTypes.FoundTreasure, () => {
                ReactTooltip.show(this.foundTreasure)
            })
    }

    MoveTo(moveTo, done) {
        const { x, y } = this.state;
        this.setState({
            x: moveTo.left,
            y: moveTo.top,
        }, () => {
            if (Number.isInteger(x) && Number.isInteger(y)) {
                this.robotRef.current.style.transition = `transform 150ms ease`;
                this.robotRef.current.style.transform = `translateX(${moveTo.left}px) translateY(${moveTo.top}px)`;
            } else {
                this.robotRef.current.style.transform = `translateX(${moveTo.left}px) translateY(${moveTo.top}px)`;
            }
            setTimeout(() => {
                done && done();
            }, 150);
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
                <p ref={ref => this.foundTreasure = ref} data-tip='yay!'></p>
                <img style={{
                    width: '70%',
                    height: '70%',
                }} src={Mando} />
                <div className="tooltip">
                    <ReactTooltip place="bottom" />
                </div>
            </div>
        );
    }
}

export default Robot;
