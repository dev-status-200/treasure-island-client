import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Spinner, Button, Form, OverlayTrigger, Tooltip, Table, Dropdown, Modal } from 'react-bootstrap';
import { useSetState } from 'react-use';
import { FileUploader } from "react-drag-drop-files";
import Select from 'react-select';
import Cookies from 'js-cookie'
import axios from 'axios'
import Router, { useRouter } from 'next/router';
import moment from 'moment'
import { BsWrench, BsSpeedometer, BsThreeDots } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AiFillCar, AiFillFileImage, AiFillEye ,AiOutlineSearch, AiFillEyeInvisible } from "react-icons/ai";
import { GiMechanicGarage } from "react-icons/gi";

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
    const [engineNo, setEngineNo] = useState("");
    const [mileage, setMileage] = useState("");
    const [carId, setCarId] = useState("");
    const [customerId, setCustomerId] = useState("");

    const [selectedCreatedServices, setSelectedCreatedServices] = useState([]);
    const [selectedParts, setSelectedParts] = useState('');
    const [selectedExtraParts, setSelectedExtraParts] = useState('');

    const [makeComment, setMakeComment] = useState('');
    const [taskId, setTaskId] = useState('');
    const [commentLoad, setCommentLoad] = useState(false);
    const [commentList, setCommentList] = useState([]);
    const [newImg, setNewImg] = useState();
    const [newImgUrl, setNewImgUrl] = useState('');

    const [load, setLoad] = useState(false)
    const [serviceload, setServiceLoad] = useState(false);
    
    const [dropDown, setDropDown] = useState(false);
    const [edit, setEdit] = useState(false);
    const [editLoad, setEditLoad] = useState(false);

    const [show, setShow] = useState(false);
    const [completeShow, setCompleteShow] = useState(false);
    const [completeLoad, setCompleteLoad] = useState(false);

    const [suggestion, setSuggestion] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCompleteClose = () => setCompleteShow(false);
    const handleCompleteShow = () => setCompleteShow(true);

    const [state, setState] = useSetState({
        service:[{
            id:"",make:"",model:"",from:"",to:"",partsCost:"",labourCost:"",discount:"",estimate:"",parts:[],createdAt:"",updatedAt:"",ServiceId:""
        }],
        selectedService:{
            serviceName:"", date:"", employees:[], customer:{id:"", name:''}, status:'', description:'', parts:[], extraParts:[], services:[],
            make:"", model:'', eng:'', mileage:'', images:[], createdAt:'', regio:'', carId:'', price:''
        }
    });
    
    useEffect(() => {
        console.log(services)
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
                console.log(x.estimate)
            }
        })
        Price = Price
        setTotalPrice(Price)
        setFPrice(Price + parseFloat(tax) + parseFloat(extPartPrice.toFixed(2)))
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
        let tempService = '';
        for(let i = 0; i<selectedCreatedServices.length;i++){
            if(i==selectedCreatedServices.length-1){
                tempService = tempService + selectedCreatedServices[i]
            }else{
                tempService = tempService + selectedCreatedServices[i]+', '
            }
        }
        console.log(tempService);
        console.log(selectedExtraParts);
        await axios.post(process.env.NEXT_PUBLIC_TI_CREATE_TASK,{
            service:service, createdBy:Cookies.get('loginId'), description:description, createdService:tempService,
            totalPrice:totalPrice, tax:tax, finalPrice:fPrice,images:await uploadImage(), extraParts:selectedExtraParts,
            engine_no:engineNo, mileage:mileage, carId:carId, customerId:customerId, employeeList:selectedEmployeeList
        }).then((x)=>{
            setLoad(false);
            Router.reload("/tasks");
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
        axios.get(process.env.NEXT_PUBLIC_TI_GET_TASK_BY_ID,{
            headers:{
                "id":`${id}`
            }
        }).then((x)=>{
            console.log(x.data)
            let dataSet = state.selectedService;
            setTaskId(x.data[0].id)
            dataSet.carId = x.data[0].Taskassociations[0].CarId
            dataSet.model = x.data[0].Taskassociations[0].Car.model
            dataSet.make = x.data[0].Taskassociations[0].Car.make
            dataSet.regio = x.data[0].Taskassociations[0].Car.regio
            dataSet.mileage = x.data[0].mileage
            dataSet.eng = x.data[0].engine_no
            dataSet.price = x.data[0].finalPrice
            dataSet.service = x.data[0].service
            let imagesTemp = x.data[0].images.split(', ');
            if(imagesTemp[imagesTemp.length-1]==''){
                for (let indeTwo = 0; indeTwo < imagesTemp.length-1; indeTwo++) {
                    dataSet.images.push(imagesTemp[indeTwo]);
                }
            }else{
                for (let indeTwo = 0; indeTwo < imagesTemp.length; indeTwo++) {
                    dataSet.images.push(imagesTemp[indeTwo]);
                }
            }
            let tempCreatedService = x.data[0].createdService.split(', ')
            
            let partsList = []
            services.forEach((x)=>{
                tempCreatedService.find((y)=>{
                    if(x.id==y){
                        
                        dataSet.services.push({name:x.name})
                        x.Servicecars.forEach((z)=>{
                            if(z.make.toLowerCase()==dataSet.make.toLowerCase() && z.model.toLowerCase()==dataSet.model.toLowerCase()){
                                let tempParts = z.parts.split(', ')
                                tempParts.forEach((part)=>{
                                    partsList.push({id:part});
                                })
                            }
                        })
                    }
                })
            })
            dataSet.parts = partsList
            let tempCreatedExtraParts = x.data[0].extraParts.split(', ')
            tempCreatedExtraParts.forEach((x)=>{
                dataSet.extraParts.push({name:x})
            })
            dataSet.status = x.data[0].status
            dataSet.customer = {id:x.data[0].Taskassociations[0].Customer.id, name:`${x.data[0].Taskassociations[0].Customer.f_name} ${x.data[0].Taskassociations[0].Customer.l_name}`}
            dataSet.createdAt = moment(x.data[0].createdAt).fromNow()
            x.data[0].Taskassociations.forEach((x, index)=>{
                dataSet.employees.push({id:x.User.id, name:`${x.User.l_name} ${x.User.f_name}`, picture:x.User.profile_pic})
            })

            dataSet.description = x.data[0].description
            setState({selectedService:dataSet});
            setServiceLoad(true);
            console.log('serviceLoad set to true!')
            axios.get(process.env.NEXT_PUBLIC_TI_GET_TASK_COMMENT,{
                headers:{
                    "userId":`${x.data[0].id}`
                }
            }).then((y)=>{
                setCommentList(y.data)
            })
            console.log(dataSet)
        });
    }
    const submitComment = () => {
        setCommentLoad(true);
        axios.post(process.env.NEXT_PUBLIC_TI_MAKE_TASK_COMMENT,{
            comment:makeComment, taskId:taskId, userId:Cookies.get('loginId')
        }).then((x)=>{
            console.log(x.data)
            setCommentList(x.data);
            setMakeComment("")
            setCommentLoad(false);
        })
    }
    async function reUploadImage(){
        let value = '';
            if(newImg!=""){
                const data = new FormData()
                data.append("file", newImg)
                data.append("upload_preset", "g4hjcqh7")
                data.append("cloud_name", "abdullah7c")
                value = await fetch(`https://api.cloudinary.com/v1_1/abdullah7c/image/upload`, {
                    method: "post",
                    body: data
                })
                    .then(resp => resp.json())
                    .then(data => data.url)
                    .catch(err => console.log(err));

                setNewImgUrl(value);
                console.log(value)
                let tempState = state.selectedService
                tempState.images.push(value);
                console.log(tempState);
                
                let tempImageList = ''
                tempState.images.forEach((x)=>{
                    tempImageList = tempImageList + x + ", "
                })
                await axios.post(process.env.NEXT_PUBLIC_TI_REUPLOAD_TASK_IMAGE,{
                    images:tempImageList, id:taskId
                }).then(()=>{
                    setState({selectedService:tempState})
                })
            }
            console.log('function End')
    }
    const taskComplete = async() => {
        setCompleteLoad(true);
        await axios.post(process.env.NEXT_PUBLIC_TI_GENERATE_INVOICE,{
            taskId:taskId, customer_name:state.selectedService.customer.name, price:state.selectedService.price, suggestion:suggestion
        })
        await axios.post(process.env.NEXT_PUBLIC_TI_TASK_COMPLETE,{ 
            id:taskId, action:'complete'
        }).then(()=>{
            let tempState = [...taskList];
            let tempStateTwo = state.selectedService
            tempStateTwo.status = 'complete';
            setState({selectedService:tempStateTwo});
            Router.push('/invoices')
        })
    }
    const getImage = (id) => {
        let img = ''
            employees.forEach((y)=>{
                if(id==y.id){
                    img = y.profile_pic
                }
            })
        return img
    }
    const getPartsName = (id) => {
        let name = ''
            parts.forEach((y)=>{
                if(id==y.id){
                    name = y.part_number+" "+y.part_name + " " + y.cost
                }
            })
        return name
    }
    const getName = (id) => {
        let name = ''
            employees.forEach((y)=>{
                if(id==y.id){
                    name = y.f_name + " " + y.l_name
                }
            })
        return name
    }
    const fetchTaskDetailsEdit = (id) => {
        axios.get(process.env.NEXT_PUBLIC_TI_GET_TASK_BY_ID,{
            headers:{
                "id":`${id}`
            }
        }).then((x)=>{
            console.log(x.data[0]);
            console.log(x.data[0].Taskassociations[0].CustomerId);
            setCustomerId(x.data[0].Taskassociations[0].CustomerId);
            setCarId(x.data[0].Taskassociations[0].CarId);
            setDescription(x.data[0].description);
            setService(x.data[0].service);
            setCarMake(x.data[0].Taskassociations[0].Car.make);
            setModel(x.data[0].Taskassociations[0].Car.model);
            setYear(x.data[0].Taskassociations[0].Car.year);
            setRegio(x.data[0].Taskassociations[0].Car.regio);
            setMileage(x.data[0].mileage);
            setEngineNo(x.data[0].engine_no);
            setPhone(x.data[0].Taskassociations[0].Customer.phone);
        })
    }
    const updateTask = async(e) => {
        e.preventDefault();
        setLoad(true)
        let tempService = '';
        for(let i = 0; i<selectedCreatedServices.length;i++){
            if(i==selectedCreatedServices.length-1){
                tempService = tempService + selectedCreatedServices[i]
            }else{
                tempService = tempService + selectedCreatedServices[i]+', '
            }
        }
        console.log(tempService);
        console.log(selectedExtraParts);
        console.log(selectedEmployeeList);
        //NEXT_PUBLIC_TI_EDIT_TASK
        await axios.post(process.env.NEXT_PUBLIC_TI_EDIT_TASK,{
            taskId:taskId,createdService:tempService, totalPrice:totalPrice, tax:tax, finalPrice:fPrice, extraParts:selectedExtraParts,
            engine_no:engineNo, mileage:mileage, carId:carId, customerId:customerId, employeeList:selectedEmployeeList
        }).then((x)=>{
            setLoad(false);
            Router.reload("/tasks");
        })
    }
    const taskDelete = () => {
        setLoad(true);
        console.log(taskId);
        axios.post(process.env.NEXT_PUBLIC_TI_DELETE_TASK,{taskId:taskId}).then((x)=>Router.reload("/tasks"))
    }
    const getServiceNames = (list) => {
        let names = ''
        list.forEach((x, indexz)=>{
            if(list.length>(indexz+1)){
                names = names + x.name + ', '
            }else{
                names = names + x.name
            }
        })
        return names
    }
    const getServiceNamesTwo = (list) => {
        let names = ''
        let tempList = list.split(', ')
        tempList.forEach((x, indexz)=>{
            services.forEach((y)=>{
                if(y.id==x){
                    if(tempList.length>(indexz+1)){
                        names = names + y.name + ', '
                    }else{
                        names = names + y.name
                    }
                }
                
            })
            
        })
        return names
    }
    const getServiceNamesThree = (list) => {
        let names = ''
        console.log(list)
        //list.forEach((x, indexz)=>{
            services.forEach((y)=>{
                if(y.id==list){
                    names = y.name
                }
                
            })
            
        //})
        return names
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
                                    <div className={task.status=="active"?'dot-inprogress':task.status=="On Hold"?"dot-hold":"dot-completed"}></div>
                                        <h4 className='id'>{task.Taskassociations[0].Car.regio}</h4>
                                        <p className='id-name'>{task.Taskassociations[0].Car.make} {task.Taskassociations[0].Car.model} {task.Taskassociations[0].Car.year}</p>
                                    </div>
                                    <div className=''>
                                    <div style={{minHeight:'70px', maxHeight:'70px', paddingTop:'5px'}}>
                                    {
                                    task.createdService.split(', ').map((serv, indexA)=>{
                                        return(
                                        <div key={indexA+'a'}>
                                            <span className='service-left'>Service: </span>
                                            <div className='service-right'>{getServiceNamesThree(serv)}</div>
                                        </div>
                                        )
                                    })
                                    }
                                    </div>
                                        <div className='line'></div>
                                        <div>
                                            <span className='service-left-two'>Cost: </span>
                                            <span className='service-right-two'>$ {parseFloat(task.finalPrice).toFixed(2)}</span>
                                        </div>
                                        </div>
                                        <div className='text-center'>
                                        <Button className='mt-4 px-5 shadow ' onClick={()=>fetchTaskDetails(task.id)}>See Details</Button>
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
                {!edit && 
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
                                <Form.Control type="text" placeholder="" value={engineNo} onChange={(e)=>setEngineNo(e.target.value)} />
                            </Form.Group>
                            </Col>
                            <Col md={3} className="mx-5">
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Mileage</Form.Label>
                                <Form.Control type="text" placeholder="" value={mileage} onChange={(e)=>setMileage(e.target.value)} />
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
                                    let serviceTemp = [...selectedCreatedServices]
                                    serviceTemp[indexMain] = e.target.value
                                    setSelectedCreatedServices(serviceTemp)
                                    let tempState = [...state.service];
                                    services.find((x)=>{
                                    if(x.id==e.target.value){
                                    let found = false
                                    x.Servicecars.find((y)=>{
                                        if(y.make.toLowerCase()==carMake.toLowerCase() && y.model.toLowerCase()==model.toLowerCase() ){ //&& (y.from<=year && y.to>=year)
                                            //console.log('Match Found');
                                            found = true
                                            //console.log(y)
                                            tempState[indexMain] = y;
                                            //console.log(tempState[indexMain])
                                            if(y.parts.length<20){
                                            }else{
                                                tempState[indexMain].parts = y.parts.split(", ");
                                                tempState[indexMain].parts = tempState[indexMain].parts.filter((l)=>{
                                                    if(l!=""){
                                                        return l
                                                    }
                                                })
                                            }
                                            //console.log(tempState[indexMain]);
                                        }else if(found==false){
                                            tempState[indexMain] = {id:"",make:"",model:"",from:"",to:"",partsCost:"",labourCost:"",discount:"",estimate:"",parts:[],createdAt:"",updatedAt:"",ServiceId:""}
                                            //console.log('removal')
                                        }
                                    })
                                    }
                                    })
                                    setState({service:tempState});
                                    //console.log(tempState)
                                }}
                                    >
                                    <option disabled selected>Select Service</option>
                                    {services.map((serv, index)=>{
                                        return(
                                            <option key={index} value={serv.id} valueTwo={serv.name}>{serv.name}</option>
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
                                    <Form.Control type="text" placeholder="" value={ser.partsCost} />
                                </Form.Group>
                                </Col>
                                <Col md={3} className="">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Labor Cost</Form.Label>
                                    <Form.Control type="text" placeholder="" value={ser.labourCost} />
                                </Form.Group>
                                </Col>
                                <Col md={3} className="">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Discount</Form.Label>
                                    <Form.Control type="text" placeholder="" value={ser.discount?ser.discount:0.00} />
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
                                        let serviceTemp = [...selectedCreatedServices]
                                        serviceTemp.push("");
                                        setSelectedCreatedServices(serviceTemp);
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
                                console.log(e);
                                let tempState = '';
                                e.forEach((x, index)=>{
                                    if(index==0){
                                        tempState = x.label
                                    }else{
                                        tempState = tempState + ', '+x.label
                                    }
                                })
                                setSelectedExtraParts(tempState)
                                let partCost = 0.00;
                                parts.forEach((x)=>{
                                    e.forEach((y)=>{
                                        if(y.value == x.id){
                                            console.log(x.cost)
                                            partCost = partCost + x.cost
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
                                <Form.Control type="number" placeholder="" value={`${totalPrice+extPartPrice}`} />
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
                }
                {edit &&
                    <Col className='mx-5' md={10} style={{maxHeight:'650px', overflowY:'auto', overflowX:"hidden"}}>
                    <Button className='px-4 mb-3' size="sm" 
                        onClick={()=>{
                            setEdit(false); setTaskView(false); setTaskhow(false);
                            setServiceLoad(false);
                            setState({
                                selectedService:{
                                    serviceName:"", date:"", employees:[], customer:{id:"", name:''}, status:'', description:'', parts:[], extraParts:[], services:[],
                                    make:"", model:'', eng:'', mileage:'', images:[], createdAt:''
                                }
                            })
                        }}
                    >Back</Button>
                    <Form onSubmit={updateTask}>
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
                                    let serviceTemp = [...selectedCreatedServices]
                                    serviceTemp[indexMain] = e.target.value
                                    setSelectedCreatedServices(serviceTemp)
                                    //console.log(e.target.name)
                                    let tempState = [...state.service];
                                    services.find((x)=>{
                                    if(x.id==e.target.value){
                                    let found = false
                                    x.Servicecars.find((y)=>{
                                        if(y.make.toLowerCase()==carMake.toLowerCase() ){ //&& (y.from<=year && y.to>=year)
                                            //console.log('Match Found');
                                            found = true
                                            //console.log(y)
                                            tempState[indexMain] = y;
                                            //console.log(tempState[indexMain])
                                            if(y.parts.length<20){
                                            }else{
                                                tempState[indexMain].parts = y.parts.split(", ");
                                                tempState[indexMain].parts = tempState[indexMain].parts.filter((l)=>{
                                                    if(l!=""){
                                                        return l
                                                    }
                                                })
                                            }
                                            //console.log(tempState[indexMain]);
                                        }else if(found==false){
                                            tempState[indexMain] = {id:"",make:"",model:"",from:"",to:"",partsCost:"",labourCost:"",discount:"",estimate:"",parts:[],createdAt:"",updatedAt:"",ServiceId:""}
                                            //console.log('removal')
                                        }
                                    })
                                    }
                                    })
                                    setState({service:tempState});
                                    //console.log(tempState)
                                }}
                                    >
                                    <option disabled selected>Select Service</option>
                                    {services.map((serv, index)=>{
                                        return(
                                            <option key={index} value={serv.id} valueTwo={serv.name}>{serv.name}</option>
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
                                        let serviceTemp = [...selectedCreatedServices]
                                        serviceTemp.push("");
                                        setSelectedCreatedServices(serviceTemp);
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
                                console.log(e);
                                let tempState = '';
                                e.forEach((x, index)=>{
                                    if(index==0){
                                        tempState = x.label
                                    }else{
                                        tempState = tempState + ', '+x.label
                                    }
                                })
                                setSelectedExtraParts(tempState)
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
                                <Form.Control type="number" placeholder="" value={(totalPrice+extPartPrice)} />
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
                        {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:"Update"}
                        </Button>
                        <Row className='my-5 py-5'></Row>
                        </Form>
                    </Col>
                }
            </Row>
        }
        {taskView &&
            <div className='mx-5' style={{maxHeight:'600px', overflowY:'auto', overflowX:'hidden'}}>
                { serviceload &&
                <div>
                <Row>
                    <Col md={2}><Button onClick={()=>{
                        setServiceLoad(false);
                        console.log('serviceLoad set to false!')
                        setTaskView(false);
                        setState({
                            selectedService:{
                                serviceName:"", date:"", employees:[], customer:{id:"", name:''}, status:'', description:'',
                                parts:[], extraParts:[], services:[], make:"", model:'', eng:'', mileage:'', images:[], createdAt:''
                            }
                        })
                    }} className="px-4 mx-2" size="sm">Back</Button>
                    </Col>
                </Row>
                <Row style={{fontSize:'14px'}}>
                <Col md={7} >
                <div className="box mx-2 mt-3 p-4">
                    <Row>
                        <Col>
                        <input type="checkbox" checked={state.selectedService.status=='complete'?true:false} onChange={()=>handleCompleteShow()}/>
                        <span style={{fontSize:'14px', marginLeft:'4px', color:'grey'}}>
                            {state.selectedService.status=='complete'?"Mark As Uncomplete":"Mark As Completed"}
                        </span>
                        </Col>
                        <Col>
                        <div style={{float:'right',cursor:'pointer'}} onMouseEnter={()=>setDropDown(true)} onMouseLeave={()=>setDropDown(false)}>
                            <BsThreeDots  />
                            <Dropdown.Menu show={dropDown}>
                                <Dropdown.Item eventKey="1" 
                                onClick={()=>{
                                    console.log(taskId);
                                    fetchTaskDetailsEdit(taskId);
                                    setTaskView(false);
                                    setTaskhow(true);
                                    setEdit(true);
                                    setDropDown(false);
                                }}>Edit</Dropdown.Item>
                                <Dropdown.Item eventKey="2" onClick={()=>handleShow(true)}>Delete</Dropdown.Item>
                                <Dropdown.Item eventKey="3" onClick={()=>{
                                    axios.post(process.env.NEXT_PUBLIC_TI_TASK_COMPLETE,{ 
                                        id:taskId, action:state.selectedService.status=='active'?'On Hold':'active'
                                    }).then(()=>{
                                        let tempState = [...taskList];
                                        let tempStateTwo = state.selectedService
                                        tempStateTwo.status = state.selectedService.status=='active'?'On Hold':'active';
                                        setState({selectedService:tempStateTwo});
                            
                                        tempState.forEach((x)=>{
                                            if(x.id==taskId){
                                                x.status = state.selectedService.status=='active'?'On Hold':'active'
                                            }
                                        })
                                        console.log(tempState);
                                        setTaskList(tempState);
                                    })
                                }}>{state.selectedService.status=='active'?'On Hold':'In Progress'}</Dropdown.Item>
                            </Dropdown.Menu>
                        </div>
                        </Col>
                    </Row>
                    <Row className='mt-3'>
                    <h5>
                    {getServiceNames(state.selectedService.services)}
                    </h5>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-3">
                            <div style={{color:'grey',fontSize:'14px'}}>Assigned To</div>
                            <Row>
                                <Col>
                                    {state.selectedService.employees.map((emp, index)=>{
                                        return(
                                            <span key={emp.id}>
                                                <span>
                                                    <img src={emp.picture} height={25} width={25} style={{borderRadius:"50%", marginRight:'3px'}} />
                                                </span>
                                                <span style={{position:'relative', top:'2px', left:'2px'}}>
                                                    {emp.name}{index==(state.selectedService.employees.length-1)?'':', '+" "}
                                                </span>
                                                {index%2!=0 && <br/>}
                                            </span>)
                                    })}
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6} className="mt-2">
                            <div style={{color:'grey',fontSize:'14px'}}>Date</div>
                            <div>{state.selectedService.createdAt}</div>
                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        <Col md={6} className="mt-2">
                            <div style={{color:'grey',fontSize:'14px'}}>Customer</div>
                            <div>
                            <span>
                                <img src={'https://res.cloudinary.com/abdullah7c/image/upload/v1643040095/images_djois2.png'} height={22} style={{borderRadius:"50%", marginRight:'3px'}} />
                            </span>
                            <span style={{position:'relative', top:'2px', left:'2px'}}>
                            {state.selectedService.customer.name}
                            </span> 
                            </div>
                        </Col>
                        <Col md={6} className="mt-2">
                            <div style={{color:'grey',fontSize:'14px'}}>Status</div>
                            <div>  {state.selectedService.status}</div>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <div style={{color:'grey',fontSize:'14px'}}>Overview</div>
                        <div>
                            {state.selectedService.description}
                        </div>
                    </Row>
                    <Row className='mt-4'>
                        <Col md={6}>
                            <BsWrench className='mx-2' style={{color:'blue'}} />
                                <span>{getServiceNames(state.selectedService.services)}</span>
                        </Col>
                        <Col md={6}>
                            <div>
                            <FiSettings className='mx-2' style={{color:'blue'}} />
                            <span>
                            <OverlayTrigger
                                placement={'bottom'}
                                overlay={
                                <Tooltip id={`tooltip-`} >
                                    {
                                        state.selectedService.parts.map((exParts, index)=>{
                                            return(<div key={index} style={{fontSize:'13px'}}>{getPartsName(exParts.id)}</div>)
                                        })
                                    }
                                </Tooltip>
                                }
                            >
                            <span variant="secondary" style={{cursor:'pointer'}}>Parts</span>
                            </OverlayTrigger>
                            </span>
                            </div>
                        </Col>
                        <Col md={6} className="mt-3">
                            {state.selectedService.extraParts[0].name!=''&&
                            <div>
                            <FiSettings className='mx-2' style={{color:'blue'}} />
                            <span>
                            <OverlayTrigger
                                placement={'bottom'}
                                overlay={
                                <Tooltip id={`tooltip-`} >
                                    {
                                        state.selectedService.extraParts.map((exParts, index)=>{
                                            return(<div key={index} style={{fontSize:'13px'}}>{exParts.name}</div>)
                                        })
                                    }
                                </Tooltip>
                                }
                            >
                            <span variant="secondary" style={{cursor:'pointer'}}>Extra Parts</span>
                            </OverlayTrigger>
                            </span>
                            </div>}
                        </Col>
                    </Row>
                </div>
                <div className="box mx-2 mt-3 p-4">
                    <Row>
                        <p><strong>{state.selectedService.regio}</strong></p>
                        <Col md={4} className="mt-3"><AiFillCar style={{color:'blue'}} /> <span className='mx-2'>{state.selectedService.make} {state.selectedService.model}</span></Col>
                        <Col md={4} className="mt-3"><GiMechanicGarage style={{color:'blue'}} /> <span className='mx-2'>{state.selectedService.eng}</span></Col>
                        <Col md={4} className="mt-3"><BsSpeedometer style={{color:'blue'}} /> <span className='mx-2'>{state.selectedService.mileage} </span></Col>
                    </Row>
                    <Row className='my-2'></Row>
                </div>
                </Col>
                <Col md={3} className="box mx-2 mt-3 p-3">
                        <div>Attachements</div>
                        <div>
                            <div className='img-upload-two'>
                            <input type="file" onChange={(e) => setNewImg(e.target.files[0])} ></input>
                                <button className='upload-two-btn' onClick={()=>reUploadImage()}>Upload</button>
                            </div>
                        </div>
                        {
                            state.selectedService.images.map((img, index)=>{
                                return(
                                    <div key={index+'abc'} style={{
                                        border:"1px solid silver",
                                        padding:"20px 0px 20px 20px",
                                        marginTop:"5px"
                                    }}>
                                        <span>
                                            <AiFillFileImage style={{color:'blueviolet'}}/>
                                        </span>
                                        <span style={{color:'grey', fontSize:'12px', marginLeft:'10px', cursor:'pointer'}} onClick={()=>{window.open(img, '_blank').focus();}}>Click To Download File</span>
                                    </div>
                                )
                            })
                        }
                        
                </Col>
                </Row>
                <Row>
                <Col md={11} style={{width:'86%'}}>
                    <div className="box mx-2 mt-3 p-4">
                        <h5>Recent Orders</h5>
                        <div>
                        <Table responsive="sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Service</th>
                            <th>Mileage</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                            taskList.filter((x)=>{
                                return x.id!=taskId
                            }).map((task, index)=>{
                            return(
                            <tr key={index} style={{fontSize:'14px', color:'grey'}} >
                                <td>{index+1}</td>
                                <td>{getServiceNamesTwo(task.createdService)}</td>
                                <td>{task.mileage}</td>
                                <td style={{maxWidth:'150px'}}>
                                {
                                    task.Taskassociations.map((employee, indexTwo)=>{
                                        return(
                                            <span key={indexTwo}>
                                            {indexTwo!=0 && <span>{", "}</span>}
                                                <img src={getImage(employee.UserId)} height={22} width={22} style={{borderRadius:'50%'}} />
                                                <span className='mx-1'>{getName(employee.UserId)}</span>
                                            </span>
                                        )
                                    })
                                }
                                </td>
                                <td>{task.status}</td>
                                <td>{task.createdAt.slice(0,10)}</td>
                                <td><AiFillEye className='blue icon-trans' 
                                onClick={()=>{
                                    let tempState=state.selectedService
                                    tempState.employees=[]
                                    tempState.serviceName=""
                                    tempState.date=""
                                    tempState.customer={id:"", name:''}
                                    tempState.status=''
                                    tempState.description=''
                                    tempState.parts=[]
                                    tempState.extraParts=[]
                                    tempState.services=[]
                                    tempState.make=""
                                    tempState.model=""
                                    tempState.eng=''
                                    tempState.mileage=''
                                    tempState.images=[]
                                    tempState.createdAt=''
                                    tempState.regio=''
                                    tempState.carId=''
                                    tempState.price=''
                                    // tempState = {
                                    //     serviceName:"", date:"", employees:[], customer:{id:"", name:''}, status:'', description:'', parts:[], extraParts:[], services:[],
                                    //     make:"", model:'', eng:'', mileage:'', images:[], createdAt:'', regio:'', carId:'', price:''
                                    // }
                                    setState({selectedService:tempState})
                                    
                                    setEdit(false); setTaskView(false); setTaskhow(false);
                                    setServiceLoad(false);
                                    fetchTaskDetails(task.id);
                                }}
                                /></td>
                            </tr>
                            )
                            })
                        }
                        </tbody>
                        </Table>
                        </div>
                    </div>
                </Col>
                </Row>
                <Row>
                    <Col md={7}>
                        <div className="box mx-2 mt-3 p-3">
                            <h5 className='my-2'>Comments</h5>
                            <hr/>
                            <Row>
                            {
                                commentList.map((comment, index)=>{
                                    return(
                                        <Row key={comment.id} className='mt-2'>
                                        <Col md={1}><img src={comment.User.profile_pic} height={32} width={32} className="comment-pic" /></Col>
                                        <Col md={8}>
                                            <div className='comment-name'>{comment.User.f_name} {comment.User.l_name}</div>
                                            <div className='comment-comment'>{comment.comment}</div>
                                        </Col>
                                        <Col className='comment-date'><div style={{float:"right"}}>{moment(comment.createdAt).fromNow()}</div></Col>
                                        </Row>
                                        )
                                })
                            }
                                
                            </Row>
                            <Row className='mt-3'>
                                <Col>
                                <Form.Group className="mb-3" controlId="formBasic">
                                    <Form.Control as="textarea" rows={3} value={makeComment} onChange={(e)=>setMakeComment(e.target.value)} />
                                </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                            <Col md={12}>
                                <button style={{float:'right'}} className='cmt-submit' onClick={submitComment}>
                                    {commentLoad?<Spinner animation="border" style={{height:'20px', width:'20px', marginLeft:'20px', marginRight:'20px'}} />:"Submit"}
                                </button>
                            </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                </div>
                }
                {
                    !serviceload &&
                    <Spinner animation="border" style={{marginLeft:'50%', marginTop:'20%'}} />
                }
            </div>
        }
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are You Sure To Delete This Task?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            cancel
          </Button>
          <Button variant="danger" onClick={()=>{taskDelete()}}>
            {load?<Spinner className='mx-3' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:"confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
        <Modal show={completeShow} onHide={handleCompleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Task Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Mark This Task as Complete?
            <div>
            <Form.Group className="mt-4" controlId="exampleForm.ControlInput1">
                <Form.Control 
                    value={suggestion} onChange={(e)=>setSuggestion(e.target.value)}
                    rows={3} placeholder="Add Recommendations for Client" as="textarea"
                />
            </Form.Group>
            </div>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="success" size="sm" className='' onClick={taskComplete}>
            {completeLoad==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:"Generate Invoice"}
        </Button>
        <Button variant="danger" size="sm" onClick={handleCompleteClose}>
            cancel
        </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default TaskLayout