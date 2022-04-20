import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Modal, Button, Form, Spinner, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { useSetState } from 'react-use';
import Cookies from 'js-cookie';

import NumberFormat from "react-number-format";
import Router, { useRouter } from 'next/router';

const UserFormLayout = () => {

    const router = useRouter();

    const [available, setAvailable] = useState(true);
    const [success, setSuccess] = useState(false);

    const [mailList, setMailList] = useState([]);

    const [load, setLoad] = useState(false);

    const [mailWarn, setMailWarn] = useState(false);
    const [phoneWarn, setPhoneWarn] = useState(false);

    const [oldPhone, setOldPhone] = useState("");
    const [oldPhoneExists, setOldPhoneExists] = useState(true);

    const [customerType, setCustomerType] = useState("")
    const [checkNew, setCheckNew] = useState("");
    const [serviceShow, setServiceShow] = useState("");
    const [detailCheck, setDetailCheck] = useState("");

    useEffect(() => {
        console.log(router.asPath.slice(13))
        axios.post(process.env.NEXT_PUBLIC_TI_VERIFY_LINK,{id:router.asPath.slice(13)}).then((x)=>{
            if(x.data==""){
                console.log('notFound')
                setAvailable(false);
            }else{
                console.log('Found')
                setAvailable(true);
            }
        })
        getMail();
    }, [])

    const getMail = async() => {
        let res = await axios.get(process.env.NEXT_PUBLIC_TI_CUSTOMERS_EMAILS).then((x)=>(x.data));
        console.log(res)
        setMailList(res);
    }
    const [id          , setId        ] = useState('');
    const [f_name      , setF_name    ] = useState('');
    const [l_name      , setL_Name    ] = useState('');
    const [email       , setEmail     ] = useState('');
    const [phone       , setPhone     ] = useState('');
    const [address     , setAddress   ] = useState('');
    const [location    , setLocation  ] = useState('location-1');
    const [make        , setMake      ] = useState('');
    const [model       , setModel     ] = useState('');
    const [year        , setYear      ] = useState('');
    const [regio       , setRegio     ] = useState('');
    const [service     , setService   ] = useState('Service 1');
    const [description , setDescrition] = useState('');
    

    const [car1id      , setCar1Id    ] = useState("");
    const [car2id      , setCar2Id    ] = useState("");

    const [car1        , setCar1      ] = useState(true);
    const [car2        , setCar2      ] = useState(false);
    const [makeTwo     , setMakeTwo   ] = useState('');
    const [modelTwo    , setModelTwo  ] = useState('');
    const [yearTwo     , setYearTwo   ] = useState('');
    const [regioTwo    , setRegioTwo  ] = useState('');

    const [addNew, setAddNew] = useState(false);

    const [state       , setState     ] = useSetState({
        car:[]//{id:"", make:"", model:"", year:"", regio:""}
    })

    const addAgent = (e) => {
        e.preventDefault();
        let mailWarning = false;
        let phoneWarning = false;
        mailList.forEach((x)=>{
            if(x.email==email){
                mailWarning = true;
            }
            if(x.phone==phone){
                phoneWarning = true;
            }
        })
        if(mailWarning==true || phoneWarning == true){
            mailWarning==true?setMailWarn(true):setMailWarn(false);
            phoneWarning==true?setPhoneWarn(true):setPhoneWarn(false);

        }else{
            setServiceShow("show");
            //setLoad(true);

            // await axios.post(process.env.NEXT_PUBLIC_TI_ADD_CUSTOMERS, {
            //     f_name:f_name, l_name:l_name, photo:"https://res.cloudinary.com/abdullah7c/image/upload/v1643040095/images_djois2.png",
            //     email:email, shop_id:location, phone:phone, address:address, id:router.asPath.slice(13)
            // }).then((x)=>{
            //     setLoad(false);
            //     setSuccess(true);
            // })
        }
    }
    const verifyOldCustomer = () => {
        console.log('searching old customer');
        axios.post(process.env.NEXT_PUBLIC_TI_CUSTOMERS_PHONE,{phone:oldPhone}).then((x)=>{
            console.log(x.data)
            setId(x.data.id);
            if(x.data!="not found"){
                console.log("phone exists");
                setOldPhoneExists(true);
                setCustomerType("old");
                setServiceShow("show");
                let tempState = state.car;
                x.data.Cars.forEach((y, index)=>{
                    tempState.push({
                        id:y.id,
                        make:y.make,
                        model:y.model,
                        year:y.year,
                        regio:y.regio,
                        select:false,
                        new:false
                    })
                })
                setState({car:tempState})
                console.log(tempState)
            }else if(x.data=="not found"){
                console.log("phone dosent exits exists");
                setOldPhoneExists(false);
            }
        });
    }
    const submitForm = async(e) => {
        e.preventDefault();
            setLoad(true);

            if(checkNew!="old"){
                await axios.post(process.env.NEXT_PUBLIC_TI_ADD_CUSTOMERS, {
                f_name:f_name, l_name:l_name, photo:"https://res.cloudinary.com/abdullah7c/image/upload/v1643040095/images_djois2.png",
                email:email==""?"none":email, shop_id:location, phone:phone, address:address, id:router.asPath.slice(13), make:make, model:model, year:year, regio:regio,
                service:service, description:description
            }).then((x)=>{
                setLoad(false);
                setSuccess(true);
            })}else if(checkNew=="old"){
                let selectedCar;
                let newCar = false;
                state.car.forEach((x, index)=>{
                    if(x.new==true && x.select==true){
                        newCar = true;
                    }
                    if(x.select==true){
                        selectedCar = x
                    }
                });
                console.log(newCar);
                console.log(selectedCar);

                if(newCar==false){
                    await axios.post(process.env.NEXT_PUBLIC_TI_RE_CREATE_REQUEST,{id:selectedCar.id, linkId:router.asPath.slice(13)}).then((x)=>{
                        setLoad(false);
                        setSuccess(true);
                        //Router.push('/userForm');
                });
            }else if(newCar==true){
                    //create car 2 and service request
                    console.log('create car 2 and service request');
                    await axios.post(process.env.NEXT_PUBLIC_TI_ADD_CUSTOMER_NEW_CAR,{
                        linkId:router.asPath.slice(13), id:id, make:selectedCar.make,
                        model:selectedCar.model, year:selectedCar.year, regio:selectedCar.regio }).then((x)=>{
                            setLoad(false);
                            setSuccess(true);
                });
            }
        }
    }
    const checkCustomerType = () => {
        if(checkNew=="new"){
            setCustomerType("new");
        }else if(checkNew=="old"){
            setCustomerType("old");
        }
    }
    const checkDetails = (e) => {
        e.preventDefault();
        setDetailCheck("ok");
        console.log(state.car);
    }
  return (
    <div className='online-form pt-5'>
    {(available==true  && success==false) &&
    <div>
    <div className='text-center'>
            <img className='mb-3' src={'/assets/images/white png logo.png'} width={140} height={70} />
            {(available==true  && success==false && customerType=="") && <h3 className='wh'>Welcome To Our Shop</h3>}
            {(customerType=="new" && serviceShow=="") && <h3 className='wh'>Your Information for Registration</h3>}
            {(customerType=="new" && serviceShow=="show" && detailCheck=="") && <h3 className='wh'>Car Details</h3>}
            {(customerType=="old" && serviceShow=="show" && detailCheck=="") && <h3 className='wh'>Car Details</h3>}
            {(customerType=="new" && serviceShow=="show" && detailCheck=="ok") && <h3 className='wh'>How Can We Help You?</h3>}
            {(customerType=="old" && serviceShow=="show" && detailCheck=="ok") && <h3 className='wh'>How Can We Help You?</h3>}
        </div>
        {   customerType=="" &&
            <Container className='box mt-4 px-5 py-5' style={{maxWidth:'600px'}}>
            <Row className='px-3 py-3'>
                <Col>
                    <Form.Group className="mb" controlId="old">
                        <Form.Check type="radio" label=" Existing Customer" checked={checkNew=="old"?true:false} onChange={()=>setCheckNew("old")} />
                    </Form.Group>
                    {checkNew=="old" && <Form.Group className="" controlId="old">
                    <Form.Label>Phone</Form.Label>
                    <NumberFormat
                        format="(+#)###-###-####"
                        style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                        mask="_"
                        allowEmptyFormatting={true}
                        required value={oldPhone} onChange={(e)=>setOldPhone(e.target.value)}
                    />
                    {oldPhoneExists==false && <Form.Text style={{color:'crimson'}}> Number Not Found  </Form.Text>}
                    </Form.Group>}
                </Col>
                <Col>
                    <div style={{float:'right'}}>
                    <Form.Group  className="mb-3" controlId="new">
                        <Form.Check type="radio" label=" New Customer" checked={checkNew=="new"?true:false} onChange={()=>setCheckNew("new")} />
                    </Form.Group>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col style={{textAlign:'center'}}>
                    <Button className='px-5 mt-5' siz="sm" onClick={checkNew=="old"?verifyOldCustomer:checkCustomerType}>NEXT</Button>
                </Col>
            </Row>
            </Container>
        }
        {   (customerType=="new" && serviceShow=="") &&
            <Container className='box mt-4 px-4 py-5' style={{maxWidth:'600px'}}>
                <Form onSubmit={addAgent}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="First Name">
                            <Form.Label>First Name</Form.Label>
                            <input 
                                type="text" placeholder="first Name..." required value={f_name} onChange={(e)=>setF_name(e.target.value)} 
                                style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="Last Name">
                            <Form.Label>Last Name</Form.Label>
                            <input 
                                style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                                type="text" placeholder="last Name..." required value={l_name} onChange={(e)=>setL_Name(e.target.value)}
                            />
                        </Form.Group>                
                    </Col>
                </Row>      
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="Email">
                            <Form.Label>Email</Form.Label>
                            <input
                            style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                            type="email" placeholder="email..." value={email} onChange={(e)=>setEmail(e.target.value)} />
                            {mailWarn==true && <Form.Text style={{color:'crimson'}}> Email Not Unique  </Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="Shop ID">
                            <Form.Label>Shop ID</Form.Label>
                            <select aria-label="Default select example" required value={location} onChange={(e)=>setLocation(e.target.value)}
                                style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'5px', backgroundColor:'white'}}
                            >
                                    <option value="location-1">Location-1</option>
                                    <option value="location-2">Location-2</option>
                                </select>
                        </Form.Group>                
                    </Col>
                </Row>
                <Row>

                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="Phone">
                            <Form.Label>Phone</Form.Label>
                            <NumberFormat
                                    format="(+#)###-###-####"
                                    style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                                    mask="_"
                                    allowEmptyFormatting={true}
                                    required value={phone} onChange={(e)=>setPhone(e.target.value)}
                                />
                                {phoneWarn==true && <Form.Text style={{color:'crimson'}}> Phone Already Exists </Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Group className="mb-3" controlId="Address">
                            <Form.Label>Detailed Address</Form.Label>
                            <input
                            style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                            type="text" placeholder="address..." required value={address} onChange={(e)=>setAddress(e.target.value)}/>
                        </Form.Group>
                    </Col>
                </Row>
                    <Button variant="primary" type="submit">
                        {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:'Next'}
                    </Button>
                </Form>
            </Container>
        }
        {
            (customerType=="new" && serviceShow=="show" && detailCheck=="") &&
            <Container className='box mt-4 px-5 py-5' style={{maxWidth:'800px'}}>
            <Form onSubmit={checkDetails}>
            <Row>
                <Col>
                <Form.Group className="mb-3" controlId="make">
                    <Form.Label>Make</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="" value={make} onChange={(e)=>setMake(e.target.value)} required />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" controlId="make">
                    <Form.Label>Model</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="" value={model} onChange={(e)=>setModel(e.target.value)} required />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" controlId="make">
                    <Form.Label>Year</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="" value={year} onChange={(e)=>setYear(e.target.value)} required />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" controlId="make">
                    <Form.Label>Regio/Vin</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="" value={regio} onChange={(e)=>setRegio(e.target.value)} required />
                </Form.Group>
                </Col>

            </Row>
            <Row className='mt-3'>
                <Col style={{textAlign:'center'}}>
                    <Button className='px-5 mt-5' size="" type="submit">NEXT</Button>
                </Col>
            </Row>
            </Form>
            </Container>
        }
        {
            (customerType=="new" && serviceShow=="show" && detailCheck=="ok") &&
            <Container className='box mt-4 px-5 py-5' style={{maxWidth:'600px'}}>
                <Form onSubmit={submitForm}>
                <Row className="justify-content-md-center">
                    <Col md={7}>
                    <Form.Label>Service</Form.Label>
                        <Form.Select onChange={(e)=>setService(e.target.value)} required>
                            <option value="Service 1">Service 1</option>
                            <option value="Service 2">Service 2</option>
                            <option value="Service 3">Service 3</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-3">
                    <Col md={7}>
                    <Form.Group className="mb-1 " controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} required value={description} onChange={(e)=>setDescrition(e.target.value)} />
                    </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-3">
                    <Col md={7}>
                        <Button className='px-4' style={{width:'100%'}} type="submit">{load?<Spinner animation="border" size="sm" />:"Submit"}</Button>
                    </Col>
                </Row>
                </Form>
            </Container>
        }
        {   (customerType=="old" && serviceShow=="show" && detailCheck=="") &&
            <Container className='box mt-4 px-5 py-5' style={{maxWidth:'800px'}}>
            <Form onSubmit={checkDetails}>
            <Row style={{ maxHeight:'280px', overflowY:'auto'}}>
            {
                state.car.map((carz, index)=>{
                    return(
                        <Row key={index} >
                            <Col md={1}>
                            <Form.Group className="mb" controlId="old">
                            <Form.Label></Form.Label>
                                <Form.Check className="mt-2" type="radio" label="" checked={carz.select?true:false}
                                onChange={()=>{
                                    let tempState = state.car;
                                    tempState.forEach((x, indexTwo)=>{
                                        if(indexTwo==index){
                                            x.select = true
                                        }else{
                                            x.select = false
                                        }
                                    })
                                    setState({car:tempState})
                                }} />
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3" controlId="make">
                                <Form.Label>Make</Form.Label>
                                <Form.Control type="text" size="sm" disabled={carz.select?false:true} value={carz.make}
                                onChange={(e)=>{
                                    let tempState = state.car;
                                    tempState[index].make = e.target.value;
                                    setState({car:tempState})
                                }} required />
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3" controlId="make">
                                <Form.Label>Model</Form.Label>
                                <Form.Control type="text" size="sm" disabled={carz.select?false:true} value={carz.model} 
                                onChange={(e)=>{
                                    let tempState = state.car;
                                    tempState[index].model = e.target.value;
                                    setState({car:tempState})
                                }}  required />
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3" controlId="make">
                                <Form.Label>Year</Form.Label>
                                <Form.Control type="text" size="sm" disabled={carz.select?false:true} value={carz.year} 
                                onChange={(e)=>{
                                    let tempState = state.car;
                                    tempState[index].year = e.target.value;
                                    setState({car:tempState})
                                }} required />
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3" controlId="make">
                                <Form.Label>Regio/Vin</Form.Label>
                                <Form.Control type="text" size="sm" disabled={carz.select?false:true} value={carz.regio} 
                                onChange={(e)=>{
                                    let tempState = state.car;
                                    tempState[index].regio = e.target.value;
                                    setState({car:tempState})
                                }} required />
                            </Form.Group>
                            </Col>
                        </Row>
                    )
                })
            }
            </Row>
            <Row className='mt-3'>
                <Col style={{textAlign:'center'}}>
                    <Button className='px-5 mt-5' size="" disabled={addNew?true:false} onClick={()=>{
                        setAddNew(true);
                        let tempState = state.car
                        tempState.push({id:"", make:"", model:"", year:"", regio:"", select:false, new:true})
                        setState({car:tempState});
                    }}>Add New</Button>
                </Col>
                <Col style={{textAlign:'center'}}>
                    <Button className='px-5 mt-5' size="" type="submit">NEXT</Button>
                </Col>
            </Row>
            </Form>
            </Container>
        }
        {   (customerType=="old" && serviceShow=="show" && detailCheck=="ok") &&
            <Container className='box mt-4 px-5 py-5' style={{maxWidth:'600px'}}>
                <Form onSubmit={submitForm}>
                <Row className="justify-content-md-center">
                    <Col md={7}>
                    <Form.Label>Service</Form.Label>
                        <Form.Select onChange={(e)=>setService(e.target.value)} required>
                            <option value="Service 1">Service 1</option>
                            <option value="Service 2">Service 2</option>
                            <option value="Service 3">Service 3</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-3">
                    <Col md={7}>
                    <Form.Group className="mb-1 " controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} required value={description} onChange={(e)=>setDescrition(e.target.value)} />
                    </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-3">
                    <Col md={7}>
                        <Button className='px-4' style={{width:'100%'}} type="submit">{load?<Spinner animation="border" size="sm" />:"Submit"}</Button>
                    </Col>
                </Row>
                </Form>
            </Container>
        }
    </div>
    }
    {
        (available==false  && success==false) && <h5 className='wh text-center'>Sorry, the following link expired</h5>
    }
    {
        ((available==false || available==true)  && success==true) && <h5 className='wh text-center'>You Have Been Successfully Registered!</h5>
    }
</div>
  )
}

export default UserFormLayout