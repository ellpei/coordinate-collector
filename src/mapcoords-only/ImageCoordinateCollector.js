import React from 'react';
import PropTypes from 'prop-types';
import Dot from '../image-dots/Dot';
import InputModal from './InputModal.js';

const propTypes = {
  deleteDot: PropTypes.func.isRequired,
  addDot: PropTypes.func.isRequired,
  resetDots: PropTypes.func,
  dotStyles: PropTypes.object,
  dotRadius: PropTypes.number,
  backgroundImageUrl: PropTypes.string,
  styles: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  pixelCoordinates: PropTypes.bool,
};

const defaultProps = {
  pixelCoordinates: true,
  backgroundSize: 'cover',
};

export default class ImageCoordinateCollector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grabbing: false,
            dimensions: {},
            currentDot: {},
        };
    }

    onLoadPisteMap = ({target: img}) => {
        this.setState({
            dimensions: {
                renderWidth: img.offsetWidth,
                renderHeight: img.offsetHeight,
                realWidth: img.naturalWidth,
                realHeight: img.naturalHeight,
            }
        });
    }

    onMouseUp = (e) => {
        const bounds = e.target.getBoundingClientRect();
        let {dimensions, currentDot} = this.state;
        let x = Math.round(this.renderedToRealCoord(e.clientX - bounds.left, dimensions.renderWidth, dimensions.realWidth));
        let y = Math.round(this.renderedToRealCoord(e.clientY - bounds.top, dimensions.renderHeight, dimensions.realHeight))
        if(Object.keys(currentDot).length === 0) {
            let dot = {
                x: x,
                y: y,
            };

            this.setState({
                grabbing: false,
                showModal: true,
                currentDot: dot,
            });
        }

    }

    updateCurrentDot = (dot) => {
        let currentDot = this.state.currentDot;
        this.setState({
            currentDot: {...currentDot,...dot},});
    }

    moveDot = (index) => {
        let dot = this.props.dots[index];
        this.setState({
            grabbing: true,
            currentDot: dot,
            showModal: true,
        });
        this.props.deleteDot(index);
    }

    resetDots = () => {
        this.props.resetDots();
    }

    // Translate from rendered coordinates to real piste map coordinates
    renderedToRealCoord = (coord, renderedLength, realLength) => {
        return (coord/renderedLength)*realLength;
    }

    realToRenderedCoord = (coord, renderedLength, realLength) => {
        return (coord/realLength)*renderedLength;
    }

    handleShowModal = () => {
        this.setState({showModal: true});
    }

    handleCloseModal = () => {
        this.setState({grabbing: false, showModal: false, currentDot: {}});
    }

    handleSave = (data) => {
        let currentDot = this.state.currentDot;
        this.setState({
            currentDot: {...currentDot,...data},}, function() {
                this.props.saveDot(this.state.currentDot);
                this.handleCloseModal();
            });
    }

    render() {
        const {grabbing, currentDot} = this.state;
        const dim = this.state.dimensions;
        const {dots, backgroundImageUrl, dotRadius} = this.props;
        const grabClass = grabbing ? 'react-image-dot__grabbing' : '';

        return (
        <div id="react-image-dot">

            <div className={`react-image-dot__wrapper ${grabClass} no-select`}
            onMouseUp={this.onMouseUp}
            width={dim.realWidth}
            height={dim.realHeight}>

                <img
                id="pistemap-img"
                src={backgroundImageUrl} alt="Piste map"
                width={dim.realWidth} onLoad={this.onLoadPisteMap} />

                {dots.map((dot, i) =>
                    <Dot
                    dotX={Math.round(this.realToRenderedCoord(dot.x, dim.renderWidth, dim.realWidth))}
                    dotY={Math.round(this.realToRenderedCoord(dot.y, dim.renderHeight, dim.realHeight))}
                    i={i}
                    styles={{
                        boxShadow: '0px 0px 0px 2px lime',
                        backgroundColor: 'magenta',
                    }}
                    moveDot={this.moveDot}
                    dotRadius={dotRadius}
                    key={i}
                    />)}

                {Object.keys(currentDot).length === 0 ? null: <Dot
                    dotX={Math.round(this.realToRenderedCoord(currentDot.x, dim.renderWidth, dim.realWidth))}
                    dotY={Math.round(this.realToRenderedCoord(currentDot.y, dim.renderHeight, dim.realHeight))}
                    i={0}
                    styles={{
                        boxShadow: '0px 0px 0px 2px magenta',
                        backgroundColor: 'lime',
                    }}
                    moveDot={() => console.log('try to move temp dot')}
                    dotRadius={dotRadius}
                    key={-1}
                    />}
            </div>
            number of points: {this.props.dots.length}
            {
                this.state.showModal ? <InputModal
                dimensions={dim}
                posX={this.realToRenderedCoord(currentDot.x, dim.renderWidth, dim.realWidth)}
                handleClose={this.handleCloseModal}
                handleSave={this.handleSave}
                updateCurrentDot={this.updateCurrentDot}
                currentDot={this.state.currentDot}
                /> : null
            }

            {this.props.resetDots &&
            <button onClick={this.resetDots}>Reset</button>}
        </div>
        );
    }
}

ImageCoordinateCollector.propTypes = propTypes;
ImageCoordinateCollector.defaultProps = defaultProps;
