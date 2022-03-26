import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'

const Parts = ({sessionData}) => {
      
  React.useEffect(() => {
    console.log(sessionData)
    if(sessionData.isLoggedIn==true){
        Router.push('/parts');
      }else{
      Router.push('/');
    }
  }, [])

  return (
    <div>parts</div>
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
  return{
      props: { sessionData: dataone }
  }
}