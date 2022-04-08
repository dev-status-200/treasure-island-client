import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'
import PartsLayout from '../components/layouts/PartsLayout'

const Parts = ({sessionData, parts}) => {
      
  React.useEffect(() => {
    if(sessionData.isLoggedIn==true){
        Router.push('/parts');
      }else{
      Router.push('/');
    }
    console.log(parts)
  }, [])

  return (
    <div><PartsLayout parts={parts} /></div>
  )
}

export default Parts

export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)
  const requestOne = await axios.get('https://treasure-island-server.herokuapp.com/getUser',{
      headers:{
          "x-access-token":`${cookies.get('token')}`
      }
    }).then((x)=>x.data)
  const dataone = await requestOne
  
  const requestTwo = await axios.get(process.env.NEXT_PUBLIC_TI_GET_PARTS).then((x)=>x.data);
  const parts = await requestTwo
  

  return{
      props: { sessionData: dataone, parts:parts }
  }
}