import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'
import InvoiceLayout from '../../components/layouts/InvoiceLayout'

const Invoices = ({ sessionData, invoice, orders, services }) => {

  React.useEffect(() => {
    console.log(sessionData)
    if (sessionData.isLoggedIn == true) {
      Router.push('/invoices');
    } else {
      Router.push('/');
    }
  }, [])

  return (
    <>
      <InvoiceLayout invoice={invoice} orders={orders} services={services} />
    </>
  )
}

export default Invoices
export async function getServerSideProps({ req, res }) {

  const cookies = new Cookies(req, res)
  const requestOne = await axios.get('https://treasure-island-server.herokuapp.com/getUser', {
    headers: {
      "x-access-token": `${cookies.get('token')}`
    }
  }).then((x) => x.data)

  const dataone = await requestOne

  const response = await fetch(
    `https://treasure-island-server.herokuapp.com/invoices/getInvoice`
  );
  const orderResponse = await fetch(`https://treasure-island-server.herokuapp.com/dashboard/recentOrders`);
  const serviceResponse = await fetch(process.env.NEXT_PUBLIC_TI_GET_SERVICES);

  const invoice = await response.json();
  const orders = await orderResponse.json();
  const services = await serviceResponse.json();
  return {
    props: { sessionData: dataone, invoice, orders, services }
  }
}