import React,{useState, useEffect} from 'react'
import {Row, Col, Container} from 'react-bootstrap'
import Image from 'next/image'
import { FiHome, FiBarChart, FiStar, FiUsers, FiFileText, FiBell, FiSettings, FiLogOut } from "react-icons/fi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdPayment, MdLocationOn } from "react-icons/md";
import Router, { useRouter } from 'next/router'
import Cookies from 'js-cookie'

const MainLayout = ({children}) => {
    const router = useRouter();

    const [navItems, setNavItems] = useState([
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
        {id:'10', link:'/',  name:'Logout', class:'', logo:<FiLogOut/>},
    ])
    useEffect(() => {
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
                        {Cookies.get('username')}<br/>
                        <span className='user-type'>{Cookies.get('role_id')}</span>
                    </div>
                    <div className="location">
                        <MdLocationOn className='select-icon' />
                        <select onChange={(e)=>Cookies.set('location',e.target.value)}>
                            <option value={'location-1'}>Location 1</option>
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