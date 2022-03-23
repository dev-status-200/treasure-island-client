import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Image from 'next/image'

const LoginLayout = () => {
  return (
    <div className='signin_styles '>
        <Container className='bg' fluid>
            <Row className='justify-content-md-center pt-5'>
                <Col md="auto pt-5">
                    <Image src={'/assets/images/white png logo.png'} width={160} height={70} />
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default LoginLayout