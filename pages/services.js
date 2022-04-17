import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'
import ServiceLayout from '../components/layouts/ServiceLayout'


const Services = ({sessionData, parts, servicesData}) => {

  React.useEffect(() => {
    //console.log(servicesData)
    if(sessionData.isLoggedIn==true){
        Router.push('/services');
      }else{
      Router.push('/');
    }
  }, [])

  return (
    <div><ServiceLayout parts={parts} servicesData={servicesData} /></div>
  )
}
export default Services


export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)
  const requestOne = await axios.get('https://treasure-island-server.herokuapp.com/getUser',{
      headers:{
          "x-access-token":`${cookies.get('token')}`
      }
    }).then((x)=>x.data)
  
  const requestTwo = await axios.get(process.env.NEXT_PUBLIC_TI_GET_PARTS).then((x)=>x.data)

  const requestThree = await axios.get(process.env.NEXT_PUBLIC_TI_GET_SERVICES).then((x)=>x.data)
  
  console.log(requestThree)

  const dataone = await requestOne
  const datatwo = await requestTwo
  const datathree = await requestThree
  return{
      props: { sessionData: dataone, parts:datatwo, servicesData:datathree }
  }
}