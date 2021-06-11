import React from 'react';
import {Container, Row} from 'react-bootstrap';

function Docs(props) {
    return (<div id="docs" >
                <div className="page-content">
                    <h1>
                        Documentation
                    </h1>

                    <ul>
                        <li>
                            Start by selecting a piste map from the drop down field or uploading a map using the file upload button
                        </li>
                        <li>
                            Clicking <b>Start</b> will take you to the <b>matching view</b>. Here, you can click on the map to add a new point.
                        </li>
                        <li>
                            When a new point is added, the input modal is shown. Here you can make adjustments to the (x, y) coordinate, the id, name, shortName, and areaId. Click on save to save the point.
                        </li>
                        <li>
                            You can also upload an existing JSON file in the <b>matching view</b>. This will load the data in the file and render the points. You can make changes, and then download the updated version using the <b>Download</b> button.
                        </li>
                    </ul>

                    <br/>

                    <Container>
                    <Row><h2>File structure</h2></Row>
                    <Row>
                    <div className="json-snippet">
                        <pre>{JSON.stringify({
                        "points": [
                            {
                                "id": "193",
                                "name": "Adam",
                                "shortName": "1",
                                "areaId": "lindvallen",
                                "pisteMapCoordinates": {
                                    "x": 145,
                                    "y": 537
                                }
                            },
                            {
                                "id": "194",
                                "name": "Pernilla",
                                "shortName": "2",
                                "areaId": "lindvallen",
                                "pisteMapCoordinates": {
                                    "x": 281,
                                    "y": 535
                                }
                            }
                        ]}, null, 2)}</pre>

                    </div>
                    </Row>
                    </Container>
                </div>
            </div>
    );
}

export default Docs;
