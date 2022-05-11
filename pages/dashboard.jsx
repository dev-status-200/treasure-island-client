import React, { useRef, useState, useEffect } from 'react'
import Dashboard from '../components/layouts/dashboard'
import axios from 'axios'
import Cookies from 'cookies'
import Router from 'next/router'
import { AiFillEdit, AiTwotoneDelete, AiFillEye, AiFillDollarCircle } from 'react-icons/ai'
import { BsFillHandbagFill, BsFillPersonLinesFill } from 'react-icons/bs'
import { IoPersonSharp } from 'react-icons/io5'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
);

import moment from 'moment'


export const options = {
  responsive: true,
};

export const stackedBarOption = {
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  }
}

var labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var dates = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
var years = ['2022', '2021']
const Dashboards = ({ mainChartData, recentOrdersData, salesAnalysisData, ordersInfoData, topBarInfo }) => {

  const [selectedDrop, setSelectedDrop] = useState('Monthly')
  const [selectedServiceDrop, setSelectedServiceDrop] = useState('Monthly')
  const [selectedYear, setSelectedYear] = useState('2022');

  const ordersdata = labels.map(x => ({ x: x, y: 0 }))
  mainChartData.orders.forEach(x => {
    const monthIndex = moment(x.createdAt).month();
    ordersdata[monthIndex].y += 1;
  })
  const salesdata = labels.map(x => ({ x: x, y: 0 }))
  mainChartData.sales.forEach(x => {
    const monthIndex = moment(x.createdAt).month();
    salesdata[monthIndex].y += 1;
  })

  const dailyOrders = dates.map(x => ({ x: x, y: 0 }))
  mainChartData.orders.forEach(x => {
    const DayIndex = moment(x.createdAt).date();
    dailyOrders[DayIndex].y += 1;
  })

  // const yearlyOrders = years.map(x => ({ x: x, y: 0 }))
  // mainChartData.orders.forEach(x => {
  //   const YearIndex = moment(x.createdAt).year();
  //   yearlyOrders[YearIndex].y += 1;
  // })

  // const yearlySales = years.map(x => ({ x: x, y: 0 }))
  // mainChartData.sales.forEach(x => {
  //   const YearIndex = moment(x.createdAt).year();
  //   yearlySales[YearIndex].y += 1;
  // })





  const dailySales = dates.map(x => ({ x: x, y: 0 }))
  mainChartData.sales.forEach(x => {
    const salesIndex = moment(x.createdAt).date();
    dailySales[salesIndex].y += 1;
  })



  const service1Data = labels.map(x => ({ x: x, y: 0 }))
  salesAnalysisData.customerOrders.forEach(x => {
    if (x.service === 'Service 1') {
      const monthIndex = moment(x.createdAt).month();
      service1Data[monthIndex].y += 1;
    }
  })

  const dailyService1 = dates.map(x => ({ x: x, y: 0 }))
  salesAnalysisData.customerOrders.forEach(x => {
    if (x.service === 'Service 1') {
      const dayIndex = moment(x.createdAt).month();
      dailyService1[dayIndex].y += 1;
    }
  })
  const dailyService2 = dates.map(x => ({ x: x, y: 0 }))
  salesAnalysisData.customerOrders.forEach(x => {
    if (x.service === 'Service 2') {
      const dayIndex = moment(x.createdAt).month();
      dailyService2[dayIndex].y += 1;
    }
  })

  const service2Data = labels.map(x => ({ x: x, y: 0 }))
  salesAnalysisData.customerOrders.forEach(x => {
    if (x.service === 'Service 2') {
      const monthIndex = moment(x.createdAt).month();
      service2Data[monthIndex].y += 1;
    }
  })

  const barData = {

    datasets: [
      {
        label: 'Service 1',
        data: selectedServiceDrop === 'Monthly' ? service1Data : dailyService1,
        backgroundColor: 'rgba(23, 51, 232,1)',
      },
      {
        label: 'Service 2',
        data: selectedServiceDrop === 'Monthly' ? service2Data : dailyService2,
        backgroundColor: 'rgb(13, 219, 89)',
      },
    ],
  };

  const data = {
    datasets: [
      {
        label: "Orders",
        data: selectedDrop === 'Monthly' ? ordersdata : dailyOrders,

        fill: true,
        borderWidth: 3,
        tension: 0.3,
        backgroundColor: "rgba(23, 51, 232,0.2)",
        borderColor: "rgba(23, 51, 232,1)"
      },
      {
        label: "Sales",
        data: selectedDrop === 'Monthly' ? salesdata : dailySales,
        borderColor: "rgb(13, 219, 89)",
        backgroundColor: "rgba(13, 219, 89,0.2)",
        fill: true,
        borderWidth: 3,
        tension: 0.3,
      }
    ],
  };


  const piedata = {

    datasets: [
      {
        label: 'Orders',
        data: [ordersInfoData.newOrders, ordersInfoData.completedOrders, ordersInfoData.pendingOrders],
        backgroundColor: [
          "rgba(23, 51, 232,1)",
          'rgb(13, 219, 89)',
          'rgba(232, 19, 196, 1)',

        ],
        borderColor: [
          "rgba(23, 51, 232,1)",
          'rgb(13, 219, 89)',
          'rgba(232, 19, 196, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='dashboard'>
      <section className='square-container' >
        <div className='square' >
          <div>
            <h3 className='square-title' >Total Orders</h3>
            <p className='square-amount' >{topBarInfo.orders.length}</p>
          </div>
          <div className='mini-box' >
            <BsFillHandbagFill style={{ fontSize: "30px", color: "coral" }} />
          </div>
        </div>
        <div className='square' >
          <div>
            <h3 className='square-title' >Total Earning</h3>
            <p className='square-amount' >${topBarInfo.earnings[0].amount}</p>
          </div>
          <div className='mini-box' >
            <AiFillDollarCircle style={{ fontSize: "34px", color: "green" }} />
          </div>
        </div>
        <div className='square' >
          <div>
            <h3 className='square-title' >Total Customers</h3>
            <p className='square-amount' >{topBarInfo.customers.length}</p>
          </div>
          <div className='mini-box' >
            <BsFillPersonLinesFill style={{ fontSize: "30px", color: "black" }} />
          </div>
        </div>
        <div className='square' >
          <div>
            <h3 className='square-title' >Total Users</h3>
            <p className='square-amount' >{topBarInfo.users.length}</p>
          </div>
          <div className='mini-box' >
            <IoPersonSharp style={{ fontSize: "30px", color: "navy" }} />
          </div>
        </div>

      </section>


      <section className='graph-section' style={{ paddingTop: '80px' }} >
        <div className='main-graph' >
          <div className='main-graph-header' >
            <h3>Sales Figures</h3>
            <select onChange={(e) => {
              setSelectedDrop(e.target.value)
            }} defaultValue='Monthly' >
              <option value="Daily">Daily</option>
              <option value="Monthly">Monthly</option>
            </select>
            {/* {
              selectedDrop === 'Monthly' && (
                <select onChange={(e) => setSelectedYear(e.target.value)} defaultValue='2022' >
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              )
            } */}
          </div>
          <Line data={data} className='linegraph' options={options} height="400px" width='700px' />
        </div>
        <div className='pie-chart' >
          <Pie data={piedata} />
          <div className='pie-info'>
            <div><span>New Orders</span><span>{ordersInfoData.newOrders}</span></div>
            <div><span>Completed</span><span>{ordersInfoData.completedOrders}</span></div>
            <div><span>Pending</span><span>{ordersInfoData.pendingOrders}</span></div>
          </div>
        </div>
      </section>

      <section className='sales-analysis' >
        <div className='main-graph-header' >
          <h3>SERVICE ANALYSIS</h3>
          <select onChange={(e) => {
            setSelectedServiceDrop(e.target.value)
          }} defaultValue='Monthly' >
            <option value="Daily">Daily</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
        <Bar className='barGraph' data={barData} options={stackedBarOption} />

      </section>

      <section className='orders-table' style={{ margin: '100px auto' }} >
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>

              <th>#ID</th>
              <th>Service</th>
              <th>Customer</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              recentOrdersData.orders.map((order, index) => {
                return <tr className='bodyrow' key={index} >
                  <td>{order.id.slice(0, 6)}</td>
                  <td>{order.service}</td>
                  <td>{order.Taskassociations[0].Customer.f_name}</td>
                  <td>{order.Taskassociations[0].User.f_name}</td>
                  <td>{order.status}</td>
                  <td>{moment(order.createdAt).format('L')}</td>
                  <td>
                    <div className='actions' >
                      <AiFillEye style={{ color: 'blue' }} />
                      <AiFillEdit style={{ color: 'yellow' }} />
                      <AiTwotoneDelete style={{ color: 'red' }} />
                    </div>
                  </td>
                </tr>
              })
            }
            <tr>

            </tr>
          </tbody>
        </table>
      </section>
      <footer>
        Copyright © 2022 <span>Treasure Island</span>. Designed by <span>Inofist</span> | All rights reserved
      </footer>


    </div>
  )
}


export default Dashboards

export const getServerSideProps = async () => {
  const res = await fetch(`https://treasure-island-server.herokuapp.com/dashboard/salesChartInfo`);
  const orderRes = await fetch(`https://treasure-island-server.herokuapp.com/dashboard/recentOrders`);
  const salesAnalysisRes = await fetch(`https://treasure-island-server.herokuapp.com/dashboard/salesAnalysis`);
  const ordersInfoRes = await fetch(`https://treasure-island-server.herokuapp.com/dashboard/ordersInfo`);
  const topBarInfoRes = await fetch(`https://treasure-island-server.herokuapp.com/dashboard/topBarInfo`)
  const mainChartData = await res.json();
  const recentOrdersData = await orderRes.json();
  const salesAnalysisData = await salesAnalysisRes.json();
  const ordersInfoData = await ordersInfoRes.json();
  const topBarInfo = await topBarInfoRes.json();
  return {
    props: { mainChartData, recentOrdersData, salesAnalysisData, ordersInfoData, topBarInfo },
  };
}