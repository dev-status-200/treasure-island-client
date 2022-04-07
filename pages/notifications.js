import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'
import NotificationsLayout from '../components/layouts/NotificationsLayout'

const Notifications = ({sessionData, notifications}) => {
    
  React.useEffect(() => {
    console.log(sessionData)
    if(sessionData.isLoggedIn==true){
        Router.push('/notifications');
      }else{
      Router.push('/');
    }
  }, [])

  return (
    <div><NotificationsLayout notifications={notifications} /></div>
  )
}

export default Notifications

export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)
  const requestOne = await axios.get('https://treasure-island-server.herokuapp.com/getUser',{
      headers:{
          "x-access-token":`${cookies.get('token')}`
      }
    }).then((x)=>x.data)
  const dataone = await requestOne
  
  const requestTwo = await axios.get(process.env.NEXT_PUBLIC_TI_GET_NOTIFICATIONS).then((x)=>x.data)
  const datatwo = await requestTwo

  return{
      props: { sessionData: dataone, notifications:datatwo }
  }
}