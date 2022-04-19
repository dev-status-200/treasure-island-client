import React,{useState, useEffect} from 'react'
import {Row, Col, Container} from 'react-bootstrap'
import Image from 'next/image'
import { FiHome, FiBarChart, FiStar, FiUsers, FiFileText, FiBell, FiSettings, FiLogOut } from "react-icons/fi";
import { AiOutlineQuestionCircle, AiFillBell } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdPayment, MdLocationOn } from "react-icons/md";
import Router, { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useSelector, useDispatch } from 'react-redux'
import { locationOne, locationTwo } from '../../redux/Actions&Reducers/locationSlice';

const MainLayout = ({children}) => {

    const location = useSelector((state) => state.location.value)
    const dispatch = useDispatch();
    const router = useRouter();
    const adminMenu =
    [
        {id:'0',  link:'/dashboard', name:'Dashboard', class:'', logo:<FiHome/>},
        {id:'1',  link:'/services', name:'Services', class:'', logo:<FiBarChart/>},
        {id:'2',  link:'/parts', name:'Parts', class:'', logo:<FiStar/>},
        {id:'3',  link:'/customers', name:'Customers', class:'', logo:<HiOutlineUserGroup/>},
        {id:'4',  link:'/tasks', name:'Tasks', class:'', logo:<FiFileText/>},
        {id:'5',  link:'/mechanics', name:'Mechanics', class:'', logo:<FiUsers/>},
        {id:'6',  link:'/enquiries', name:'Enquiries', class:'', logo:<AiOutlineQuestionCircle/>},
        {id:'7',  link:'/invoices', name:'Invoices', class:'', logo:<MdPayment />},
        {id:'8',  link:'/notifications', name:'Notifications', class:'', logo:<FiBell/>},
        {id:'9',  link:'/settings', name:'Settings', class:'', logo:<FiSettings/>},
        {id:'10', link:'/',  name:'Logout', class:'', logo:<FiLogOut/>}
    ];
    const mechanicMenu =
    [
        {id:'0',  link:'/dashboard', name:'Dashboard', class:'', logo:<FiHome/>},
        {id:'1',  link:'/parts', name:'Parts', class:'', logo:<FiStar/>},
        {id:'2',  link:'/customers', name:'Customers', class:'', logo:<HiOutlineUserGroup/>},
        {id:'3',  link:'/tasks', name:'Tasks', class:'', logo:<FiFileText/>},
        {id:'4',  link:'/enquiries', name:'Enquiries', class:'', logo:<AiOutlineQuestionCircle/>},
        {id:'5',  link:'/invoices', name:'Invoices', class:'', logo:<MdPayment />},
        {id:'6',  link:'/notifications', name:'Notifications', class:'', logo:<FiBell/>},
        {id:'7', link:'/',  name:'Logout', class:'', logo:<FiLogOut/>}
    ];
    const [image, setImage] = useState("")
    const [navItems, setNavItems] = useState(Cookies.get('role_id')=="Mechanic"?mechanicMenu:adminMenu);

    useEffect(() => {
        setImage(Cookies.get('picture'));
        let tempState = [...navItems];
        tempState.filter((x)=>{ if(x.link===router.pathname){ x.class='active' } else { x.class='' } })
        setNavItems(tempState);
    }, [router.pathname])

    const changeNav = (nav) => {
        if(nav.name!='Logout'){
            let tempState = [...navItems];
            tempState.filter((x)=>{
                if(x.name===nav.name){
                    x.class='active'
                    Router.push({pathname:`${nav.link}`})
                }else{
                    x.class=''
                }
            })
            setNavItems(tempState);
        }else if(nav.name=='Logout'){
            Cookies.remove('token');
            Cookies.remove('username');
            Cookies.remove('role_id');
            Cookies.remove('loginId');
            Router.push('/');
        }
    }
    const setLocation = (value) =>{
        console.log(value)
        if(value=='location-1'){
            dispatch(locationOne())
        }else if(value=='location-2'){
            dispatch(locationTwo())
        }
    }
  return (
    <div className='mainLayout' style={{backgroundColor:'#EAEDF7'}}>
    <Container fluid>
        <Row>
            <Col md={2}>
            <div className="">
                <ul>
                <Image src={'/assets/images/white png logo.png'} width={140} height={80} className="py-2" />
                <div className='my-3'></div>
                {
                    navItems.map((nav, index)=>{
                    return(
                        <li key={nav.id} className={nav.class}
                            onClick={()=>{changeNav(nav)}} >
                        <span className='item-icon'>{nav.logo}</span><span className='title'>{nav.name}</span>
                        </li>
                        )
                    })
                }
                </ul>
            </div>
            </Col>
            <Col>
                <Row>
                    <Col md={12} className="top-bar">
                    <div className='user'>
                    <Row>
                    <Col md={3}>
                        <img src={image} className="login_pic" />
                    </Col>
                    <Col >
                        {Cookies.get('username')}<br/>
                        <span className='user-type'>{Cookies.get('role_id')}</span>
                    </Col>
                    </Row>
                    </div>
                    <div className='notification-bell'><AiFillBell/></div>
                    <div className="location">
                        <MdLocationOn className='select-icon' />
                        <select onChange={(e)=>setLocation(e.target.value)}>
                            <option value={'location-1'} >Location 1</option>
                            <option value={'location-2'}>Location 2</option>
                        </select>
                    </div>
                    </Col>
                    <Col md={12}>
                        <div className="children">
                            {children}
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>    
    </div>
  )
}

export default MainLayout