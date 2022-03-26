import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Modal, Button, Form, Spinner } from 'react-bootstrap'
import axios from 'axios'
import Cookies from 'js-cookie'
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";


const MechanicsLayout = ({mechanics}) => {

    const [MechanicList,setMechanicList] = useState([])

    useEffect(() => {
        setMechanicList(mechanics)
    }, [])
    

    const [show, setShow] = useState(false);
    const [load, setLoad] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [id, setId] = useState("")
    const [f_name, setF_name] = useState('');
    const [l_name, setL_Name] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [ssn, setSsn] = useState('');
    const [shop_id, setShop_id] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('male');
    const [address, setAddress] = useState('');

    const [deleteImageUrl, setDeleteImageUrl] = useState('')

    const addAgent = (e) => {
        setLoad(true);
        e.preventDefault();
        console.log(f_name, l_name, password, email, ssn, shop_id, phone, gender, address);
        axios.post('http://localhost:5000/users/addUser', {
            f_name:f_name, l_name:l_name, password:password, gender:gender,
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

  return (
    <div className='mechanic-styles'>
        <Container fluid>
            <Row className=''>
               <Col><span style={{color:'grey'}}> Employees </span><button className='global-btn mx-2' onClick={handleShow}> Add new</button></Col>
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
                {
                    MechanicList.map((mech, index)=>{
                        return(
                            <tr key={index}>
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
                            <td className='phone py-4'><AiFillDelete className='red mx-1'/> <AiFillEdit className='blue'/> <AiFillEye className='yellow mx-1'/> </td>
                          </tr>
                        )
                    })
                }  
                </tbody>
              </Table>
                </div>
               </Col>
            </Row>
        </Container>

        <Modal className='shadow' show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Mechanic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={addAgent}>
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
          {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:'Submit'}
        </Button>
      </Form>
        </Modal.Body>

      </Modal>

    </div>
  )
}

export default MechanicsLayout