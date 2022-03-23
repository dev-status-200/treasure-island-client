import React,{useState, useEffect} from 'react'
import {Row, Col, Container} from 'react-bootstrap'

const MainLayout = ({children}) => {

    const [navItems, setNavItems] = useState([
        {id:'0', name:'Home', class:'active'},
        {id:'1', name:'Profile', class:''},
        {id:'2', name:'Messages', class:''},
        {id:'3', name:'Setting', class:''},
        {id:'4', name:'Help', class:''},
        {id:'5', name:'Password', class:''},
        {id:'6', name:'Sign Out', class:''},
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
    <div className='mainLayout'>
    <Container fluid>
        <Row>
            <Col md={2}>
            <div class="">
                <ul>
                {
                    navItems.map((nav, index)=>{
                    return(
                        <li
                            key={nav.id}
                            className={nav.class}
                            onClick={()=>changeNav(nav)}
                        >
                            {nav.name}
                        </li>
                        )
                    })
                }
                </ul>
            </div>
            </Col>
            <Col>{children}</Col>
        </Row>
    </Container>    
    </div>
  )
}

export default MainLayout