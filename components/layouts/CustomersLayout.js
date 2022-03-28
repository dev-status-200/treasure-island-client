import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Modal, Button, Form, Spinner, FormControl } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";


const CustomersLayout = ({customers}) => {

    const [MechanicList,setMechanicList] = useState([])

    useEffect(() => {
        setMechanicList(customers)
    }, [])
    
    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false);
    const [edit, setEdit] = useState(false);
    const [view, setView] = useState(false);
    const [deleteView, setDeleteView] = useState(false);

    const handleClose = () => {
        setShow(false);
        setEdit(false);
        setLoad(false);
        setDeleteView(false)
        setTimeout(() => {
            setView(false);
        }, 500);
    };
    const handleShow = () => {setShow(true);};

    const [id      , setId        ] = useState('')
    const [f_name  , setF_name    ] = useState('');
    const [l_name  , setL_Name    ] = useState('');
    const [email   , setEmail     ] = useState('');
    const [shop_id , setShop_id   ] = useState('');
    const [phone   , setPhone     ] = useState('');
    const [gender  , setGender    ] = useState('male');
    const [address , setAddress   ] = useState('');

    const [deleteImageUrl, setDeleteImageUrl] = useState('')

    const [search, setSearch] = useState('')

    const addAgent = (e) => {
        setLoad(true);
        e.preventDefault();
        //console.log(f_name, l_name, password, email, ssn, shop_id, phone, gender, address);
        axios.post('http://localhost:8080/customers/addUser', {
            f_name:f_name, l_name:l_name, gender:gender,
            email:email,  shop_id:shop_id, phone:phone, address:address, loginId:Cookies.get('loginId')
        }).then((x)=>{
            let tempState = [...MechanicList];
            console.log(x);
            tempState.push(x.data);
            setMechanicList(tempState);
            handleClose();
            setLoad(false);
        })
    }
    const editFields = (values) => {
        setId(values.id)
        setF_name(values.f_name);
        setL_Name(values.l_name);
        setEmail(values.email);
        setShop_id(values.shop_id);
        setPhone(values.phone);
        setGender(values.gender);
        setAddress(values.address);
    }
    const editMechanic = (e) => {
        setLoad(true);
        e.preventDefault();
        //console.log(f_name, l_name, password, email, ssn, shop_id, phone, gender, address);
        axios.put(process.env.NEXT_PUBLIC_TI_EDIT_CUSTOMERS, {
            id:id,f_name:f_name, l_name:l_name, gender:gender,
            email:email,  shop_id:shop_id, phone:phone, address:address, loginId:Cookies.get('loginId')
        }).then((x)=>{
            if(x.data[0]=='1'){
                let tempState = [...MechanicList];
                tempState.forEach((z)=>{
                    if (z.id==id) {
                        z.f_name=f_name;
                        z.l_name=l_name;
                        z.gender=gender;
                        z.email=email;
                        z.shop_id=shop_id;
                        z.phone=phone;
                        z.address=address;
                    }
                })
                setMechanicList(tempState);
            }
            handleClose();
            setLoad(false);
        })
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
  return (
    <div className='mechanic-styles'>
        <Container fluid>
            <Row className=''>
               <Col><span style={{color:'grey'}}> Customers </span><button className='global-btn mx-2' onClick={handleShow}> Add new</button></Col>
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
            return(<tr key={index}>
                    <td>
                        <div style={{display:'inline-block'}}>
                            <img src={mech.profile_pic} className="image pb-3"/>
                        </div>
                        <div className='mx-2 mt-2' style={{display:'inline-block'}}>
                            <div className='name'>{mech.f_name} {mech.l_name}</div>
                            <div style={{display:'inline-block'}} className='email'>{mech.email}</div>
                        </div>
                    </td>
                    <td className='phone py-4'>{mech.phone}</td>
                    <td className='phone py-4'>0</td>
                    <td className='phone py-4'>0</td>
                    <td className='phone py-4'>
                        <AiFillDelete className='red icon-trans' onClick={()=>{ editFields(mech); setDeleteView(true);}} />
                        <AiFillEdit className='blue icon-trans' onClick={()=>{editFields(mech); setShow(true); setEdit(true);}} />
                        <AiFillEye className='yellow icon-trans' onClick={()=>{editFields(mech); setView(true); setShow(true);}} /> </td>
                </tr>
            )})}  
            </tbody>
            </Table>
            </div>
            </Col>
            </Row>
        </Container>
        <Modal className='shadow' show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{view?'Customer Profile':edit?'Edit Customer':'Add New Customer'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
    {!view?
        (
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

            </Row>
            <Row>
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
        ):(
        <Row className='justify-content-md-center text-center mt-2 pt-4'>
        <Col md={3}>
            <b>Name : </b> {f_name} {l_name}  
        </Col>
        <Col md={5}>
            <b>email : </b> {email}  
        </Col>
        <Col md={3}>
            <b>shop_id : </b> {shop_id}  
        </Col>
        
        <hr className='mt-2 px-5 w-90p'/>
        <Col md={5}>
            <b>phone : </b> {phone}  
        </Col>
        <Col md={3}>
            <b>gender : </b> {gender}  
        </Col>
        
        <hr className='mt-2 px-5 w-90p'/>
        <Col md={6}>
            <b>address : </b> {address}  
        </Col>
        <Col md={12}>
            <div className='my-4'></div>
        </Col>
        </Row>
        )
    }
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