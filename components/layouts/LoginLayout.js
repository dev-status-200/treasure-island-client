import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Image from 'next/image'

const LoginLayout = () => {

  return (
    <div className='signin_styles '>
        <Container className='bg' fluid>
            <Row className='justify-content-md-center  text-center pt-5'>
            <div className='space'></div>
              <Col md="auto">
                <Image src={'/assets/images/white png logo.png'} width={140} height={70} />
              </Col>
            </Row>
            <Row className='justify-content-md-center text-center pt-4'>
              <Col md={12} xs={12} >
                <input placeholder='Username' className='input-field' />
              </Col>
            </Row>
            <Row className='justify-content-md-center text-center pt-4'>
              <Col md={12} xs={12} >
                <input placeholder='Password' type='password' className='input-field' />
              </Col>
            </Row>
            <Row className='justify-content-md-center text-center pt-4'>
              <Col md={12} xs={12} >
                <button className='custom-btn'>SIGN IN</button>
              </Col>
            </Row>
            <Row className='justify-content-md-center  pt-4 f15'>
              <Col md={2} xs={12} >
                <div className='forgot-ps'> <input type="checkbox" /><span className='wh mx-1'>Remember Me</span> </div>
              </Col>
              <Col md={2} xs={12} className='ps' >
                <span className='wh mx-2'>Forgot Password</span>
              </Col>
            </Row>
        </Container>
    </div>
  )
}

export default LoginLayout