import React from 'react';
import {Button} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';

export default function DotsInfo({dots, deleteDot, resetDots}) {
  return (
      <div className="dotsinfo">
          <div className="row justify-content-center">
            <Table hover className="dotsinfotable ">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>id</th>
                    <th>shortName</th>
                    <th>x</th>
                    <th>y</th>
                    <th>name</th>
                    <th>areaId</th>
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
                            <td><Button variant='danger' onClick={() => deleteDot(i)}>×</Button></td>
                    </tr>);})}
                </tbody>
              </Table>
          </div>
          <Button variant='success' onClick={() => resetDots()}>Reset</Button>
      </div>

  );
}
