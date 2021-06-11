import './styles/mapForm.css';
import React from 'react';
import {Container, Form} from 'react-bootstrap';
import {Link} from "react-router-dom";

class MapForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            val: this.props.resorts[0].id,
            uploadedMap: null,
            uploadedMapName: '',
        }
    }

    handleDropdownChange = (e) => {
        this.setState({val: e.target.value});
    }

    handleFileChange = (e) => {
        if(e.target.files[0] == null) return;
        this.setState({
            uploadedMap: {
                url: URL.createObjectURL(e.target.files[0]),
                name: e.target.files[0].name
            }
        });
    }

    handleStart = () => {
        let { uploadedMap, val } = this.state;
        if(uploadedMap == null) {
            this.props.onSelect(val);
        } else {
            this.props.onUpload(uploadedMap);
        }
    }

    render() {
        return (
            <div id="mapform" >
                <div className="vertical-center">
                    <Container className="selectcontainer">
                        <Form>
                            <Form.Label className="form-title">Welcome!</Form.Label>
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Label>Select or upload piste map</Form.Label>
                                <Form.Control as="select"
                                onChange={this.handleDropdownChange}>
                                {this.props.resorts.map((resort => (
                                    <option key={resort.title} value={resort.id}>{resort.title}</option>
                                )))}
                                </Form.Control>
                                <br/>
                                <Form.File onChange={this.handleFileChange}
                                multiple={false}
                                accept="image/png, image/jpeg"/>
                                <br/>
                                {this.state.uploadedMap ?
                                    <div className="image-wrapper">
                                        <img src={this.state.uploadedMap.url} alt="preview"/>
                                        <br/><br/>
                                    </div> : null }
                                </Form.Group>
                                <Link to="/matcher" onClick={this.handleStart} className="btn btn-primary">Start!</Link>
                        </Form>
                    </Container>
                </div>
            </div>
        );
    }

}
export default MapForm;
