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
    serviceList:[{index:0, make:'', model:'', from:0, to:0, partList:"", partCost:0, labourCost:0, discount:0, estimateCost:0}]
  });
  const [partList, setPartList] = useState([]);

  const [priceChange, setPriceChange] = useState(false)

  useEffect(() => {
    let tempState = [];
    parts.forEach(x => {
      tempState.push({label:`${x.part_number} (${x.brand_name} ${x.part_name}) $ ${x.cost}`, value:x.id})
    });
    setPartList(tempState);
  }, [])

  const extendCar = () => {
    let tempState = [...cars];
    let tempStateTwo = state.serviceList;
    tempState.push({index:1});
    tempStateTwo.push({index:0, make:'', model:'', from:0, to:0, partList:[], partCost:0, labourCost:0, discount:0, estimateCost:0})
    setCars(tempState);
    setState({serviceList:tempStateTwo});
    console.log(tempStateTwo);
  }

  useEffect(() => {
    console.log('useeffect Hit')
    let tempState = state.serviceList;
    let estimate = 0;
    tempState.forEach((x, index)=>{
      estimate = x.partCost + parseFloat(x.labourCost) - parseFloat(x.discount)
      console.log(x.partCost)
      x.estimateCost = estimate
    });
    console.log(estimate)
    setState({serviceList:tempState})
  }, [priceChange])
  

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
          <div className='mt-3 service-box' key={index}>
            <Row>
                <Col>
                <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                  <Form.Label>Make</Form.Label>
                  <Form.Control type="text" size="sm" placeholder="" 
                  value={state.serviceList[index].make} 
                  onChange={(e)=>{
                    let tempState = state.serviceList;
                    tempState[index].make=e.target.value
                    setState({serviceList:tempState})
                  }} />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                  <Form.Label>Model</Form.Label>
                  <Form.Control type="text" size="sm" placeholder="" 
                  value={state.serviceList[index].model} 
                  onChange={(e)=>{
                    let tempState = state.serviceList;
                    tempState[index].model=e.target.value
                    setState({serviceList:tempState})
                  }}  />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                  <Form.Label>Year</Form.Label>
                  <br/>
                  <span><Form.Control type="text" className=''  size="sm" style={{maxWidth:'40%', display:'inline-block'}} placeholder=""
                  value={state.serviceList[index].from} 
                  onChange={(e)=>{
                    let tempState = state.serviceList;
                    tempState[index].from=e.target.value
                    setState({serviceList:tempState})
                  }}  /></span>
                  <span className='mx-2'>To</span>
                  <span><Form.Control type="text" className=''  size="sm" style={{maxWidth:'40%', display:'inline-block'}} placeholder=""
                  value={state.serviceList[index].to} 
                  onChange={(e)=>{
                    let tempState = state.serviceList;
                    tempState[index].to=e.target.value
                    setState({serviceList:tempState})
                  }}  /></span>
                </Form.Group>
                </Col>
            </Row>
            <Row>
            <Select
                defaultValue={'Country'}
                isMulti
                name="colors"
                options={partList}
                onChange={(e) => {
                    let tempState = state.serviceList;
                    let price = 0;
                    //let estimate = tempState[index].estimateCost
                    console.log(e);
                    if(e.length>0){
                      parts.forEach((x)=>{
                        e.forEach((y)=>{
                          if(x.id==y.value){
                            price = price + x.cost;
                            //estimate = estimate + price;
                          }
                        })
                      })
                    }
                    tempState[index].partList=e
                    tempState[index].partCost=price
                    //tempState[index].estimateCost=estimate
                    setState({serviceList:tempState});
                    setPriceChange(!priceChange);
                }}
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
                <div className='plus' onClick={extendCar}>+</div>
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
                    <Row key={index}>
                      {/*<Col md={1}>
                        <div>Car</div>
                        <div className='car-heading'>Audi-R8</div>
                      </Col>*/}
                        <Col>
                        <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                          <Form.Label>Parts Cost</Form.Label>
                          <Form.Control type="number" size="sm" placeholder="" value={state.serviceList[index].partCost.toFixed(2)} />
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                          <Form.Label>Labour cost</Form.Label>
                          <Form.Control type="number" size="sm" placeholder="" 
                          value={state.serviceList[index].labourCost} 
                          onChange={(e)=>{
                            let tempState = state.serviceList;
                            tempState[index].labourCost=e.target.value
                            setState({serviceList:tempState});
                            setPriceChange(!priceChange);
                          }}  />
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                          <Form.Label>Discount</Form.Label>
                          <Form.Control type="text" size="sm" placeholder=""
                          value={state.serviceList[index].discount} 
                          onChange={(e)=>{
                            let tempState = state.serviceList;
                            tempState[index].discount=e.target.value
                            setState({serviceList:tempState});
                            setPriceChange(!priceChange);
                          }}  />
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group className="mb-3" style={{maxWidth:"300px"}} controlId="formBasicEmail">
                          <Form.Label>Estimate Cost</Form.Label>
                          <Form.Control type="number" size="sm" placeholder=""
                          value={state.serviceList[index].estimateCost.toFixed(2)} />
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