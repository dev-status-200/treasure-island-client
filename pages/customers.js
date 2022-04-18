import React, {useEffect} from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'
import CustomersLayout from '../components/layouts/CustomersLayout'

const Customers = ({sessionData, customers, serviceRequest}) => {

  useEffect(() => {
    console.log(sessionData)
    if(sessionData.isLoggedIn==true){
        Router.push('/customers');
      }else{
      Router.push('/');
    }
  }, [])

  return (
    <div><CustomersLayout customers={customers} serviceRequest={serviceRequest} /></div>
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

    const config = {
        method: 'get', headers: { 'Content-Type': 'application/json' }, url: `${process.env.NEXT_PUBLIC_TI_GET_CUSTOMERS}`,
        data : {  }
    };
    const configTwo = {
        method: 'get', headers: { 'Content-Type': 'application/json' }, url: `${process.env.NEXT_PUBLIC_TI_GET_SERVICE_REQUEST}`,
        data : {  }
    };
    const requestTwo = await axios(config);
    const requestThree = await axios(configTwo);
    const customers = await requestTwo.data;
    const serviceRequest = await requestThree.data;

  return{
      props: { sessionData: dataone, customers:customers, serviceRequest:serviceRequest }
  }
}