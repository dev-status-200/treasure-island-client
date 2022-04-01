import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Modal, Button, Form, Spinner, FormControl } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'
import { AiFillDelete, AiFillEdit, AiFillEye ,AiOutlineSearch, AiFillEyeInvisible } from "react-icons/ai";
import { ImPhone, ImCreditCard } from "react-icons/im";
import { MdMailOutline, MdLocationOn, MdOutlineMode } from "react-icons/md";
import { RiSortDesc } from "react-icons/ri";
import NumberFormat from "react-number-format";
import Router from 'next/router'
import { FaIdCard, FaEnvelope } from "react-icons/fa";

const CustomersLayout = ({customers}) => {

    const [show, setShow] = useState(false);
    const [change, setChange] = useState(false);

    const [mailList, setMailList] = useState([]);

    const handleClose = () => { setShow(false); setEdit(false); setChange(false); clearFields(); setMailWarn(false); setPhoneWarn(false);}
    const handleShow = () => { getMail(); setShow(true); setChange(true); }

    const handleEditShow = () => { setEdit(true); setShow(true); }
    
    const [edit, setEdit] = useState(false);
    const [load, setLoad] = useState(false);
    const [deleteView, setDeleteView] = useState(false);


    const [mailWarn, setMailWarn] = useState(false);
    const [phoneWarn, setPhoneWarn] = useState(false);

    const [MechanicList,setMechanicList] = useState([]);

    useEffect(() => {
        setMechanicList(customers)
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
                email:email, ssn:ssn, shop_id:Cookies.get('location'), phone:phone, address:address, loginId:Cookies.get('loginId')
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
                email:email, shop_id:Cookies.get('location'), loginId:Cookies.get('loginId')
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
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState((MechanicList.length/5));
    const [startIndex, setStartIndex] = useState(0)

    const [increment, setIncrement] = useState(false);

    useEffect(() => {
        setTotalPages(MechanicList.length/8);
    }, [MechanicList])
    
    useEffect(() => {
        console.log(startIndex)
        if(page===1){
            setStartIndex(0);
        }else if(page>1){
            increment==true?setStartIndex(startIndex+8):setStartIndex(startIndex-8)
        }
    }, [page])
  return (
    <div className='mechanic-styles'>
        {!profileView &&
        <Container className='profile-view' fluid>
            <Row className=''>
               <Col><span style={{color:'grey'}}> Customers </span><button className='global-btn mx-2' onClick={handleShow}> Add new</button></Col>
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
                {MechanicList.filter((x)=>{
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
                        {/*<AiFillEye className='blue icon-trans' onClick={()=>viewMechanic(mech)} />*/}
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
        {profileView &&
            <div className='profile-view  pt-1'>
                <Row>
                    <Col md={4}>
                        <div className='pic-frame'>
                            <img src={image} className="frame-image"/>
                        </div>
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
                                    <div className='my-2'> <FaIdCard className='mx-3' /> {ssn} </div>
                                </Col>
                                <Col md={4} className="">
                                    <div className='my-2'> <FaEnvelope className='mx-3' /> {email=='-'?'Not Registered':email==''?'Not Registered':email} </div>
                                    <div className='border-btm' style={{width:"65%", marginLeft:'5%'}}></div>
                                    <div className='my-2'> <MdLocationOn className='mx-3' /> {address} </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <span onClick={()=>{setProfileView(false); handleClose();}}><b className='bact-btn'>{"<"} Mechanics</b> </span>
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
                            placeholder="shop id..." required value={Cookies.get('location')} 
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
    </div>
  )
}

export default CustomersLayout