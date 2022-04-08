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
import { useRouter } from 'next/router'

const userForm = () => {

    const router = useRouter();

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
        //axios.post()
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
    <div className='online-form pt-5' >
        <div className='text-center'>
            <img src={'/assets/images/white png logo.png'} width={140} height={70} />
            <h3 className='wh'>Online Registration</h3>
        </div>    
        <Container className='box mt-4 px-4 py-5' style={{maxWidth:'600px'}}>
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
                        <select aria-label="Default select example" required value={gender} onChange={(e)=>setGender(e.target.value)}
                            style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'5px', backgroundColor:'white'}}
                            >
                                <option value="male">Location-1</option>
                                <option value="female">Location-2</option>
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
                {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:(edit==true?"Update":'Create')}
            </Button>
        </Form>
        </Container>
    </div>
  )
}

export default userForm