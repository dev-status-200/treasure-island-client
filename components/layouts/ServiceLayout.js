import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Modal, Button, Form, Spinner, FormControl, Card, ListGroup, ListGroupItem  } from 'react-bootstrap'
import { AiFillDelete, AiFillEdit, AiFillEye ,AiOutlineSearch, AiFillEyeInvisible } from "react-icons/ai";
import axios from 'axios'
import Cookies from 'js-cookie'
import NumberFormat from "react-number-format";
import { useRouter } from 'next/router'

const ServiceLayout = () => {
  return (
    <div className='service-styles'>
    <Row>
      <Col><span className='service-left' style={{color:'grey'}}> Services </span><button className='global-btn mx-2' > Add new</button></Col>
    </Row>
    <Row className='mt-5 mx-3'>
      <Col md={3} className='mx-1'>
        <div className='service-card'>
          <img src={'/assets/images/car.PNG'} className='service-card-pic' />
          <div>
            <div className=' mx-2'>
              <h6 className='text-center  my-3'><b>Tuning & Serice</b></h6>
              <div className='detail-service'>
                <span className='left'>Total Cost</span>
                <span className='right'>100 $</span>
              </div>
              <hr className='my-2' />
              <div className='detail-service'>
                <span className='left'>Labour Cost</span>
                <span className='right'>50 $</span>
              </div>
              <hr className='my-2' />
              <div className='detail-service'>
              <span className='left'>Labour Cost</span>
              <span className='right'>50 $</span>
              </div>
              <hr className='mt-2' />
              <div className='text-center my-2'>
                <button className='global-btn px-5 my-3' > See Details </button>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <Col md={3} className='mx-1'>
        <div className='service-card'>
          <img src={'/assets/images/car.PNG'} className='service-card-pic' />
          <div>
            <div className=' mx-2'>
              <h6 className='text-center  my-3'><b>Tuning & Serice</b></h6>
              <div className='detail-service'>
                <span className='left'>Total Cost</span>
                <span className='right'>100 $</span>
              </div>
              <hr className='my-2' />
              <div className='detail-service'>
                <span className='left'>Labour Cost</span>
                <span className='right'>50 $</span>
              </div>
              <hr className='my-2' />
              <div className='detail-service'>
              <span className='left'>Labour Cost</span>
              <span className='right'>50 $</span>
              </div>
              <hr className='mt-2' />
              <div className='text-center my-2'>
                <button className='global-btn px-5 my-3' > See Details </button>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <Col md={3} className='mx-1'>
        <div className='service-card'>
          <img src={'/assets/images/car.PNG'} className='service-card-pic' />
          <div>
            <div className=' mx-2'>
              <h6 className='text-center  my-3'><b>Tuning & Serice</b></h6>
              <div className='detail-service'>
                <span className='left'>Total Cost</span>
                <span className='right'>100 $</span>
              </div>
              <hr className='my-2' />
              <div className='detail-service'>
                <span className='left'>Labour Cost</span>
                <span className='right'>50 $</span>
              </div>
              <hr className='my-2' />
              <div className='detail-service'>
              <span className='left'>Labour Cost</span>
              <span className='right'>50 $</span>
              </div>
              <hr className='mt-2' />
              <div className='text-center my-2'>
                <button className='global-btn px-5 my-3' > See Details </button>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    </div>
  )
}

export default ServiceLayout