import React,{useState, useEffect} from 'react'
import {Row, Col, Container} from 'react-bootstrap'
import Image from 'next/image'
import { FiHome, FiBarChart, FiStar, FiUsers, FiFileText, FiBell, FiSettings, FiLogOut } from "react-icons/fi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdPayment } from "react-icons/md";
import Router from 'next/router'

const MainLayout = ({children}) => {
    const [navItems, setNavItems] = useState([
        {id:'0',  link:'/dashboard', name:'Dashboard', class:'active', logo:<FiHome/>},
        {id:'1',  link:'/services', name:'Services', class:'', logo:<FiBarChart/>},
        {id:'2',  link:'/parts', name:'Parts', class:'', logo:<FiStar/>},
        {id:'3',  link:'/customers', name:'Customers', class:'', logo:<HiOutlineUserGroup/>},
        {id:'4',  link:'/tasks', name:'Tasks', class:'', logo:<FiFileText/>},
        {id:'5',  link:'/mechanics', name:'Mechanics', class:'', logo:<FiUsers/>},
        {id:'6',  link:'/enquiries', name:'Exquiries', class:'', logo:<AiOutlineQuestionCircle/>},
        {id:'7',  link:'/invoices', name:'Invoices', class:'', logo:<MdPayment />},
        {id:'8',  link:'/notifications', name:'Notifications', class:'', logo:<FiBell/>},
        {id:'9',  link:'/settings', name:'Settings', class:'', logo:<FiSettings/>},
        {id:'10', link:'/',  name:'Logout', class:'', logo:<FiLogOut/>},
    ])
    const changeNav = (nav) => {
        let tempState = [...navItems];
        tempState.filter((x)=>{
            if(x.name ===nav.name){
                x.class='active'
            }else{
                x.class=''
            }
        })
        setNavItems(tempState);
    }

  return (
    <div className='mainLayout' style={{backgroundColor:'#EAEDF7'}}>
    <Container fluid>
    
        <Row>
            <Col md={2}>
            <div className="">
                <ul>
                <Image src={'/assets/images/white png logo.png'} width={140} height={80} className="py-2" />
                {
                    navItems.map((nav, index)=>{
                    return(
                        <li
                            key={nav.id}
                            className={nav.class}
                            onClick={()=>{changeNav(nav); Router.push(nav.link)}}
                        >
                        <span className='item-icon'>{nav.logo}</span>{nav.name}
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
                            Dominic Keller<br/>
                            <span className='user-type'>Admin</span>
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