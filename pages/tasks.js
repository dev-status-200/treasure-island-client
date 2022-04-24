import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'
import TaskLayout from '../components/layouts/TaskLayout'

const Tasks = ({sessionData, services, parts}) => {

  React.useEffect(() => {
    console.log(sessionData)
    if(sessionData.isLoggedIn==true){
        Router.push('/tasks');
      }else{
      Router.push('/');
    }
  }, [])

  return (
    <div><TaskLayout services={services} parts={parts} /></div>
  )
}
export default Tasks

export async function getServerSideProps({req,res}) {
  const cookies = new Cookies(req, res)
  const requestOne = await axios.get('https://treasure-island-server.herokuapp.com/getUser',{
      headers:{
          "x-access-token":`${cookies.get('token')}`
      }
    }).then((x)=>x.data)
    
  const requestTwo = await axios.get(process.env.NEXT_PUBLIC_TI_GET_SERVICES).then((x)=>x.data)

  const requestThree = await axios.get(process.env.NEXT_PUBLIC_TI_GET_PARTS).then((x)=>x.data)

  const dataone = await requestOne
  const datatwo = await requestTwo
  const datathree = await requestThree

  return{
      props: { sessionData: dataone, services:datatwo, parts:datathree }
  }
}