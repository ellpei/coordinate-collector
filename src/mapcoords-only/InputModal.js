import '../styles/geoCoordSelector.css';
import React from 'react';
import Backdrop from '../image-dots/backdrop.js';
import {Button, Form, Row, Col} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

class InputModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: props.currentDot.items.length === 0 ? [{
                id: '',
                name: '',
                shortName: '',
                areaId: props.currentDot.areaId
            }] : props.currentDot.items
        };
    }

    onKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.props.handleSave(this.state);
        }
    }

    handleInputChange = (e, index) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        let items = [...this.state.items];
        let item = items[index];
        item[name] = value;

        this.setState({
            items: items,
        });
    }

    addAnother = () => {
        let newObj = {
            id: '',
            name: '',
            shortName: '',
            areaId: this.props.currentDot.areaId
        };

        this.setState({items: [...this.state.items, newObj ]});
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
                                <hr/>
                                {
                                    this.state.items.map( (x, i) =>
                                        <div className="dot-form-item" key={i}>
                                            <Form.Group as={Row}>
                                                <Form.Label column >
                                                  id
                                                </Form.Label>
                                                <Col sm={8}>
                                                  <Form.Control type="text"
                                                  placeholder="Enter id..."
                                                  name="id"
                                                  defaultValue={x.id}
                                                  onChange={(e) => this.handleInputChange(e, i)}
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
                                                  defaultValue={x.name}
                                                  onChange={(e) => this.handleInputChange(e, i)}/>
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
                                                  defaultValue={x.shortName}
                                                  onChange={(e) => this.handleInputChange(e, i)}/>
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
                                                  defaultValue={x.areaId}
                                                  onChange={(e) => this.handleInputChange(e, i)}
                                                  onKeyPress={this.onKeyPress} />
                                                </Col>
                                            </Form.Group>
                                            <hr/>
                                        </div>
                                    )

                                }

                            </Form>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="success" className="float-left" onClick={this.addAnother}>+</Button>
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
