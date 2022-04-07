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

const SettingsLayout = ({userData}) => {

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

    const [change, setChange] = useState(false);

    const [showPass, setShowPass] = useState(true);

    const [mailWarn, setMailWarn] = useState(false);
    const [passWarn, setPassWarn] = useState(false);
    const [ssnWarn, setSsWarn] = useState(false);
    const [phoneWarn, setPhoneWarn] = useState(false);

    const [edit, setEdit] = useState(true);
    const [load, setLoad] = useState(false);

    const [mailList, setMailList] = useState([]);

    useEffect(() => {
        setId(userData.id);
        setF_name(userData.f_name);
        setL_Name(userData.l_name);
        setEmail(userData.email);
        setPassword(userData.password);
        setGender(userData.gender);
        setPhone(userData.phone);
        setImage(userData.profile_pic);
        setAddress(userData.address);
    }, [])

    async function uploadImage(){
        let value = '';
        if(change==true){
            if(image!=""){
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
            }else {
                value="https://res.cloudinary.com/abdullah7c/image/upload/v1643040095/images_djois2.png"
            }
        }else{
            value=image;
        }
        return value;
    }
    const getMailEdit = async() => {
        let res = await axios.get(process.env.NEXT_PUBLIC_TI_MECHANIC_EMAILS_EDIT,{
            headers:{
                "id":`${id}`
            }
        }).then((x)=>(x.data));
        console.log(res)
        setMailList(res);
    }
    const editAdmin = async(e) => {
        e.preventDefault();

        getMailEdit()

        let mailWarning = false;
        let passWarning = false;
        let ssnWarning = false;
        let phoneWarning = false;
        mailList.forEach((x)=>{
            if(x.email==email){
                if(x.email!='-'){
                    mailWarning = true;
                }
            }
            if(x.ssn==ssn){
                ssnWarning = true;
            }
            if(x.phone==phone){
                phoneWarning = true;
            }
        })

        password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)==null?passWarning=true:passWarning=false

        if(mailWarning==true || passWarning == true || phoneWarning == true){
            mailWarning==true?setMailWarn(true):setMailWarn(false);
            passWarning==true?setPassWarn(true):setPassWarn(false);
            ssnWarning==true?setSsWarn(true):setSsWarn(false);
            phoneWarning==true?setPhoneWarn(true):setPhoneWarn(false);
        } else {
            setLoad(true);
            let imageVal = '';
            imageVal =await uploadImage()
            axios.put(process.env.NEXT_PUBLIC_TI_EDIT_ADMIN_SETTINGS, {
                id:id,f_name:f_name, l_name:l_name, password:password, gender:gender, photo:imageVal,
                email:email, phone:phone, address:address, loginId:Cookies.get('loginId')
            }).then((x)=>{
                if(x.data[0]=='1'){
                    setChange(false);
                }
                setLoad(false);
                setPassWarn(false);
                setSsWarn(false);
                setMailWarn(false);
                setPhoneWarn(false);
                setShowPass(true);
            })
        }


    }

  return (
    <div className='box p-4'>
    <Form onSubmit={editAdmin}>
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
                type="text" placeholder="email..." value={email} onChange={(e)=>setEmail(e.target.value)} />
                {mailWarn==true && <Form.Text style={{color:'crimson'}}> Email Not Unique  </Form.Text>}
                </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" controlId="Password">
                <Form.Label>Password</Form.Label>
                <input
                    style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                    type={showPass?"password":"text"} placeholder="password..." required value={password} onChange={(e)=>setPassword(e.target.value)} />
                    {showPass?(<AiFillEyeInvisible style={{float:'right', cursor:"pointer", position:'relative', bottom:'28px', right:'10px'}} onClick={()=>setShowPass(!showPass)} />):(<AiFillEye style={{float:'right', cursor:"pointer", position:'relative', bottom:'28px', right:'10px'}} onClick={()=>setShowPass(!showPass)} />)}
                    {passWarn==true && <Form.Text style={{color:'crimson'}}> Must be {"(8-20)"} letters, with special & numeric character.  </Form.Text>}
            </Form.Group>                
        </Col>
    </Row>
    <Row>
    </Row>
    <Row>
        <Col>
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
        <Col>
        <Form.Group className="mb-3" controlId="Gender">
        <Form.Label>Gender</Form.Label>
            <select aria-label="Default select example" required value={gender} onChange={(e)=>setGender(e.target.value)}
            style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'5px', backgroundColor:'white'}}
            >
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </Form.Group>             
        </Col>
        <Col>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Photo</Form.Label><br/>
            {edit && <span><span><Form.Check type="checkbox" label="Change" onChange={()=>{setChange(!change)}} /></span>
                <span><input disabled={change?false:true} type="file" onChange={(e) => setImage(e.target.files[0])} required></input></span></span>}
            {!edit && <input type="file" onChange={(e) => setImage(e.target.files[0])} ></input>}
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
            {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:"Update"}
        </Button>
    </Form>
    </div>
  )
}

export default SettingsLayout