import React from 'react';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import { parseInt } from 'lodash';
function InvoicePage({ data, serviceData }) {
    const from = data.Task.Taskassociations[0].Customer;
    const to = data.Task.Taskassociations[1].Customer;
    const taskIDs = data.Task.createdService.split(',');
    console.log('data', data.Task);
    console.log('data', data);
    console.log('serviceData', serviceData);
    let services = [];

    taskIDs.map((task) => {
        serviceData.forEach((service) => {
            if (service.id === task.trim()) {
                services.push(service);
            }
        });
    });

    let subtotal = 0;

    const getTotalWithDiscount = (index) => {
        let total = 0;
        for (let i = 0; i < serviceData[index].Servicecars.length; i++) {
            let divident = parseFloat(
                serviceData[0].Servicecars[i].estimate /
                (parseFloat(services[index].Servicecars[i].discount) > 0
                    ? services[index].Servicecars[i].discount
                    : serviceData[0].Servicecars[i].estimate)
            );
            total += parseFloat(
                serviceData[0].Servicecars[i].estimate -
                (divident == 1 ? 0 : divident)
            );
        }
        subtotal += total;
        return total;
    };

    console.log(services);

    return (
        <>
            <section className="invoiceSection">
                <div className="first">
                    <img src="/assets/images/bluelogo.png" alt="logo" />
                    <div>
                        <p>Order : #20013</p>
                        <p>Issued: {moment(data.createdAt).format('L')}</p>
                    </div>
                </div>

                <div className="invoiceAddress">
                    <div>
                        <h1>Invoice From</h1>
                        <p style={{ width: '400px' }}>
                            {from.f_name} {from.l_name} <br />
                            {from.address}
                        </p>
                    </div>
                    <div>
                        <h1>Invoice To</h1>
                        <p style={{ width: '400px' }}>
                            {to.f_name} {to.l_name} <br />
                            {to.address}
                        </p>
                    </div>
                </div>

                <div className="paymentMethod">
                    <h1>Payment Method</h1>
                    <p>{data.pay_method ? data.pay_method : '-'}</p>
                </div>
                <div className="recomendation">
                    <h1>Recommendation</h1>
                    <p>{data.recommendation ? data.recommendation : '-'}</p>
                </div>
                <Table responsive className="table2">
                    <thead>
                        <tr>
                            <th>Description</th>

                            <th>Discount</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service, index) => {
                            return (
                                <tr key={index}>
                                    <td>{service.name}</td>

                                    <td>{service.Servicecars[0].discount}%</td>
                                    <td>${getTotalWithDiscount(index).toFixed(2)}</td>
                                </tr>
                            );
                        })}

                        <tr>
                            <td style={{ border: "none" }} ></td>

                            <td>Subtotal</td>
                            <td>${subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ border: "none" }} ></td>

                            <td>Tax</td>
                            <td>-{data.Task.tax}%</td>
                        </tr>
                        <tr>
                            <td style={{ border: "none" }} ></td>

                            <td>Total Amount</td>
                            <td>
                                $
                                {(
                                    subtotal -
                                    subtotal * (data.Task.tax / 100)
                                ).toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </section>
            {data.status == '0' && (
                <div className="sendInvoice">
                    <button>Send Invoice</button>
                </div>
            )}
        </>
    );
}

InvoicePage.getInitialProps = async ({ query: { id } }) => {
    var myHeaders = new Headers();
    myHeaders.append('id', id);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    const res = await fetch(
        'https://treasure-island-server.herokuapp.com/invoices/getById',
        requestOptions
    );
    const data = await res.json();
    const serviceRes = await fetch(
        'https://treasure-island-server.herokuapp.com/services/getServices',
        requestOptions
    );
    const serviceData = await serviceRes.json();

    return { data, serviceData };
};
export default InvoicePage;
