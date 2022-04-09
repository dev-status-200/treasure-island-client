import React,{useEffect, useState} from 'react'
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap'
import Image from 'next/image'
import Router from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import jwt_decode from "jwt-decode";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const LoginLayout = () => {

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [detailWarning, setDetailWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);

  const loginUser = (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(email, pass);
    axios.post(process.env.NEXT_PUBLIC_TI_LOGIN,{email:email, pass:pass}).then((x)=>{
      console.log(x)
      if(x.data.message=="Success"){
          //console.log(jwt_decode(x.data.token).username)
          Cookies.set('token', x.data.token, { expires: 1 })
          Cookies.set('username', jwt_decode(x.data.token).username, { expires: 1 })
          Cookies.set('role_id', jwt_decode(x.data.token).role_id, { expires: 1 })
          Cookies.set('loginId', jwt_decode(x.data.token).loginId, { expires: 1 })
          Cookies.set('picture', jwt_decode(x.data.token).picture, { expires: 1 })
          Router.push('/dashboard')
      }else if(x.data.message=="Invalid"){
          setLoading(false)
          setDetailWarning(true)
      }
    })
  } 
  return (
    <div className='signin_styles '>
        <Container className='bg' fluid>
            <form onSubmit={loginUser}>
              <Row className='justify-content-md-center  text-center pt-5'>
              <Col md="auto">
              <div className='space'></div>
              <Image src={'/assets/images/white png logo.png'} width={140} height={70} />
              </Col>
              </Row>
              <Row className='justify-content-md-center text-center mt-2 pt-4'>
                <Col md={12} xs={12} >
                  <input placeholder='Email or SSN' type='text' required className='input-field' value={email} onChange={(e)=>setEmail(e.target.value)} />
                </Col>
              </Row>
              <Row className='justify-content-md-center text-center pt-4'>
                <Col md={12} xs={12} >
                  <input placeholder='Password' type={showPass?"text":'password'} required className='input-field' value={pass} onChange={(e)=>setPass(e.target.value)} />
                  </Col>
                  <span>
                  {
                    !showPass?(<AiFillEye style={{position:'relative', cursor:'pointer', left:'110px', top:'-35px',color:'white'}} onClick={()=>setShowPass(!showPass)}/>)
                    :
                    (<AiFillEyeInvisible  style={{position:'relative', cursor:'pointer', left:'110px', top:'-35px',color:'white'}} onClick={()=>setShowPass(!showPass)}/>)
                  }
                  </span>
              </Row>
              <Row className='justify-content-md-center text-center pt-1'>
                <Col md={12} xs={12} >
                  <button className='custom-btn' type='submit'>{loading==true?<Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:'SIGN IN'}</button>
                </Col>
              </Row>
            </form>
            <Row className='justify-content-md-center  pt-4 f15'>
              <Col md={2} xs={12} >
                <div className='forgot-ps'> <input type="checkbox" /><span className='wh mx-1'>Remember Me</span> </div>
              </Col>
              <Col md={2} xs={12} className='ps' >
                <span className='wh mx-2'>Forgot Password</span>
              </Col>
            </Row>
            <Row className='justify-content-md-center'>
            <Col md={3} xs={8} className="px-4">
            {detailWarning===true && 
              <Alert className='my-3 mx-5' style={{ fontSize:'13px', color:'white', backgroundColor:"rgba(184, 74, 74, 0.521)"}} >
                  Incorrect<strong> Email </strong>or <strong>Password</strong> !
              </Alert>
            }
            </Col>
            </Row>
        </Container>
    </div>
  )
}

export default LoginLayout