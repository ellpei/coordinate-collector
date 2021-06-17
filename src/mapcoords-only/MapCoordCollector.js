import '../styles/image-dots.css';
import React from 'react';
import ImageCoordinateCollector from './ImageCoordinateCollector.js';
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

    addDots = (dots) => {
        let old = this.state.dots;
        this.setState({
            dots: [...old, ...dots],
            shouldBlockNavigation: true,
        });
    }

    saveDot = (dot) => {
        let {dots} = this.state;
        this.deleteDots([dots.length-1]);

        let newDots = dot.items.map((item, i) => {
            let obj = {
                x: dot.x,
                y: dot.y
            }
            return {...obj,...item}
        });
        this.addDots(newDots);
        this.setState({areaId: dot.items[0].areaId});
    }

    deleteDots = (indices) => {
        this.setState({
            dots: this.state.dots.filter((e, i) => !indices.includes(i)),
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
                title={this.state.title}
                onLoadMap={this.onLoadPisteMap}
                dots={dots}
                deleteDots={this.deleteDots}
                saveDot={this.saveDot}
                addDots={this.addDots}
                resetDots={this.resetDots}
                dotRadius={10}
                areaId={this.state.areaId}
                loadPointData={this.loadPointData}
                />
            </div>);
    }
}

export default MapCoordCollector;
