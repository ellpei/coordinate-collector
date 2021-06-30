import React from 'react';
import PropTypes from 'prop-types';
import Dot from '../image-dots/Dot';
import InputModal from './InputModal.js';
import FileForm from './FileForm.js';
import Table from 'react-bootstrap/Table';
import {Button, Container, Row, Col, Dropdown, DropdownButton} from 'react-bootstrap';

const propTypes = {
  deleteDots: PropTypes.func.isRequired,
  addDots: PropTypes.func.isRequired,
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
            },
            currentZoomLevel: 100,
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
                areaId: this.props.areaId,
                items: []
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
        let dots = [...this.props.dots];
        let indices = [];
        let items = [];

        dots.forEach((other, i) => {
            if(other.x === dot.x && other.y === dot.y) {
                indices.push(i);
                items = [...items, {
                    id: other.id,
                    name: other.name,
                    shortName: other.shortName,
                    areaId: other.areaId
                }];
            }
        });

        dot = {
            x: dot.x,
            y: dot.y,
            items: items,
        };

        this.setState({
            grabbing: true,
            currentDot: dot,
            showModal: true,
        });
        this.props.deleteDots(indices);
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

    handleSelectZoom = (e) => {
        this.setState(prevState => ({
            currentZoomLevel: e,
            dimensions: {
              ...prevState.dimensions,
              renderWidth: prevState.dimensions.realWidth * parseInt(e)/100,
              renderHeight: prevState.dimensions.realHeight * parseInt(e)/100,
            }
        }));
    }

    render() {
        const {grabbing, currentDot, currentZoomLevel} = this.state;
        const dim = this.state.dimensions;
        const {dots, backgroundImageUrl, dotRadius, resetDots} = this.props;
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
                width={dim.renderWidth} height={dim.renderHeight} onLoad={this.onLoadPisteMap} />

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
            <Container>
                <Row>
                    <Col>
                        <DropdownButton title="Zoom" id="dropdown-menu-zoom" onSelect={this.handleSelectZoom}>
                            {['50', '75', '100', '125', '150'].map(z =>
                                <Dropdown.Item key={z} eventKey={z} active={currentZoomLevel === z}>{z}%</Dropdown.Item>
                            )}
                        </DropdownButton>
                    </Col>
                </Row>
            </Container>

            <Container className="dotsinfo text-center">
                <Row>
                    <Col>
                        number of points: {this.props.dots.length}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FileForm
                            imgSrc={this.state.src}
                            title={this.props.title}
                            points={this.props.dots}
                            loadPointData={this.props.loadPointData}/>
                    </Col>
                </Row>
                <Row className="text-center">
                    <Col >
                        <Table hover className="dotsinfotable">
                          <thead>
                              <tr>
                              <th>#</th>
                              <th>id</th>
                              <th>shortName</th>
                              <th>x</th>
                              <th>y</th>
                              <th>name</th>
                              <th>areaId</th>
                              <th>edit</th>
                              <th>delete</th>
                              </tr>
                          </thead>
                          <tbody>
                          {dots.map((dot, i) => {
                              return (<tr key={i}>
                                      <td>{i} </td>
                                      <td>{dot.id}</td>
                                      <td>{dot.shortName}</td>
                                      <td>{dot.x}</td>
                                      <td>{dot.y}</td>
                                      <td>{dot.name}</td>
                                      <td>{dot.areaId}</td>
                                      <td><Button size="sm" variant='outline-success' onClick={() => this.moveDot(i)}><b>✎</b></Button></td>
                                      <td><Button size="sm" variant='outline-danger' onClick={() => this.props.deleteDots([i])}><b>×</b></Button></td>
                              </tr>);})}
                          </tbody>
                          </Table>
                        </Col>
                    </Row>
                    <Row className="text-center">
                        <Col>
                            <Button variant='success' onClick={() => resetDots()}>Reset</Button>
                        </Col>
                    </Row>

            </Container>
        </div>
        );
    }
}

ImageCoordinateCollector.propTypes = propTypes;
ImageCoordinateCollector.defaultProps = defaultProps;
