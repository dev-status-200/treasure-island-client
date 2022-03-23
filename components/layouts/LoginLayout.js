import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Image from 'next/image'

const LoginLayout = () => {



  return (
    <div className='signin_styles '>
        <Container className='bg' fluid>
            <Row className='justify-content-md-center pt-5'>
            <div className='space'></div>
              <Col md="auto">
                <Image src={'/assets/images/white png logo.png'} width={140} height={70} />
              </Col>
            </Row>
            <Row className='justify-content-md-center pt-4'>
              <Col md="auto">
                <input placeholder='Username' className='input-field' />
              </Col>
            </Row>
            <Row className='justify-content-md-center pt-4'>
              <Col md="auto">
                <input placeholder='Password' type='password' className='input-field' />
              </Col>
            </Row>
            <Row className='justify-content-md-center pt-4'>
              <Col md="auto">
                <button className='custom-btn'>SIGN IN</button>
              </Col>
            </Row>
            <Row className='justify-content-md-center pt-4 f15'>
            <Col md="auto">
              <input type="checkbox" /><span className='wh mx-1'>Remember Me</span>
            </Col>
            <Col md="auto">
              <span className='wh mx-2'>Forgot Password</span>
            </Col>
            </Row>
        </Container>
    </div>
  )
}

export default LoginLayout