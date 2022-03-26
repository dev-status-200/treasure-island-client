import React, {useEffect} from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'

const Customers = ({sessionData}) => {

  useEffect(() => {
    console.log(sessionData)
    if(sessionData.isLoggedIn==true){
        Router.push('/customers');
      }else{
      Router.push('/');
    }
  }, [])

  return (
    <div>customers</div>
  )
}

export default Customers

export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)
  const requestOne = await axios.get('https://treasure-island-server.herokuapp.com/getUser',{
      headers:{
          "x-access-token":`${cookies.get('token')}`
      }
    }).then((x)=>x.data)
  
  const dataone = await requestOne
  return{
      props: { sessionData: dataone }
  }
}