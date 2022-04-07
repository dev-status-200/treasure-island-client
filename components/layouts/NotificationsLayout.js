import React, {useEffect, useState} from 'react'
import { Row, Col, Container, Table } from 'react-bootstrap'

const NotificationsLayout = ({notifications}) => {
  
    useEffect(() => {
        console.log(notifications);
    }, [])
    
  
    return (
    <div>
        <Container className='box' fluid>
            <Row >
                <Col>
                    <h5 className='my-3'>Notifications</h5>
                </Col>
            </Row>
            <Row>
                <Col>
                <Table responsive="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>Seen</th>
                  </tr>
                </thead>
                <tbody>
                    {
                        notifications.map((note,index)=>{
                            return(
                                <tr key={note.id}>
                                    <td>{index+1}</td>
                                    <td>{note.desc}</td>
                                    <td>{note.status}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
              </Table>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default NotificationsLayout