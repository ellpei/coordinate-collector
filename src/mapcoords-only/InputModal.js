import '../styles/geoCoordSelector.css';
import React from 'react';
import Backdrop from '../image-dots/backdrop.js';
import {Button, Form, Row, Col} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

class InputModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.currentDot.id,
            name: this.props.currentDot.name,
            shortName: this.props.currentDot.shortName,
            areaId: this.props.currentDot.areaId
        }
    }

    clearFields = () => {
        this.setState({
            id: '',
            name: '',
            shortName: '',
            areaId: ''
        });
    }

    onKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.props.handleSave(this.state);
        }
    }

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
          [name]: value
        });
    }

    render() {
        const {handleClose} = this.props;
        const wW = window.innerWidth;
        var left = this.props.posX > wW/2 ? 0 : Math.round(wW*0.525);
        return (
            <div id="geoCoordSelector">

                    <div className="coord-selector">
                    <Backdrop show={true} clicked={() => this.props.handleSave(this.state)} />
                    <Card className="modal-body"
                    style={{
                        top: 10,
                        left: left}}>
                        <Card.Body>
                            <Card.Title>Edit point data</Card.Title>
                            <Form>
                                <Form.Group as={Row}>
                                    <Form.Label column>x</Form.Label>
                                    <Col sm={4}>
                                        <Form.Control type="number" defaultValue={this.props.currentDot.x}
                                        onChange={(e) => {this.props.updateCurrentDot({x: e.target.valueAsNumber})}}/>
                                    </Col>
                                    <Form.Label column>y</Form.Label>
                                    <Col sm={4}>
                                        <Form.Control type="number" defaultValue={this.props.currentDot.y}
                                        onChange={(e) => {this.props.updateCurrentDot({y: e.target.valueAsNumber})}}/>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column >
                                      id
                                    </Form.Label>
                                    <Col sm={8}>
                                      <Form.Control type="text"
                                      placeholder="Enter id..."
                                      name="id"
                                      defaultValue={this.state.id}
                                      onChange={this.handleInputChange}
                                      autoFocus/>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column >
                                      name
                                    </Form.Label>
                                    <Col sm={8}>
                                      <Form.Control type="text"
                                      placeholder="Enter name..."
                                      name="name"
                                      defaultValue={this.state.name}
                                      onChange={this.handleInputChange}/>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column>
                                      shortName
                                    </Form.Label>
                                    <Col sm={8}>
                                      <Form.Control type="text"
                                      placeholder="Enter shortName..."
                                      name="shortName"
                                      defaultValue={this.state.shortName}
                                      onChange={this.handleInputChange}/>
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row}>
                                    <Form.Label column >
                                      areaId
                                    </Form.Label>
                                    <Col sm={8}>
                                      <Form.Control type="text"
                                      placeholder="Enter areaId..."
                                      name="areaId"
                                      defaultValue={this.state.areaId}
                                      onChange={this.handleInputChange}
                                      onKeyPress={this.onKeyPress} />
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                        <Card.Footer>
                        <Button variant="secondary" onClick={handleClose}>Delete</Button>
                            <Button variant="secondary" onClick={() => this.props.handleSave(this.state)}>Close</Button>
                            <Button variant="primary" onClick={() => this.props.handleSave(this.state)}>Save</Button>
                        </Card.Footer>
                    </Card>
                    </div>
            </div>);
    }
}

export default InputModal;
