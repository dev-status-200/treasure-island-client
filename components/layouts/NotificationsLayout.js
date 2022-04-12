import React, {useEffect, useState} from 'react'
import { Row, Col, Container, Table } from 'react-bootstrap'
import Cookies from 'js-cookie'
import moment from 'moment'
import { AiFillClockCircle } from "react-icons/ai";
import Router from 'next/router';
import axios from 'axios'

const NotificationsLayout = ({notifications}) => {

    const [ids, setIds] = useState([]);

    useEffect(() => {
        let tempState = [];
        notifications.forEach((x, index)=>{
            tempState[index]=x.id;
        })
        console.log(tempState);
        axios.post(process.env.NEXT_PUBLIC_TI_SEE_NOTIFICATIONS,{ids:tempState})
        console.log(notifications);
    }, [])
    return (
    <div>
    <Container style={{maxWidth:'900px'}}>
    <Row >
        <Col>
            <h5 className='my-4'>Notifications</h5>
        </Col>
    </Row>
    <Row>
    <Col style={{maxHeight:'550px', overflow:'auto'}}>
    <Table responsive="sm" borderless>
    <tbody>
        {
        notifications.map((note,index)=>{
        return(
        <div className={note.status=='seen'?"box-notifications-seen my-3":"box-notifications my-3"} key={index}>
        <Row>
            <Col style={{maxWidth:'60px'}}>
                <img src={Cookies.get('picture')} className="picture-notification" />
            </Col>
            <Col>
                <div className='mt-1'>{note.desc}
                    <span className='note-link'
                        onClick={()=>Router.push({pathname:`/${note.link}`, query:{id:`${note.query}`}})}> visit</span>
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