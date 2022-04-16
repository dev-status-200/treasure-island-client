import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Modal, Button, Form, Spinner, FormControl, Card, ListGroup, ListGroupItem  } from 'react-bootstrap'
import { AiFillDelete, AiFillEdit, AiFillEye ,AiOutlineSearch, AiFillEyeInvisible } from "react-icons/ai";
import axios from 'axios'
import Cookies from 'js-cookie'
import NumberFormat from "react-number-format";
import { useRouter } from 'next/router'
import Select from 'react-select';
import { useSetState } from 'react-use';

const ServiceLayout = ({parts}) => {

  const [show, setShow] = useState(false);
  const [cars, setCars] = useState([{index:1}]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [image, setImage] = useState();
  const [state, setState] = useSetState({
    serviceList:[{index:0, make:'', model:'', from:0, to:0, partList:[], partCost:0, labourCost:0, discount:0, estimateCost:0}]
  })
  const [partList, setPartList] = useState([]);


  useEffect(() => {
    let tempState = [];
    parts.forEach(x => {
      tempState.push({label:`${x.part_number} (${x.brand_name} ${x.part_name})`, value:x.id})
    });
    //setState({serviceList:...tempState})
    setPartList(tempState)
  }, [])

  return (
    <div className='service-styles'>
    {!show && 
      <div>
      <Row>
        <Col><span className='service-left' style={{color:'grey'}}> Services </span><button className='global-btn mx-2' onClick={handleShow}> Add new</button></Col>
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
    </div>}
    {show &&
      <div style={{maxHeight:'640px', overflowY:'auto', overflowX:'hidden'}}>
      <Row>
        <Col>
        <span className='service-left px-1' style={{color:'grey'}}> Detail </span>
          <button className='global-btn mx-1' onClick={handleClose}>{"< Back"}</button>
        </Col>
      </Row>
      <Row className=' mx-1'>
      <Col><span className='service-left' style={{color:'grey'}}> </span></Col>
      </Row>
      <Form>
      <Row>
        <Col>
          <div className='box px-5 mx-3'>
          <Row>
            <Col md={6}>
            <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" size="sm" placeholder="" />
            </Form.Group>
            </Col>
            <Col md={6}>
            <Form.Group style={{minWidth:"300px", float:'right'}} className="mb-3"  controlId="formBasicEmail">
              <Form.Label>Image</Form.Label><br/>
              <input type="file" size="sm" onChange={(e) => setImage(e.target.files[0])} required></input>
            </Form.Group>
            </Col>
          </Row>
          <hr/>
          <Row className='my-2'><strong>Cars</strong></Row>
          <div>
          {
            cars.map((serv, index)=>{
              return(
          <div className='mt-3 service-box'>
            <Row>
                <Col>
                <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                  <Form.Label>Make</Form.Label>
                  <Form.Control type="text" size="sm" placeholder="" />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                  <Form.Label>Model</Form.Label>
                  <Form.Control type="text" size="sm" placeholder="" />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                  <Form.Label>Year</Form.Label>
                  <br/>
                  <span><Form.Control type="text" className=''  size="sm" style={{maxWidth:'40%', display:'inline-block'}} placeholder="" /></span>
                  <span className='mx-2'>To</span>
                  <span><Form.Control type="text" className=''  size="sm" style={{maxWidth:'40%', display:'inline-block'}} placeholder="" /></span>
                </Form.Group>
                </Col>
            </Row>
            <Row>
            <Select
                defaultValue={'Country'}
                isMulti
                name="colors"
                options={partList}
                //value={state.country}
                //onChange={(e) => setState({ country: e })}
                className="basic-multi-select"
                classNamePrefix="select"
            />
            </Row>
          </div>
              )
            })
          }
            <Row className="justify-content-md-center mt-5">
              <hr/>
              <Col md="auto">
                <div className='plus' onClick={()=>{
                  let tempState = [...cars];
                  tempState.push({index:1});
                  setCars(tempState)
                }}>+</div>
              </Col>
            </Row>
          </div>
          <div>
          </div>
          </div>
          </Col>
          </Row>
          <Row>
            <Col>
            <Row className='mt-2 px-1' ><Col><span className='service-left' style={{color:'grey'}}>Pricing </span></Col></Row>
              <div className='box px-5 mt-2 mx-3 car-box'>
              {
                cars.map((serv, index)=>{
                  return(
                    <Row>
                      {/*<Col md={1}>
                        <div>Car</div>
                        <div className='car-heading'>Audi-R8</div>
                      </Col>*/}
                        <Col>
                        <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                          <Form.Label>Parts Cost</Form.Label>
                          <Form.Control type="text" size="sm" placeholder="" />
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                          <Form.Label>Labour cost</Form.Label>
                          <Form.Control type="text" size="sm" placeholder="" />
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                          <Form.Label>Discount</Form.Label>
                          <Form.Control type="text" size="sm" placeholder="" />
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                          <Form.Label>Estimate Cost</Form.Label>
                          <Form.Control type="text" size="sm" placeholder="" />
                        </Form.Group>
                        </Col>
                    </Row>
                  )
                })
              }
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    }
    </div>
  )
}

export default ServiceLayout