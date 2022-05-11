import React from 'react'
import { Table } from 'react-bootstrap';

function InvoicePage() {
    return (
        <>
            <section className='invoiceSection' >
                <div className="first">
                    <img src="/assets/images/white png logo.png" alt="logo" />
                    <div>
                        <p>Order : #20013</p>
                        <p>Issued: 20/07/2019</p>
                    </div>
                </div>

                <div className='invoiceAddress' >
                    <div>
                        <h1>
                            Invoice From
                        </h1>
                        <p>
                            Darren Elder <br />
                            806 Twin Willow Lane, Old Forge, <br />
                            Newyork, USA
                        </p>
                    </div>
                    <div>
                        <h1>
                            Invoice To
                        </h1>
                        <p>
                            Darren Elder <br />
                            806 Twin Willow Lane, Old Forge, <br />
                            Newyork, USA
                        </p>
                    </div>
                </div>

                <div className="paymentMethod">
                    <h1>
                        Payment Method
                    </h1>
                    <p>
                        Debit Card
                    </p>
                </div>
                <div className="recomendation">
                    <h1>
                        Recommendation
                    </h1>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit <br />
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit <br />
                    </p>
                </div>
                <Table responsive className='table2'>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>VAT</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>General Consultation</td>
                            <td>1</td>
                            <td>$0</td>
                            <td>$100</td>
                        </tr>
                        <tr>
                            <td>Video Call Booking</td>
                            <td>1</td>
                            <td>$0</td>
                            <td>$100</td>
                        </tr>
                        <tr>
                            <td>Video Call Booking</td>
                            <td>1</td>
                            <td>$0</td>
                            <td>$100</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td>Subtotal</td>
                            <td>$350</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td>$0</td>
                            <td>-$10%</td>
                        </tr>
                    </tbody>
                </Table>
            </section>
            <div className='sendInvoice' >
                <button>Send Invoice</button>
            </div>
        </>
    )
}

export default InvoicePage