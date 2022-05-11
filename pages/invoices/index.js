import React from 'react'
import axios from 'axios'
import Cookies from 'cookies'
import Router, { useRouter } from 'next/router'
import { Table } from 'react-bootstrap'

const Invoices = ({ sessionData }) => {

  React.useEffect(() => {
    console.log(sessionData)
    if (sessionData.isLoggedIn == true) {
      Router.push('/invoices');
    } else {
      Router.push('/');
    }
  }, [])

  const router = useRouter();

  function createData(invoice, taskid, cusname, createdDate, amount, status, paidon) {
    return { invoice, taskid, cusname, createdDate, amount, status, paidon };
  }

  const rows = [
    createData('1234234', 'Jon', 'Snow', '29/11/2001', '534', 'failed', '29/11/2001'),
    createData('1234234', 'Jon', 'Snow', '29/11/2001', '534', 'success', '29/11/2001'),
    createData('1234234', 'Jon', 'Snow', '28/11/2001', '534', 'failed', '29/11/2001'),
    createData('1234234', 'Jon', 'Snow', '29/11/2001', '534', 'failed', '29/11/2001'),
    createData('1234234', 'Jon', 'Snow', '29/11/2001', '534', 'failed', '29/11/2001'),
    createData('1234234', 'Jon', 'Snow', '29/11/2001', '534', 'failed', '29/11/2001'),
  ];
  return (
    <>
      <div className="iheader">

        <h4>Invoices</h4>

        <div style={{ paddingTop: '50px' }}  >


          <Table className='invoiceTable1' sx={{ minWidth: 650 }} aria-label="simple table">

            <thead>
              <tr>

                <th>Invoice Number</th>
                <th>Task ID</th>
                <th>Customer Name</th>
                <th>Created At</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid On</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, padding: '8px 0' }}
                >

                  <td onClick={() => router.push(`/invoices/${row.invoice}`)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', textUnderlineOffset: '2px' }} component="th" scope="row">
                    {row.invoice}
                  </td>

                  <td >
                    {row.taskid}
                  </td>
                  <td  >
                    {row.cusname}
                  </td>
                  <td>
                    {row.createdDate}
                  </td>
                  <td >
                    {row.amount}
                  </td>
                  <td >
                    {row.status}
                  </td>
                  <td component="th" >
                    {row.paidon}
                  </td>
                  <td component="th" >
                    <button style={{ border: 'none', padding: '1px 8px', margin: '0 4px', background: '#F7D634' }} >Paid</button>
                    <button style={{ border: 'none', padding: '1px 8px', margin: '0 4px', background: '#1AF069' }} >Overdue</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </Table>

        </div>
      </div>
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
  return {
    props: { sessionData: dataone }
  }
}