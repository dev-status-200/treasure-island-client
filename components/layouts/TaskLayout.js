import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Spinner, Button, Form } from 'react-bootstrap';
import { useSetState } from 'react-use';
import { FileUploader } from "react-drag-drop-files";
import Select from 'react-select';
import Cookies from 'js-cookie'
import axios from 'axios'
import Router, { useRouter } from 'next/router';

const fileTypes = ["JPEG", "PNG", "GIF", "BMP"];

const TaskLayout = ({services, parts, tasks}) => {

    const router = useRouter();

    const [taskShow, setTaskhow] = useState(false);
    const [make    , setMake  ] = useState("Audi");
    const [year    , setYear  ] = useState("2012");
    const [model    , setModel  ] = useState("2012");
    const [regio    , setRegio  ] = useState("2012");
    const [description    , setDescription  ] = useState("");
    const [partList, setPartList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0.00);
    const [tax, setTax] = useState(0.00);
    const [fPrice, setFPrice] = useState(0.00);
    const [image, setImage] = useState("");
    const [service, setService] = useState("");
    const [extPartPrice, setExtPartPrice] = useState(0.00);

    const [load, setLoad] = useState(false)

    const [state, setState ] = useSetState({
        service:[{
        id:"",make:"",model:"",from:"",to:"",partsCost:"",labourCost:"",discount:"",estimate:"",parts:[],createdAt:"",updatedAt:"",ServiceId:""
        }]
    });

    useEffect(() => {
 //       console.log(router.query)
        if(router.query.taskhow){
            setTaskhow(true);
            setService(router.query.service)
            setMake(router.query.make)
            setYear(router.query.year)
            setModel(router.query.model)
            setRegio(router.query.regio)
            setDescription(router.query.description)
        }
        let tempState = [];
        parts.forEach(x => {
          tempState.push({label:`${x.part_number} (${x.brand_name} ${x.part_name}) $ ${x.cost}`, value:x.id})
        });
        setPartList(tempState);
        //console.log(tasks)
    }, [])

    useEffect(() => {

        let Price = 0.00;
        state.service.forEach((x, index)=>{
            if(x.estimate!=""){
                Price = Price + parseFloat(x.estimate)
            }
        })
        Price = Price
        setTotalPrice(Price)
        setFPrice(Price + parseFloat(tax) + parseFloat(extPartPrice))
    }, [state.service, tax, extPartPrice])
                
    const getPartName = (x) => {
        let value = "";
        parts.forEach((y)=>{
            if(y.id==x){
                value = y.part_number
            }
        })
        return value
    };

    const getPartsPrize = (x) => {
        console.log("Price Calculation");
        console.log(x)
        let price = 0.0
        parts.forEach((y)=>{
            x.forEach((z, index)=>{
                if(y.id==z){
                    //console.log(y.cost);
                    price = price + parseFloat(y.cost)
                }
            })
        })
        return price
    };

    const changePrice = (part, index) => {
        console.log(part)
        console.log(index)
        let tempState = [...state.service];
        parts.forEach((y)=>{
            if(y.id==part){
                tempState[index].parts = tempState[index].parts.filter((x)=>{
                    if(x==part){
                        console.log(x)
                    }else if(x!=part) {
                        return x
                    }else if(x==""){
                        return x
                    }
                })
                tempState[index].estimate = parseFloat(tempState[index].estimate) - parseFloat(y.cost)
            }
        })
        console.log(tempState)
        
        setState({service:tempState})
    }

    async function uploadImage(){

        let value = '';
        let index = 0;
        index = image.length
        let values = ""
        for (let i = 0; i < index; i++) {
        const data = new FormData()
          data.append("file", image[i])
          data.append("upload_preset", "g4hjcqh7")
          data.append("cloud_name", "abdullah7c")
          value = await fetch(`https://api.cloudinary.com/v1_1/abdullah7c/image/upload`, {
              method: "post",
              body: data
          })
              .then(resp => resp.json())
              .then(data => data.url)
              .catch(err => console.log(err));
          console.log(value)
          values = values + value +", "
        }
        return values
    }
    const getAllParts = () => {
        let partz = ""
        state.service.forEach((x)=>{
            partz = partz + x.part
        })
    }

    const createTask = async(e) => {
        e.preventDefault();
        let imagesVal = "";
        setLoad(true)
        await axios.post(process.env.NEXT_PUBLIC_TI_CREATE_TASK,{
            service:service, createdBy:Cookies.get('loginId'), description:description,
            totalPrice:totalPrice, tax:tax, finalPrice:fPrice,images:await uploadImage()
        }).then((x)=>{
            setLoad(false);
            Router.reload("/tasks")
        })
    }

  return (
    <div className='task-styles'>
        {!taskShow &&
        <div className='mx-5'>
            <Row>
                <Col md={2}>
                    <Button onClick={()=>setTaskhow(true)}>Add Task</Button>
                </Col>
            </Row>
            <Row className='mt-4' style={{height:"550px", overflowY:"auto"}}>
                {
                    tasks.map((task, index)=>{
                        return(
                            <Col md={3} key={index}>
                                <div className='card'>
                                    <div className='top'>
                                    <div className='dot'></div>
                                        <h4 className='id'>{task.id.slice(0,4)}</h4>
                                    </div>
                                    <div className='service'><strong>Service: </strong>{task.service}</div>
                                    <div className='service'><strong>Total Price:</strong> {task.totalPrice}</div>
                                </div>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>
        }
        {taskShow &&
            <Row>
                <Col className='mx-5' md={10} style={{maxHeight:'650px', overflowY:'auto', overflowX:"hidden"}}>
                    <h6 className='my-2'>Add New Task</h6>
                    <Form onSubmit={createTask}>
                    <div className='box py-3'>
                        <Row>
                            <Col md={3} className="mx-4">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Number</Form.Label>
                                <Form.Control type="text" placeholder="" value={"Auto Generated"} />
                            </Form.Group>
                            </Col>
                            <Col md={3} className="mx-5">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Service</Form.Label>
                                <Form.Control type="text" placeholder="" value={service} onChange={(e)=>setService(e.target.value)} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mx-4">
                            <Form.Group className="mb-3" >
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} style={{width:'96%'}} value={description}
                                onChange={(e)=>setDescription(e.target.value)} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} className="mx-4">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Make</Form.Label>
                                <Form.Control type="text" placeholder="" value={make} onChange={(e)=>setMake(e.target.value)} />
                            </Form.Group>
                            </Col>
                            <Col md={3} className="mx-5">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Model</Form.Label>
                                <Form.Control type="text" placeholder="" value={model}  />
                            </Form.Group>
                            </Col>
                            <Col md={3} className="mx-5">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Year</Form.Label>
                                <Form.Control type="text" placeholder="" value={year} onChange={(e)=>setYear(e.target.value)}/>
                            </Form.Group>
                            </Col>
                            <Col md={3} className="mx-4">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Regio/Vin</Form.Label>
                                <Form.Control type="text" placeholder="" value={regio} />
                            </Form.Group>
                            </Col>
                            <Col md={3} className="mx-5">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Engine Number</Form.Label>
                                <Form.Control type="text" placeholder="" />
                            </Form.Group>
                            </Col>
                            <Col md={3} className="mx-5">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Mileage</Form.Label>
                                <Form.Control type="text" placeholder="" />
                            </Form.Group>
                            </Col>
                        </Row>
                        {
                        state.service.map((ser, indexMain)=>{
                        return(
                        <div key={indexMain}>
                            <Row className="justify-content-md-center">
                                <Col className="mx-4 my-2" >
                                <Form.Label>Service</Form.Label>
                                <Form.Select required  
                                    style={{
                                        backgroundColor:'white', border:"1px solid silver",
                                        height:'40px', fontSize:'16px', color:'black',
                                        marginRight:'260px', width:'96%'
                                    }}
                                onChange={(e)=>{
                                    let tempState = [...state.service]
                                    //console.log(e.target.value);
                                    services.find((x)=>{                                  // You Need This
                                    if(x.id==e.target.value){                            // Extremely Important
                                    x.Servicecars.find((y)=>{                           // Very Important
                                        if(y.make.toLowerCase()==make.toLowerCase() ){ //&& (y.from<=year && y.to>=year)
                                            tempState[indexMain] = {}
                                            tempState[indexMain] = y;
                                            if(y.parts.length<20){
                                                //tempState[indexMain].partsCost = getPartsPrize(tempState[indexMain].parts)

                                            }else{
                                                tempState[indexMain].parts = y.parts.split(", ");
                                                tempState[indexMain].parts = tempState[indexMain].parts.filter((l)=>{
                                                    if(l!=""){
                                                        return l
                                                    }
                                                })
                                            }
                                            console.log(tempState[indexMain]);
                                        }else{
                                            tempState[indexMain] = {id:"",make:"",model:"",from:"",to:"",partsCost:"",labourCost:"",discount:"",estimate:"",parts:[],createdAt:"",updatedAt:"",ServiceId:""}
                                        }
                                    })
                                    }
                                    })
                                    setState({service:tempState});
                                    console.log(ser.parts)
                                }}
                                    >
                                        {services.map((serv, index)=>{
                                            return(
                                                <option key={index} value={serv.id}>{serv.name}</option>
                                            )
                                        })}
                                        
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className="justify-content-md-center">
                                <Col className="mx-4 my-2" >
                                <Form.Label>Parts</Form.Label><br/>
                                    <div className='part-frame'>
                                        {ser.parts.map((x, index)=>{
                                            return(
                                                <span key={index} >
                                                    {
                                                    <span className="mx-1 part">
                                                        {getPartName(x)}
                                                        <span className='cross' onClick={()=>changePrice(x, indexMain)}>x</span>
                                                    </span>
                                                    }
                                                </span>
                                            )
                                        })}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="cost-area mt-3">
                                <Col md={3} className="">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Parts Cost</Form.Label>
                                    <Form.Control type="text" placeholder="" value={ser.partsCost?ser.partsCost:""} />
                                </Form.Group>
                                </Col>
                                <Col md={3} className="">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Labor Cost</Form.Label>
                                    <Form.Control type="text" placeholder="" value={ser.labourCost?ser.labourCost:""} />
                                </Form.Group>
                                </Col>
                                <Col md={3} className="">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Discount</Form.Label>
                                    <Form.Control type="text" placeholder="" value={ser.discount?ser.discount:""} />
                                </Form.Group>
                                </Col>
                                <Col md={3} className="">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Estimate Price</Form.Label>
                                    <Form.Control type="text" placeholder="" value={ser.estimate?ser.estimate:""} />
                                </Form.Group>
                                </Col>
                                
                            </Row>
                            <Row>
                                <Col md={11} className="mx-4 my-4">
                                    <hr/>
                                    <div className='plus' onClick={()=>{
                                        let tempState = [...state.service];
                                        tempState.push({id:"",make:"",model:"",from:"",to:"",partsCost:"",labourCost:"",discount:"",estimate:"",parts:[],createdAt:"",updatedAt:"",ServiceId:""})
                                        console.log(tempState)
                                        setState({service:tempState})
                                    }}>+</div>
                                </Col>
                            </Row>
                            
                        </div>
                        )})
                        }
                        <Row>
                        <Col>
                            <div style={{width:'92%', marginLeft:"22px"}}>
                            <Select
                            defaultValue={'Country'}
                            isMulti
                            name="colors"
                            options={partList}
                            onChange={(e) => {
                                console.log(e)
                                let partCost = 0.00;
                                parts.forEach((x)=>{
                                    e.forEach((y)=>{
                                        if(y.value == x.id){
                                            console.log(x.cost)
                                            partCost = partCost + parseFloat(x.cost)
                                        }
                                    })
                                })
                                setExtPartPrice(partCost)
                            }}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                            </div>
                        </Col>
                        </Row>
                        <Row className='my-4'>
                            <Col md={8}>
                                <div style={{float:'right', marginTop:'5px'}}>Total Price</div>
                            </Col>
                            <Col md={3} style={{marginLeft:'20px'}}>
                            <Form.Group className="">
                                <Form.Control type="number" placeholder="" value={totalPrice+extPartPrice} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row className='my-4'>
                            <Col md={8}>
                                <div style={{float:'right', marginTop:'5px'}}>Tax</div>
                            </Col>
                            <Col md={3} style={{marginLeft:'20px'}}>
                            <Form.Group className="">
                                <Form.Control type="text" placeholder="" value={tax} onChange={(e)=>{setTax(e.target.value);}} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row className='my-4'>
                            <Col md={8}>
                                <div style={{float:'right', marginTop:'5px'}}>Final Price</div>
                            </Col>
                            <Col md={3} style={{marginLeft:'20px'}}>
                            <Form.Group className="">
                                <Form.Control type="number" placeholder="" value={fPrice} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row className='justify-content-md-center'>
                        <Col md={12}>
                            <div className='img-upload'>
                            <input type="file" required multiple onChange={(e) => {setImage(e.target.files); console.log(e.target.files)}} />
                            <img src='assets/images/upload.png' className='img-upload-icon' />
                            </div>
                        </Col>
                        </Row>
                        </div>
                        <Button className='mt-3 px-5' style={{float:'right'}} variant="primary" type="submit">
                        {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:"Add Task"}
                        </Button>
                        </Form>
                </Col>
            </Row>
        }
    </div>
  )
}

export default TaskLayout