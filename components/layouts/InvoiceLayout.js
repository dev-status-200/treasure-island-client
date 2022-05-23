import React, { useState } from 'react';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, FormSelect, Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import Router from 'next/router';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
const InvoiceLayout = ({ invoice, orders, services }) => {
  const getServiceName = (index) => {
    const idArray = invoice[index].Task.createdService.split(',');
    return services.filter((x) => x.id === idArray[0])[0].name;
  };

  const rows = [];
  invoice.forEach((x) => {
    const a = orders.orders.find((item) => {
      return item.id === x.TaskId;
    });
    rows.push({ invoice: x, order: a });
  });

  const [payMethod, setPayMethod] = useState();
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState();

  const action = (action, id) => {
    if (action == 'view') {
      Router.push(`/invoices/${id}`);
    } else if (action === 'payAmount') {
      setShow(true);
    }
  };

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const setOverdue = (id) => {
    var raw = JSON.stringify({
      id: id,
      status: '2',
      pay_date: '',
      pay_method: '',
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://treasure-island-server.herokuapp.com/invoices/editInvoice',
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error('error', error));
  };

  const payAmount = () => {
    var raw = JSON.stringify({
      id: selectedId,
      status: '1',
      pay_date: new Date().toLocaleDateString(),
      pay_method: payMethod,
    });

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://treasure-island-server.herokuapp.com/invoices/editInvoice',
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error('error', error));
  };

  const statusDisplay = (id) => {
    switch (id) {
      case '0':
        return 'Unpaid';
      case '1':
        return 'Paid';
      case '2':
        return 'Overdue';
    }
  };
  const colorDisplay = (id) => {
    switch (id) {
      case '0':
        return '#F7D634';
      case '1':
        return '#1AF069';
      case '2':
        return '#F62323';
    }
  };

  const [numberOfRecords, setnumberOfRecords] = useState(4);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormSelect onChange={(e) => setPayMethod(e.target.value)}>
            <option value="EFT">EFT</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
          </FormSelect>
          <Button
            style={{ marginTop: '1rem' }}
            onClick={() => {
              payAmount();
              setShow(false);
              window.location.reload();
            }}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
      <div className="iheader">
        <h4>Invoices</h4>

        <div className="invoiceTable" style={{ paddingTop: '50px' }}>
          <div className="excel">
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button"
              table="table-to-xls"
              filename="tablexls"
              sheet="tablexls"
              buttonText="🖨️"
            />
          </div>
          <Table id="table-to-xls" responsive>
            <thead>
              <tr>
                <th>Service</th>
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
              {rows
                .slice(pageIndex, numberOfRecords)
                .map((row, index) => {
                  return (
                    <tr key={index}>
                      <td>{getServiceName(index)}</td>
                      <td>{row.invoice.TaskId.slice(0, 8)}..</td>
                      <td>{row.invoice.customer_name}</td>
                      <td>
                        {moment(row.invoice.createdAt).format('L')}
                      </td>
                      <td>${row.invoice.amount}</td>
                      <td>
                        <p
                          style={{
                            background: colorDisplay(
                              row.invoice.status
                            ),
                            display: 'flex',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        >
                          {statusDisplay(row.invoice.status)}
                        </p>
                      </td>
                      <td>
                        {row.invoice.paid_on &&
                          moment(row.invoice.paid_on).format('L')}
                      </td>
                      <td>
                        <select
                          onChange={(e) => {
                            action(e.target.value, row.invoice.id);
                            setSelectedId(row.invoice.id);
                            if (e.target.value == 'overDue') {
                              setOverdue(row.invoice.id);
                              window.location.reload();
                            }
                          }}
                        >
                          <option value="">Choose Action</option>
                          <option value="view">View</option>
                          {row.invoice.status !== '1' && (
                            <>
                              <option value="payAmount">
                                Pay Amount
                              </option>
                              {row.invoice.status !== '2' && (
                                <option value="overDue">
                                  Overdue
                                </option>
                              )}
                            </>
                          )}
                        </select>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <div>
            <span>
              <button
                className="paginate-btn"
                style={{ border: 'none', padding: '4px 8px' }}
                onClick={() => {
                  if (pageNo !== 1) {
                    setnumberOfRecords((numberOfRecords -= 4));
                    setPageIndex((pageIndex -= 4));
                    setPageNo((pageNo -= 1));
                  }
                }}
              >
                {'<'}
              </button>
            </span>
            <span> | {pageNo} | </span>
            <span>
              <button
                className="paginate-btn"
                style={{ border: 'none', padding: '4px 8px' }}
                onClick={() => {
                  if (rows.length > numberOfRecords) {
                    setnumberOfRecords((numberOfRecords += 4));
                    setPageIndex((pageIndex += 4));
                    setPageNo((pageNo += 1));
                  }
                }}
              >
                {' '}
                {'>'}
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceLayout;
