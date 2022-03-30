import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Modal, Button, Form, Spinner, FormControl } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { ImPhone, ImCreditCard } from "react-icons/im";
import { MdMailOutline, MdLocationOn, MdOutlineMode } from "react-icons/md";
import Router from 'next/router'

const MechanicsLayout = ({mechanics}) => {

    const [show, setShow] = useState(false);
    const [change, setChange] = useState(false);

    const handleClose = () => {setShow(false); setEdit(false); setChange(false); clearFields();}
    const handleShow = () => {setShow(true); setChange(true);}

    const handleEditShow = () => { setEdit(true); setShow(true);}
    
    const [edit, setEdit] = useState(false);
    const [load, setLoad] = useState(false);

    const [MechanicList,setMechanicList] = useState([]);

    useEffect(() => {
        setMechanicList(mechanics)
    }, [])

    const clearFields = () => {
        setId(""); 
        setF_name("");  
        setL_Name("");  
        setPassword("");
        setEmail("");   
        setSsn("");     
        setShop_id(""); 
        setPhone("");   
        setGender("male");  
        setAddress(""); 
        setImage("");   
    }
    const editFields = (values) => {
        setId(values.id); setF_name(values.f_name); setL_Name(values.l_name);
        setPassword(values.password); setEmail(values.email); setSsn(values.ssn);
        setShop_id(values.shop_id); setPhone(values.phone); setGender(values.gender);
        setAddress(values.address); setImage(values.profile_pic); handleEditShow()
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
    
    const [prevImg, setprevImg] = useState('');

    const [profileView, setProfileView] = useState(false)

    async function uploadImage(){
        let value = '';
        if(change==true){
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "g4hjcqh7")
            data.append("cloud_name", "abdullah7c")
            value = await fetch(`https://api.cloudinary.com/v1_1/abdullah7c/image/upload`, {
                method: "post",
                body: data
            })
                .then(resp => resp.json())
                .then(data => data.url)
                .catch(err => console.log(err));
            setImage(value);
            console.log(value)
        }else{
            value=image;
        }
        return value;
    }
    const addAgent = async(e) => {
        setLoad(true);
        e.preventDefault();
        await axios.post(process.env.NEXT_PUBLIC_TI_ADD_MECHANICS, {
            f_name:f_name, l_name:l_name, password:password, gender:gender, photo:await uploadImage(),
            email:email, ssn:ssn, shop_id:shop_id, phone:phone, address:address, loginId:Cookies.get('loginId')
        }).then((x)=>{
            let tempState = [...MechanicList];
            console.log(x);
            tempState.push(x.data);
            setMechanicList(tempState);
            handleClose();
            setLoad(false);
        })
    }
    const editMechanic = async(e) => {
        setLoad(true);
        e.preventDefault();
        let imageVal = '';
        imageVal =await uploadImage()
        axios.put(process.env.NEXT_PUBLIC_TI_EDIT_MECHANICS, {
            id:id,f_name:f_name, l_name:l_name, password:password, gender:gender, photo:imageVal,
            email:email, ssn:ssn, shop_id:shop_id, phone:phone, address:address, loginId:Cookies.get('loginId')
        }).then((x)=>{
            if(x.data[0]=='1'){
                    let tempState = [...MechanicList];
                    tempState.forEach((z)=>{
                        if (z.id==id) {
                            z.f_name=f_name;
                            z.l_name=l_name;
                            z.password=password;
                            z.gender=gender;
                            z.email=email;
                            z.ssn=ssn;
                            z.shop_id=shop_id;
                            z.phone=phone;
                            z.address=address;
                            z.profile_pic=imageVal
                        }
                    })
                    setMechanicList(tempState);
                    setChange(false);
                    //Router.push('/mechanics')
            }
            setShow(false);
            setLoad(false);
        })
    }
    
  return (
    <div className='mechanic-styles'>
        {!profileView &&
        <Container className='profile-view' fluid>
            <Row className=''>
               <Col><span style={{color:'grey'}}> Employees </span><button className='global-btn mx-2' onClick={handleShow}> Add new</button></Col>
               <Col><FormControl style={{width:'300px', float:'right', backgroundColor:'#f4f6fd'}} type='text' placeholder='Search...' value={search} onChange={(e)=>setSearch(e.target.value)} /></Col>
            </Row>
            <Row className='mt-4'>
            <Col md={12}>
            <div className='box'>
            <Table responsive>
            <thead>
                <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Completed Task</th>
                <th>Active Task</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {MechanicList.filter((x)=>{
                if(search==""){
                    return x
                }else if(
                    x.f_name.toLowerCase().includes(search.toLowerCase()) || 
                    x.l_name.toLowerCase().includes(search.toLowerCase())
                ){
                    return x
                }
            }).map((mech, index)=>{
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
                    <AiFillDelete className='red icon-trans' />
                    <AiFillEdit className='blue icon-trans' onClick={()=>editFields(mech)} />
                    <AiFillEye className='yellow icon-trans' onClick={()=>viewMechanic(mech)} />
                </td>
                </tr>
            )})}  
            </tbody>
            </Table>
            </div>
            </Col>
            </Row>
        </Container>}
        {profileView &&
            <div className='profile-view  pt-2'>
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
                                <Col md={4} className="text-center">
                                    <div className='my-2'> <ImPhone className='mx-1' /> {phone} </div>
                                    <div className='border-btm'></div>
                                    <div className='my-2'> <ImCreditCard className='mx-1' /> {ssn} </div>
                                </Col>
                                <Col md={4} className="text-center">
                                    <div className='my-2'> <MdMailOutline className='mx-1' /> {email} </div>
                                    <div className='border-btm'></div>
                                    <div className='my-2'> <MdLocationOn className='mx-1' /> {address} </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <span onClick={()=>setProfileView(false)}><b className='bact-btn'>{"<"} Mechanics</b> </span>
                <Row className='mt-4 p-3 box-two'>
                <Table responsive>
                <thead>
                    <tr>
                    <th>#ID</th>
                    <th>Services</th>
                    <th>Customer</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Milage</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {Array.from({ length: 6 }).map((_, index) => (
                    <tr className='' key={index}> 
                        <td className='phone py-2'>#123</td>
                        <td className='phone py-2'>Oil Change</td>
                        <td className='phone py-2'>SAJID O</td>
                        <td className='phone py-2'>
                            <img src={'/img1.jpg'} className="img1" />
                            <img src={'/img2.jpg'} className="img2" />
                            <img src={'/img3.jpg'} className="img3" />
                        </td>
                        <td className='phone py-2'>On Hold</td>
                        <td className='phone py-2'>03/11/2021</td>
                        <td className='phone py-2'>10,000 </td>
                        <td className='phone py-2'>
                            <AiFillDelete className='red icon-trans' />
                            <AiFillEdit className='blue icon-trans'  />
                            <AiFillEye className='yellow icon-trans'  />
                        </td>
                    </tr>
                  ))}
                    
                </tbody>
                </Table>
                </Row>
            </div>
        }
        <Modal show={show} onHide={profileView?()=>setShow(false):handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{edit==true?"Update Mechanic":"Add New Mechanic"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={edit==true?editMechanic:addAgent}>
        <Row>
            <Col>
                <Form.Group className="mb-3" controlId="First Name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="first Name..." required value={f_name} onChange={(e)=>setF_name(e.target.value)} />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group className="mb-3" controlId="Last Name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="last Name..." required value={l_name} onChange={(e)=>setL_Name(e.target.value)} />
                </Form.Group>                
            </Col>
        </Row>      
        <Row>
            <Col>
                <Form.Group className="mb-3" controlId="Email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="email..." required value={email} onChange={(e)=>setEmail(e.target.value)} />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group className="mb-3" controlId="Password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" placeholder="password..." required value={password} onChange={(e)=>setPassword(e.target.value)} />
                </Form.Group>                
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Group className="mb-3" controlId="SSN">
                    <Form.Label>SSN</Form.Label>
                    <Form.Control type="text" placeholder="ssn..." required value={ssn} onChange={(e)=>setSsn(e.target.value)} />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group className="mb-3" controlId="Shop ID">
                    <Form.Label>Shop ID</Form.Label>
                    <Form.Control type="text" placeholder="shop id..." required value={shop_id} onChange={(e)=>setShop_id(e.target.value)} />
                </Form.Group>                
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Group className="mb-3" controlId="Phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" placeholder="phone..." required value={phone} onChange={(e)=>setPhone(e.target.value)} />
                </Form.Group>
            </Col>
            <Col>
            <Form.Group className="mb-3" controlId="Gender">
            <Form.Label>Gender</Form.Label>
                <Form.Select aria-label="Default select example" required value={gender} onChange={(e)=>setGender(e.target.value)}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </Form.Select>
            </Form.Group>             
            </Col>
            <Col>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Photo</Form.Label><br/>
                {edit && <span><span><Form.Check type="checkbox" label="Change" onChange={()=>{setChange(!change)}} /></span>
                    <span><input disabled={change?false:true} type="file" onChange={(e) => setImage(e.target.files[0])} required ></input></span></span>}
                {!edit && <input type="file" onChange={(e) => setImage(e.target.files[0])} required ></input>}
            </Form.Group>        
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Group className="mb-3" controlId="Address">
                    <Form.Label>Detailed Address</Form.Label>
                    <Form.Control type="text" placeholder="address..." required value={address} onChange={(e)=>setAddress(e.target.value)}/>
                </Form.Group>
            </Col>
        </Row>
            <Button variant="primary" type="submit">
                {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:(edit==true?"Update":'Create')}
            </Button>
    </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default MechanicsLayout