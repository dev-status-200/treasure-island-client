import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Modal, Button, Form, Spinner, FormControl } from 'react-bootstrap'
import { AiFillDelete, AiFillEdit, AiFillEye ,AiOutlineSearch, AiFillEyeInvisible } from "react-icons/ai";
import axios from 'axios'
import Cookies from 'js-cookie'
import NumberFormat from "react-number-format";
import { useRouter } from 'next/router'

const ServiceLayout = () => {
  return (
    <div className='mechanic-styles'>
    <Row>
    <Col><span style={{color:'grey'}}> Services </span><button className='global-btn mx-2' > Add new</button></Col>
    </Row>
    </div>
  )
}

export default ServiceLayout