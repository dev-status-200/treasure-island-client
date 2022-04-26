import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Modal, Button, Form, Spinner, FormControl } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { AiFillDelete, AiFillEdit, AiFillEye ,AiOutlineSearch, AiFillEyeInvisible } from "react-icons/ai";
import { ImPhone, ImCreditCard } from "react-icons/im";
import { MdMailOutline, MdLocationOn, MdOutlineMode } from "react-icons/md";
import { RiSortDesc } from "react-icons/ri";
import NumberFormat from "react-number-format";
import Router from 'next/router'
import { FaIdCard, FaEnvelope } from "react-icons/fa";

const CustomersLayout = ({customers, serviceRequest}) => {

    const location = useSelector((state) => state.location.value);

    const [show, setShow] = useState(false);
    const [change, setChange] = useState(false);

    const [mailList, setMailList] = useState([]);

    const handleClose = () => { setShow(false); setEdit(false); setChange(false); clearFields(); setMailWarn(false); setPhoneWarn(false);}
    const handleShow = () => { getMail(); setShow(true); setChange(true); }

    const handleEditShow = () => { setEdit(true); setShow(true); }

    const [linkShow, setLinkShow] = useState(false);
    const [link, setLink] = useState("");
    
    const [edit, setEdit] = useState(false);
    const [load, setLoad] = useState(false);
    const [deleteView, setDeleteView] = useState(false);
    const [RequestShow, setRequestShow] = useState(false);

    const [mailWarn, setMailWarn] = useState(false);
    const [phoneWarn, setPhoneWarn] = useState(false);

    const [MechanicList, setMechanicList] = useState([]);

    const [unAppCustomerList, setUnAppCustomerList] = useState([]);

    const [unAppCustomer, setUnAppCustomer] = useState(false);

    const [requests, setRequests] = useState([]);
    const [carList, setCarList] = useState([]);

    useEffect(() => {
        setMechanicList(customers);
        //setRequests(serviceRequest);
    }, [])

    const getMail = async() => {
        let res = await axios.get(process.env.NEXT_PUBLIC_TI_CUSTOMERS_EMAILS).then((x)=>(x.data));
        console.log(res)
        setMailList(res);
    }
    const getMailEdit = async(ids) => {
        let res = await axios.get(process.env.NEXT_PUBLIC_TI_CUSTOMERS_EMAILS_EDIT,{
            headers:{
                "id":`${ids}`
            }
        }).then((x)=>(x.data));
        console.log(res)
        setMailList(res);
    }
    const clearFields = () => {
        setId(""); 
        setF_name("");  
        setL_Name("");
        setEmail("");
        setShop_id(""); 
        setPhone("");
        setAddress("");
    }
    const editFields = (values) => {
        getMailEdit(values.id)
        setId(values.id); setF_name(values.f_name); setL_Name(values.l_name);
         setEmail(values.email);
        setShop_id(values.shop_id); setPhone(values.phone); 
        setAddress(values.address);  handleEditShow()
    }
    const viewMechanic = (values) => {
        setId(values.id); setF_name(values.f_name); setL_Name(values.l_name);
        setPassword(values.password); setEmail(values.email); setSsn(values.ssn);
        setShop_id(values.shop_id); setPhone(values.phone); setGender(values.gender);
        setAddress(values.address); setImage(values.profile_pic); setProfileView(true);
        setCarList(values.Cars);
        let tempState = values.Cars;
        tempState = tempState.filter((x)=>{
            if(x.need_service=="yes"){
                return x
            }
        })
        console.log(tempState);
        setRequests(tempState)
    }
    const [id      , setId        ] = useState('')
    const [f_name  , setF_name    ] = useState('');
    const [l_name  , setL_Name    ] = useState('');
    const [password, setPassword  ] = useState('');
    const [email   , setEmail     ] = useState('');
    const [ssn     , setSsn       ] = useState('');
    const [shop_id , setShop_id   ] = useState('');
    const [phone   , setPhone     ] = useState('');
    const [gender  , setGender    ] = useState('male');
    const [address , setAddress   ] = useState('');
    const [image   , setImage     ] = useState("");

    const [request , setRequest   ] = useState({});

    const [search, setSearch] = useState('');
    const [numSearch, setNumSearch] = useState(false);

    const [profileView, setProfileView] = useState(false)

    const addAgent = async(e) => {
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
            setLoad(true);
            await axios.post(process.env.NEXT_PUBLIC_TI_ADD_CUSTOMERS, {
                f_name:f_name, l_name:l_name, password:password, gender:gender, photo:"https://res.cloudinary.com/abdullah7c/image/upload/v1643040095/images_djois2.png",
                email:email, ssn:ssn, shop_id:location, phone:phone, address:address, loginId:Cookies.get('loginId')
            }).then((x)=>{
                let tempState = [...MechanicList];
                tempState.push(x.data);
                setMechanicList(tempState);
                handleClose();
                setLoad(false);
            })
        }
    }
    const editMechanic = async(e) => {
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
        } else {
            setLoad(true);
            axios.put(process.env.NEXT_PUBLIC_TI_EDIT_CUSTOMERS, {
                id:id,f_name:f_name, l_name:l_name, phone:phone, address:address,
                email:email, shop_id:location, loginId:Cookies.get('loginId')
            }).then((x)=>{
                if(x.data[0]=='1'){
                        let tempState = [...MechanicList];
                        tempState.forEach((z)=>{
                            if (z.id==id) {
                                z.f_name=f_name;
                                z.l_name=l_name;
                                z.email=email;
                                z.shop_id=shop_id;
                                z.phone=phone;
                                z.address=address;
                            }
                        })
                        setMechanicList(tempState);
                        setChange(false);
                }
                setShow(false)
                setLoad(false);
                setMailWarn(false);
                setPhoneWarn(false);
            })
        }


    }
    const deleteUser = () => {
        setLoad(true);
        axios.post(process.env.NEXT_PUBLIC_TI_DELETE_CUSTOMERS,{id:id}).then((x)=>{
            if(x.data[0]=='1'){
                let tempState = [...MechanicList];
                tempState = tempState.filter((z)=>{
                    if(z.id!=id){
                      return x
                    }
                  })
                  setMechanicList(tempState);
                  setDeleteView(false);
                  setLoad(false);
            }
        })
    }
    const createLink = () => {
        axios.post(process.env.NEXT_PUBLIC_TI_CREATE_LINK,
            {id:Cookies.get('loginId')}
            ).then((x)=>{
            console.log(x.data.id);
            setLinkShow(true)
            setLink(`${process.env.NEXT_PUBLIC_TI_URL}/userForm?id=${x.data.id}`)
        })
    }
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState((MechanicList.length/5));
    const [startIndex, setStartIndex] = useState(0)

    const [increment, setIncrement] = useState(false);

    useEffect(() => {
        setTotalPages(MechanicList.length/8);
    }, [MechanicList])
    
    useEffect(() => {
        if(page===1){
            setStartIndex(0);
        }else if(page>1){
            increment==true?setStartIndex(startIndex+8):setStartIndex(startIndex-8)
        }
    }, [page])

    useEffect(() => {
        setPage(1);
    }, [location])

    const approveClient = (cust) => {
        // axios.put(process.env.NEXT_PUBLIC_TI_APPROVE_CUSTOMERS,{id:cust.id}).then((x)=>{
        //     if(x.data[0]=='1'){
        //         //console.log(cust)
        //         let tempState = [...unAppCustomerList];
        //         let tempState2 = [...MechanicList];
        
        //         tempState = tempState.filter((z)=>{
        //             if(z.id==cust.id){
        //                 z.approved="approved";
        //                 tempState2.push(z);
        //             }else if(z.id!=cust.id){
        //                 return z
        //             }
        //           })
        //           console.log(tempState2);
        //           setMechanicList(tempState2);
        //           setUnAppCustomerList(tempState);
        //     }
        // })
    }

  return (
    <div className='customer-styles'>
        {(!profileView && !RequestShow ) &&
        <Container className='profile-view' fluid>
            <Row className=''>
               <Col>
                    <span style={{color:'grey'}}> Customers </span>
                    <span><button className='global-btn mx-2' onClick={createLink}> Create Link</button></span>
               </Col>
               <Col>
               <span>
                    <button className='filter-btn' style={{ float:'right'}} onClick={()=>setNumSearch(!numSearch)}><RiSortDesc/></button>
               </span>
               <span>
               <FormControl 
                    style={{width:'300px', float:'right', backgroundColor:'#f4f6fd', paddingLeft:'35px', border:'none', borderRadius:'0px'}} 
                    type='text' placeholder={numSearch?"Search By Number...":"Search By Name..."} value={search}
                    onChange={(e)=>{setSearch(e.target.value); setPage(1)}}
                />
               </span>
               <span><AiOutlineSearch style={{float:'right',position:'relative', left:'28px', top:'10px',color:'grey'}} /></span>
               </Col>
            </Row>
            <Row className='mt-4'>
            <Col md={12}>
            <div className='box' >
            <div style={{minHeight:'542px'}}>
                <Table responsive >
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Completed Task</th>
                    <th>Active Task</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody >
                {MechanicList.length>0 && MechanicList.filter((y)=>{
                    if(y.shop_id==location){
                        return y
                    }
                }).filter((x)=>{
                    if(search==""){
                        return x
                    }else if(
                        !numSearch?(x.f_name.toLowerCase().includes(search.toLowerCase()) || 
                        x.l_name.toLowerCase().includes(search.toLowerCase()) || 
                        (x.f_name + " " +x.l_name).toLowerCase().includes(search.toLowerCase())):
                        (x.phone.toLowerCase().includes(search.toLowerCase()))
                    ){
                        return x
                    }
                }).slice(startIndex, startIndex+8).map((mech, index)=>{
                return(<tr key={index} className=''>
                    <td>
                    <Row>
                        <Col md={2}>
                            <img src={mech.profile_pic} className="image"/>
                        </Col>
                        <Col md={10}>
                            <div className='name pt-2'>{mech.f_name} {mech.l_name}</div>
                            <div style={{display:'inline-block'}} className='email'>{mech.email}</div>
                        </Col>
                    </Row>
                    </td>
                    <td className='phone py-3'>{mech.phone}</td>
                    <td className='phone py-3 px-5'>0</td>
                    <td className='phone py-3 px-5'>0</td>
                    <td className='phone py-3'>
                        <AiFillEye className='blue icon-trans' onClick={()=>viewMechanic(mech)} />
                        <AiFillEdit className='yellow icon-trans' onClick={()=>{editFields(mech);}} />
                        <AiFillDelete className='red icon-trans' onClick={()=>{setId(mech.id); setDeleteView(true)}}/>
                    </td>
                    </tr>
                )})}
                </tbody>
                </Table>
            </div>
            <div>
            <span>
                <button className='paginate-btn' 
                    onClick={()=>{
                        if(page>1){
                            setIncrement(false);
                            setPage(page-1);
                        }
                    }}
                >{"<"} PREV</button>
            </span>
            <span> | {page}  | </span>
            <span><button className='paginate-btn' onClick={()=>{
                setIncrement(false);
                if(page<totalPages){
                    setIncrement(true);
                    setPage(page+1);
                }
            }}> NEXT {">"}</button> </span>
            </div>
            </div>
            </Col>
            </Row>
        </Container>}
        {(profileView && !RequestShow) &&
            <div className='profile-view  pt-1'>
                <Row>
                    <Col md={1}>
                    </Col>
                    <Col md={8}>
                        <div className='detail-bar'>
                            <Row>
                                <Col md={4} className="text-center">
                                    <h5 className='my-2'> <b>{f_name} {l_name}</b> </h5>
                                    <button  className='btn btn-light btn-sm mt-2 px-3' onClick={handleEditShow}>
                                        <MdOutlineMode className='' style={{fontSize:'15px', color:'blue'}} /> Edit Profile
                                    </button>
                                </Col>
                                <Col md={4} className="">
                                    <div className='my-2'> <ImPhone className='mx-3 mb-1' /> {phone} </div>
                                    <div className='border-btm' style={{width:"65%", marginLeft:'5%'}}></div>
                                    <div className='my-2'> <FaIdCard className='mx-3' /> {"Not Registered"} </div>
                                </Col>
                                <Col md={4} className="">
                                    <div className='my-2'> <FaEnvelope className='mx-3' /> {email=='-'?'Not Registered':email=='none'?'Not Registered':email} </div>
                                    <div className='border-btm' style={{width:"65%", marginLeft:'5%'}}></div>
                                    <div className='my-2'> <MdLocationOn className='mx-3' /> {address} </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                <Col md={2}>
                    <div className='back-btn-cust' onClick={()=>{setProfileView(false); handleClose();}}><b className=''>{"<"} Customers</b> </div>
                </Col>
                <Col >
                    <div className='back-btn-cust-two' 
                        onClick={()=>{
                            setRequestShow(true);
                            let list = {};
                            list = carList.filter((x, index)=>{
                                return x.need_service=="yes"
                            })
                            console.log(list);
                            setRequest(list);
                        }}
                        ><b className=''>Upcoming Requests</b> </div>
                </Col>
                </Row>
                <Row>
                <Col className='small-table-frame'>
                <div className='box'>
                <h6 className='my-2'><strong>Cars</strong></h6>
                <Table responsive="sm" style={{fontSize:'14px'}}>
                <thead>
                  <tr>
                    <th>Region</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Engine No.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                {
                    carList.map((car, index)=>{
                        return(
                            <tr key={index}>
                                <td>{car.regio}</td>
                                <td>{car.make}</td>
                                <td>{car.model}</td>
                                <td>{car.year}</td>
                                <td>none</td>
                                <td className='phone'>
                                    <AiFillEdit className='yellow icon-trans'  />
                                    <AiFillDelete className='red icon-trans' />
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
              </Table>
                </div>
                </Col>
                </Row>
            </div>
        }
        {
            (RequestShow) &&
            <div>
            <Row>
                <Col md={2}>
                    <div className='btn btn-primary mx-5 my-3 px-4' onClick={()=>setRequestShow(false)}><b className=''>back</b></div>
                </Col>
            </Row>
            <Row>
                <Col>
                <div className='box mx-5 p-5' style={{width:'80%'}}>
                    <Row>
                        <Col md={3}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Make</Form.Label>
                            <Form.Control type="text" value={request[0].make} />
                        </Form.Group>
                        </Col>
                        <Col md={3}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Model</Form.Label>
                            <Form.Control type="text" value={request[0].model} />
                        </Form.Group>
                        </Col>
                        <Col md={3}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="text" value={request[0].year} />
                        </Form.Group>
                        </Col>
                        <Col md={3}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Region</Form.Label>
                            <Form.Control type="text" value={request[0].regio} />
                        </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Service</Form.Label>
                            <Form.Control type="email" value={request[0].service} />
                        </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={5}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={request[0].description} />
                        </Form.Group>
                        </Col>
                    </Row>
                    <Row >
                        <Col >
                            <button className='btn btn-primary mx-4 px-5'
                                onClick={()=>{
                                    Router.replace({pathname:"/tasks",
                                    query:{
                                        make:request[0].make,model:request[0].model, year:request[0].year,
                                        regio:request[0].regio, service:request[0].service, taskhow:true, description:request[0].description
                                    }})
                                }}
                            style={{float:'right'}}>Accept</button>
                        </Col>
                        <Col md={2} >
                            <button className='btn btn-primary px-5' style={{float:'right'}}>Decline</button>
                        </Col>
                    </Row>
                </div>
                </Col>
            </Row>
            </div>
            
        }
        <Modal show={show} onHide={profileView?()=>setShow(false):handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{edit==true?"Update Customer":"Add New Customer"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={edit==true?editMechanic:addAgent}>
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
                    type="email" required placeholder="email..." value={email} onChange={(e)=>setEmail(e.target.value)} />
                    {mailWarn==true && <Form.Text style={{color:'crimson'}}> Email Not Unique  </Form.Text>}
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group className="mb-3" controlId="Shop ID">
                        <Form.Label>Shop ID</Form.Label>
                        <input 
                            type="text" style={{border:'1px solid silver', borderRadius:'5px', width:"100%", color:'grey',height:'39px', paddingLeft:'15px'}}
                            placeholder="shop id..." required value={location} 
                         />
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
                {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:(edit==true?"Update":'Create')}
            </Button>
        </Form>
        </Modal.Body>
        </Modal>
      <Modal className='shadow' show={deleteView} onHide={()=>setDeleteView(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Delete Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <span><h6>Sure You Want to Delete <span style={{color:'crimson'}}>{f_name} {l_name}</span> ?</h6></span>
            <Button className='px-4 mt-2' variant="danger" size="sm" onClick={deleteUser}>
                {load==true?<Spinner className='' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:"Yes"}
            </Button>
            <Button className='px-4 mx-2 mt-2' variant="success" size="sm" onClick={()=>setDeleteView(false)}>No</Button>
        </Modal.Body>
      </Modal>
      <Modal className='shadow' show={linkShow} onHide={()=>setLinkShow(false)} size="md" backdrop={'static'}>
        <Modal.Header closeButton>
          <Modal.Title>Link Generated</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <span><h6>Copy The Following Link <span style={{color:'crimson'}}>{f_name} {l_name}</span></h6></span>
            <div style={{color:'grey'}}>{link}</div>
        </Modal.Body>
      </Modal>
      {/*
      <Modal
      show={RequestShow}
      onHide={()=>setRequestShow(false)}
      backdrop="static"
      size='xl'
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Up Coming Requests</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='unApproveList'>
        <Table>
            <thead>
                <tr>
                <th>Name</th>
                <th>Car</th>
                <th>Model</th>
                <th>Service</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    requests.map((cust, index)=>{
                        return(
                            <tr key={cust.id}>
                                <td>{cust.Customer.f_name} {cust.Customer.l_name}</td>
                                <td>{cust.make}</td>
                                <td>{cust.model}</td>
                                <td></td>
                                <td><Button className='approve-btn' size="sm" >Approve</Button></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>
        </div>
      </Modal.Body>
    </Modal>
*/}
    </div>
  )
}

export default CustomersLayout