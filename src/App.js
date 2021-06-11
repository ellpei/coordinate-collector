import './styles/App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MapForm from './mapForm.js';
import MapCoordCollector from './mapcoords-only/MapCoordCollector.js';
import images from './images';
import Docs from './docs.js';
import About from './about.js';
import {Navbar, Nav} from 'react-bootstrap';
import {
    HashRouter as Router,
    Link,
    Switch,
    Route,
    Redirect,
  } from "react-router-dom";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resortObject: null,
            useGeoCoords: true,
        };
    }

    setResort = (choice, useGeoCoords) => {
        this.setState({
            resortObject: images[choice],
            useGeoCoords: useGeoCoords
        });
    }

    uploadMap = (file, useGeoCoords) => {
        let filename = file.name;
        let title = filename.substr(0, filename.lastIndexOf('.'));
        this.setState({
            resortObject: { src: file.url, title: title},
            useGeoCoords: useGeoCoords,
        });
    }

    render() {
        return (
            <div className="App">
                <Router basename="/">
                    <Navbar className="navbar" bg="light" variant="light">
                        <Link className="navbar-brand" to="/">
                            <div className="header">
                                <h1>Coordinate Collector</h1>
                            </div>
                        </Link>
                        <Nav className="mr-auto">
                            <Link className="nav-link" to="/docs">Docs</Link>
                            <Link className="nav-link" to="/about">About</Link>
                        </Nav>
                        { this.state.resortObject ?
                            <Navbar.Text>
                                {this.state.resortObject.title}
                            </Navbar.Text> : null }

                    </Navbar>
                    <Switch>
                        <Route exact path="/">
                            <MapForm
                            resorts={images}
                            onSelect={this.setResort}
                            onUpload={this.uploadMap}/>
                        </Route>
                        <Route path="/docs">
                            <Docs />
                        </Route>
                        <Route path="/about">
                            <About />
                        </Route>
                        <Route path="/matcher">
                        {(() => {
                              if (!this.state.resortObject)
                                 return <Redirect to={{ pathname: '/', state: { from: this.props.location } }} />
                              else
                                 return <MapCoordCollector resort={this.state.resortObject}/>
                          })()}
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }


}


export default App;
