import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'

const tasks = ({sessionData}) => {
          
  React.useEffect(() => {
    console.log(sessionData)
    if(sessionData.isLoggedIn==true){
        Router.push('/tasks');
      }else{
      Router.push('/');
    }
  }, [])

  return (
    <div>tasks</div>
  )
}

export default tasks
export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)
  const requestOne = await axios.get('http://localhost:5000/getUser',{
      headers:{
          "x-access-token":`${cookies.get('token')}`
      }
    }).then((x)=>x.data)
  
  const dataone = await requestOne
  return{
      props: { sessionData: dataone }
  }
}