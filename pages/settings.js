import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'
import SettingsLayout from '../components/layouts/SettingsLayout'

const Settings = ({sessionData, userData}) => {
        
  React.useEffect(() => {
    console.log(sessionData)
    if(sessionData.isLoggedIn==true){
        Router.push('/settings');
      }else{
      Router.push('/');
    }
  }, [])

  return (
    <div><SettingsLayout userData={userData} /></div>
  )
}

export default Settings

export async function getServerSideProps({req,res}) {

  const cookies = new Cookies(req, res)
  const requestOne = await axios.get('https://treasure-island-server.herokuapp.com/getUser',{
      headers:{
          "x-access-token":`${cookies.get('token')}`
      }
    }).then((x)=>x.data)
  const dataone = await requestOne


  const requestTwo = await axios.get(process.env.NEXT_PUBLIC_TI_ADMIN_SETTINGS,{
      headers:{
          "id":`${cookies.get('loginId')}`
      }
    }).then((x)=>x.data);
  const datatwo = await requestTwo
    console.log(datatwo);

  return{
      props: { sessionData: dataone, userData:requestTwo }
  }
}