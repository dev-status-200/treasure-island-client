import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'
import MechanicsLayout from '../components/layouts/MechanicsLayout'
import cookies from 'js-cookie'

const Mechanics = ({sessionData, mechanics}) => {
  
  React.useEffect(() => {
    console.log(mechanics)
    if(sessionData.isLoggedIn==true){
        Router.push('/mechanics');
      }else{
      Router.push('/');
    }
  }, [])

  return (
    <div>{cookies.get('role_id')=="Admin" && <MechanicsLayout mechanics={mechanics} />}</div>
  )
}

export default Mechanics

export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)
  const requestOne = await axios.get('https://treasure-island-server.herokuapp.com/getUser',{
      headers:{
          "x-access-token":`${cookies.get('token')}`
      }
    }).then((x)=>x.data);
  const dataone = await requestOne

  const config = {
    method: 'get', headers: { 'Content-Type': 'application/json' }, url: `${process.env.NEXT_PUBLIC_TI_GET_MECHANICS}`,
    data : {  }
};
const requestTwo = await axios(config);
const users = await requestTwo.data;

  return{
      props: { sessionData: dataone, mechanics:users }
  }
}