import React, {useEffect, useState} from 'react'
import { Row, Col, Container, Table } from 'react-bootstrap'
import Cookies from 'js-cookie'
import moment from 'moment'
import { AiFillClockCircle } from "react-icons/ai";

const NotificationsLayout = ({notifications}) => {
  
    useEffect(() => {
        console.log(notifications);
    }, [])
    return (
    <div>
        <Container style={{maxWidth:'900px'}}>
            <Row >
                <Col>
                    <h5 className='mt-4'>Notifications</h5>
                </Col>
            </Row>
            <Row>
                <Col>
                <Table responsive="sm" borderless>
                <tbody>
                    {
                    notifications.map((note,index)=>{
                    return(
                    <div className='box-notifications my-3' key={index}>
                    <Row>
                        <Col style={{maxWidth:'60px'}}>
                            <img src={Cookies.get('picture')} className="picture-notification" />
                        </Col>
                        <Col>
                            <div className='mt-1'>{note.desc}
                            </div>
                            <div>   
                                <AiFillClockCircle/><span className='mx-1'>{moment(note.createdAt).fromNow()}</span>
                            </div>
                        </Col>
                    </Row>    
                    </div>
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
                                {/*<tr key={note.id} className='box my-2'>
                                    <td>{index+1}</td>
                                    <td>{note.desc}</td>
                                    <td>{note.status}</td>
                                </tr>*/}