import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Spinner, Button, Form } from 'react-bootstrap';
import { useSetState } from 'react-use';
import { FileUploader } from "react-drag-drop-files";
import Select from 'react-select';
import Cookies from 'js-cookie'
import axios from 'axios'
import Router, { useRouter } from 'next/router';
import moment from 'moment'

const fileTypes = ["JPEG", "PNG", "GIF", "BMP"];

const TaskLayout = ({services, parts, tasks, employees}) => {

    const router = useRouter();

    const [taskShow, setTaskhow] = useState(false);
    const [taskView, setTaskView] = useState(false);
    const [make    , setMake  ] = useState("");
    const [carMake , setCarMake  ] = useState("");
    const [year    , setYear  ] = useState("");
    const [model    , setModel  ] = useState("");
    const [regio    , setRegio  ] = useState("");
    const [description    , setDescription  ] = useState("");
    const [partList, setPartList] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedEmployeeList, setSelectedEmployeeList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0.00);
    const [tax, setTax] = useState(0.00);
    const [fPrice, setFPrice] = useState(0.00);
    const [image, setImage] = useState("");
    const [service, setService] = useState("");
    const [extPartPrice, setExtPartPrice] = useState(0.00);
    const [phone, setPhone] = useState("");
    const [engineNo, setEngineNo] = useState("")
    const [mileage, setMileage] = useState("")
    const [carId, setCarId] = useState("")
    const [customerId, setCustomerId] = useState("")
    
    const [load, setLoad] = useState(false)

    const [state, setState ] = useSetState({
        service:[{
            id:"",make:"",model:"",from:"",to:"",partsCost:"",labourCost:"",discount:"",estimate:"",parts:[],createdAt:"",updatedAt:"",ServiceId:""
        }],
        selectedService:{
            serviceName:"", date:"", employees:[], customer:{id:"", name:''}, status:'', description:'', parts:[], extraParts:[], services:[],
            make:"", model:'', eng:'', mileage:'', images:[], createdAt:''
        }
    });

    useEffect(() => {
        console.log(tasks)
        setTaskList(tasks)
        let tempState = [];
        let tempStateTwo = [];
        parts.forEach(x => {
            tempState.push({label:`${x.part_number} (${x.brand_name} ${x.part_name}) $ ${x.cost}`, value:x.id})
        });
        setPartList(tempState);
        employees.forEach(x => {
            tempStateTwo.push({label:`${x.f_name} ${x.l_name}`, value:x.id})
        });
        setEmployeeList(tempStateTwo);
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
                tempState[index].partsCost = parseFloat(tempState[index].partsCost) - parseFloat(y.cost)
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
        let allService;
        console.log(selectedEmployeeList)
        await axios.post(process.env.NEXT_PUBLIC_TI_CREATE_TASK,{
            service:service, createdBy:Cookies.get('loginId'), description:description,
            totalPrice:totalPrice, tax:tax, finalPrice:fPrice,images:await uploadImage(),
            engine_no:engineNo, mileage:mileage, carId:carId, customerId:customerId, employeeList:selectedEmployeeList
        }).then((x)=>{
            setLoad(false);
            //Router.reload("/tasks")
        })
    }
    useEffect(() => {
        if(router.query.service){
        const intervalId = setInterval(() => {
                setTaskhow(true);
                setCarMake(router.query.carmake)
                setService(router.query.service)
                setYear(router.query.year)
                setModel(router.query.model)
                setRegio(router.query.regio)
                setDescription(router.query.description)
                setPhone(router.query.phone)
                setCarId(router.query.carId)
                setCustomerId(router.query.customerId)
            }, 1000);
        }
        return () => clearInterval(intervalId)
    }, [])
    const fetchTaskDetails = (id) => {
        setTaskView(true);
        console.log(id);
        axios.get(process.env.NEXT_PUBLIC_TI_GET_TASK_BY_ID,{
            headers:{
                "id":`${id}`
            }
        }).then((x)=>{
            console.log(x.data)
            let dataSet = state.selectedService;
            dataSet.service = x.data[0].service
            dataSet.status = x.data[0].status=="active"?'In Progress':'Completed'
            dataSet.customer = {id:x.data[0].Taskassociations[0].Customer.id, name:`${x.data[0].Taskassociations[0].Customer.f_name} ${x.data[0].Taskassociations[0].Customer.l_name}`}
            dataSet.createdAt = moment(x.data[0].createdAt).fromNow()
            x.data[0].Taskassociations.forEach((x, index)=>{
                dataSet.employees.push({id:x.User.id, name:`${x.User.l_name} ${x.User.f_name}`, picture:x.User.profile_pic})
            })
            dataSet.description = x.data[0].description
            setState({selectedService:dataSet})
            console.log(dataSet)
        });
    }
  return (
    <div className='task-styles'>
        {(!taskShow && !taskView) &&
        <div className='mx-5 '>
            <Row className='mt-1' style={{height:"630px", overflowY:"auto"}}>
                {
                    taskList.map((task, index)=>{
                        return(
                            <Col md={3} className="mx-3 my-3" key={index}>
                                <div className='card'>
                                    <div className='top'>
                                    <div className='dot'></div>
                                        <h4 className='id'>{task.Taskassociations[0].Car.regio}</h4>
                                        <p className='id-name'>{task.Taskassociations[0].Car.make} {task.Taskassociations[0].Car.model} {task.Taskassociations[0].Car.year}</p>
                                    </div>
                                    <div className=''>
                                        <div>
                                            <span className='service-left'>Service: </span>
                                            <span className='service-right'>{task.service}</span>
                                        </div>
                                        <div className='line'></div>
                                        <div>
                                            <span className='service-left-two'>Cost: </span>
                                            <span className='service-right-two'>$ {task.finalPrice}</span>
                                        </div>
                                        <div className='text-center mt-5'>
                                        <Button className='mt-5 px-5 shadow' onClick={()=>fetchTaskDetails(task.id)}>See Details</Button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        )
                    })
                }
            </Row>
        </div>
        }
        {(taskShow && !taskView) &&
            <Row>
                <Col className='mx-5' md={10} style={{maxHeight:'650px', overflowY:'auto', overflowX:"hidden"}}>
                    <h6 className='my-2'>Add New Task</h6>
                    <Form onSubmit={createTask}>
                    <div className='box py-3'>
                        <Row>
                            <Col md={3} className="mx-4">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Number</Form.Label>
                                <Form.Control type="text" placeholder="" value={phone} />
                            </Form.Group>
                            </Col>
                            <Col md={3} className="mx-5">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Service</Form.Label>
                                <Form.Control type="text" placeholder="" value={service} />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mx-4">
                            <Form.Group className="mb-3" >
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} style={{width:'96%'}} value={description}
                                />
                            </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} className="mx-4">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Make</Form.Label>
                                <Form.Control type="text" placeholder="" value={carMake} />
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
                                <Form.Control type="text" placeholder="" value={engineNo} required onChange={(e)=>setEngineNo(e.target.value)} />
                            </Form.Group>
                            </Col>
                            <Col md={3} className="mx-5">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Mileage</Form.Label>
                                <Form.Control type="text" placeholder="" value={mileage} required onChange={(e)=>setMileage(e.target.value)} />
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
                                    let tempState = [...state.service];
                                    services.find((x)=>{
                                    if(x.id==e.target.value){
                                    let found = false
                                    x.Servicecars.find((y)=>{
                                        if(y.make.toLowerCase()==carMake.toLowerCase() ){ //&& (y.from<=year && y.to>=year)
                                            console.log('Match Found');
                                            found = true
                                            console.log(y)
                                            tempState[indexMain] = y;
                                            console.log(tempState[indexMain])
                                            if(y.parts.length<20){
                                            }else{
                                                tempState[indexMain].parts = y.parts.split(", ");
                                                tempState[indexMain].parts = tempState[indexMain].parts.filter((l)=>{
                                                    if(l!=""){
                                                        return l
                                                    }
                                                })
                                            }
                                            console.log(tempState[indexMain]);
                                        }else if(found==false){
                                            tempState[indexMain] = {id:"",make:"",model:"",from:"",to:"",partsCost:"",labourCost:"",discount:"",estimate:"",parts:[],createdAt:"",updatedAt:"",ServiceId:""}
                                            console.log('removal')
                                        }
                                    })
                                    }
                                    })
                                    setState({service:tempState});
                                    console.log(tempState)
                                }}
                                    >
                                    <option disabled selected>Select Service</option>
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
                            Extra Parts
                            <Select
                            defaultValue={''}
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
                            <div className='img-upload' style={{width:'92%', marginLeft:"22px"}}>
                            <input type="file" required multiple onChange={(e) => {setImage(e.target.files); console.log(e.target.files)}} />
                            <img src='assets/images/upload.png' className='img-upload-icon' />
                            </div>
                        </Col>
                        </Row>
                        <Row className='mt-4'>
                        <div style={{width:'92%', marginLeft:"22px"}}>
                            Select Employees
                            <Select
                                defaultValue={''}
                                isMulti
                                name="colors"
                                options={employeeList}
                                onChange={(e)=>{
                                    console.log(e);
                                    setSelectedEmployeeList(e);
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                        </div>
                        </Row>
                        </div>
                        <Button className='mt-3 px-5' style={{float:'right'}} variant="primary" type="submit">
                        {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:"Add Task"}
                        </Button>
                        <Row className='my-5 py-5'></Row>
                        </Form>
                </Col>
            </Row>
        }
        {taskView &&
            <div>
                <Row>
                    <Col md={2}><Button onClick={()=>{
                        setTaskView(false);
                        setState({
                            selectedService:{
                                serviceName:"", date:"", employees:[], customer:{id:"", name:''}, status:'', description:'', parts:[], extraParts:[], services:[],
                                make:"", model:'', eng:'', mileage:'', images:[], createdAt:''
                            }
                        })
                    }} className="px-4" size="sm">Back</Button></Col>
                </Row>
                <Row >
                    <Col md={7} className="box mx-2 mt-3 p-4">
                        <Row>
                            <Col><input type="checkbox"></input> <span style={{fontSize:'14px', color:'grey'}}>Mark As Completed</span></Col>
                        </Row>
                        <Row className='mt-2'>
                            <h4>{state.selectedService.service}</h4>
                        </Row>
                        <Row>
                            <Col md={12} className="mt-2"></Col>
                        </Row>
                    </Col>
                    <Col md={3} className="box mx-2 mt-3"></Col>
                </Row>
            </div>
        }
    </div>
  )
}

export default TaskLayout