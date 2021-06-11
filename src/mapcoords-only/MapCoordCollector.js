import '../styles/image-dots.css';
import React from 'react';
import FileForm from './FileForm.js';
import ImageCoordinateCollector from './ImageCoordinateCollector.js';
import DotsInfo from './DotsInfo.js';
import { Prompt } from 'react-router';

class MapCoordCollector extends React.Component {

    constructor(props) {
        super(props);
        this.initialDots = [];
        this.state = {
            title: this.props.resort.title,
            src: this.props.resort.src,
            dots: this.initialDots,
            windowWidth: window.innerWidth*0.98,
            shouldBlockNavigation: false,
        }
    }

    componentDidUpdate() {
        if (this.state.shouldBlockNavigation) {
            window.onbeforeunload = () => true
        } else {
            window.onbeforeunload = undefined
        }
    }

    // Translate from rendered coordinates to real piste map coordinates
    renderedToRealCoord(coord, renderedLength, realLength) {
        return (coord/renderedLength)*realLength;
    }

    realToRenderedCoord(coord, renderedLength, realLength) {
        return (coord/realLength)*renderedLength;
    }

    addDot = (dot) => {
        let dots = this.state.dots;
        this.setState({
            dots: [...dots, dot],
            shouldBlockNavigation: true,
        });
    }

    saveDot = (dot) => {
        let {dots} = this.state;
        this.deleteDot(dots.length-1);
        this.addDot(dot);
    }

    deleteDot = (index) => {
        this.setState({
            dots: this.state.dots.filter((e, i) => {return i !== index;}),
        });
    }

    resetDots = () => {
        this.setState({
            dots: this.initialDots,
        });
    }

    handleResize = () => {
        this.setState({ windowWidth: window.innerWidth*0.98 });
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    loadPointData = (data) => {
        let dots = data.map(point =>
            ({  id: point.id,
                name: point.name,
                shortName: point.shortName,
                areaId: point.areaId,
                x: point.pisteMapCoordinates ? point.pisteMapCoordinates.x : 0,
                y: point.pisteMapCoordinates ? point.pisteMapCoordinates.y : 0
            })
        );
        this.initialDots = dots;
        this.setState({dots: dots});
    }

    render() {
        const { dots, src} = this.state;

        return (
            <div id="matcher">

                <Prompt
                  when={this.state.shouldBlockNavigation}
                  message='You have unsaved changes, are you sure you want to leave?'
                />
                <ImageCoordinateCollector
                backgroundImageUrl={src}
                onLoadMap={this.onLoadPisteMap}
                dots={dots}
                deleteDot={this.deleteDot}
                saveDot={this.saveDot}
                addDot={this.addDot}
                dotRadius={10}
                />
                <div className="bottom-toolbox">
                {this.props.resort.title}
                    <FileForm
                        imgSrc={this.state.src}
                        title={this.state.title}
                        points={this.state.dots}
                        loadPointData={this.loadPointData}/>
                    <DotsInfo dots={this.state.dots} deleteDot={this.deleteDot} resetDots={this.resetDots}></DotsInfo>
                </div>
            </div>);
    }
}

export default MapCoordCollector;
