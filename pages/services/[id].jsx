import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FormControl, Button, InputGroup } from 'react-bootstrap';
import Router from 'next/router'
import { AiFillDelete, AiFillEdit, AiOutlineSearch } from 'react-icons/ai'
import { Modal, Form, FormSelect } from 'react-bootstrap'
import Select from 'react-select'
function Service({ serviceData, parts, id }) {
  const [show, setShow] = useState(false);
  const [editInfo, setEditInfo] = useState({});
  const [newInfo, setnewInfo] = useState({});
  const [selectedId, setSelectedId] = useState()
  const [sendParts, setSendParts] = useState();
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  const [newCarShow, setNewCarShow] = useState(false);
  const [rows, setRows] = useState(serviceData.Servicecars);
  const [partsList, setPartsList] = useState();
  const [partsListIds, setPartsListIds] = useState([]);

  console.log(parts);
  const deleteCar = id => {
    axios.post(`https://treasure-island-server.herokuapp.com/services/deleteServiceCar`, { carId: id }).then(() => {
      Router.reload();
    }).catch(err => {
      console.error(err);
      alert('Something went wrong')
    })
  }

  const getPartIds = index => {
    return serviceData.Servicecars[index].parts.split(',')
  }


  const carParts = index => {
    const arr = []
    parts.filter(part => getPartIds(index).map(p => {
      if (p.trim().length > 0 && (p.trim() === part.id)) {
        console.log(part);
        arr.push(part)
      }
    }))
    return arr
  }


  const changeHandler = e => {
    setEditInfo(x => ({ ...x, [e.target.name]: e.target.value }));
  }
  const newchangeHandler = e => {
    setnewInfo(x => ({ ...x, [e.target.name]: e.target.value }));
  }

  const submitHandler = e => {
    e.preventDefault();
    const body = { ...editInfo, carId: selectedId, parts: sendParts };
    axios.post(`https://treasure-island-server.herokuapp.com/services/editService`, body).then((result => {
      console.log(result);
      Router.reload();
      setShow(false)
    }))
  }

  let temp = []

  partsListIds.map(e => temp.push({ value: e }))

  let body = { ...newInfo, ServiceId: id, parts: temp };
  const newsubmitHandler = e => {
    e.preventDefault();
    console.log(id);
    axios.post(`https://treasure-island-server.herokuapp.com/services/addCar`, body).then((result => {
      console.log(result);
      alert('New car added')
      Router.reload();
      setNewCarShow(false)
    })).catch(err => console.error(err))
  }

  useEffect(() => {

    setPartsList(parts);
    let tempState = [];
    parts.forEach((x) => {
      tempState.push({
        label: `${x.part_number} (${x.brand_name} ${x.part_name}) $ ${x.cost}`,
        value: x.id,
      });
    });
    setPartsList(tempState);
  }, []);

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler} >
            <Form.Group  >
              <Form.Label>
                Manufacturer
              </Form.Label>
              <Form.Control type='text' defaultValue={serviceData.Servicecars[selectedCarIndex].make} name="make" onChange={changeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Model No.
              </Form.Label>
              <Form.Control type='text' defaultValue={serviceData.Servicecars[selectedCarIndex].model} name="model" onChange={changeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                From Year
              </Form.Label>
              <Form.Control type='year' name="from" defaultValue={serviceData.Servicecars[selectedCarIndex].from} onChange={changeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                To Year
              </Form.Label>
              <Form.Control type='year' name="to" defaultValue={serviceData.Servicecars[selectedCarIndex].to} onChange={changeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Parts Cost
              </Form.Label>
              <Form.Control type='text' name="partsCost" defaultValue={serviceData.Servicecars[selectedCarIndex].partsCost} onChange={changeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Labout Cost
              </Form.Label>
              <Form.Control type='text' name="labourCost" defaultValue={serviceData.Servicecars[selectedCarIndex].labourCost} onChange={changeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Discount
              </Form.Label>
              <Form.Control type='text' name="discount" defaultValue={serviceData.Servicecars[selectedCarIndex].discount} onChange={changeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Estimate
              </Form.Label>
              <Form.Control type='text' name="estimate" defaultValue={serviceData.Servicecars[selectedCarIndex].estimate} onChange={changeHandler} />
            </Form.Group>
            <Button
              type='submit'
              style={{ marginTop: '1rem' }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={newCarShow} onHide={() => setNewCarShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Car</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={newsubmitHandler} >
            <Form.Group  >
              <Form.Label>
                Manufacturer
              </Form.Label>
              <Form.Control type='text' name="make" onChange={newchangeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Model No.
              </Form.Label>
              <Form.Control type='text' name="model" onChange={newchangeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                From Year
              </Form.Label>
              <Form.Control type='year' name="from" onChange={newchangeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                To Year
              </Form.Label>
              <Form.Control type='year' name="to" onChange={newchangeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Parts Cost
              </Form.Label>
              <Form.Control type='text' name="partsCost" onChange={newchangeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Labout Cost
              </Form.Label>
              <Form.Control type='text' name="labourCost" onChange={newchangeHandler} />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Parts
              </Form.Label>
              <Select
                defaultValue={'Country'}
                isMulti
                name="colors"
                options={partsList}
                onChange={(e) => {

                  setPartsListIds(e.map(x => x.value))
                }}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Discount
              </Form.Label>
              <Form.Control type='text' name="discount" onChange={newchangeHandler} />
            </Form.Group>
            <Form.Group  >
              <Form.Label>
                Estimate
              </Form.Label>
              <Form.Control type='text' name="estimate" onChange={newchangeHandler} />
            </Form.Group>
            <Button
              type='submit'
              style={{ marginTop: '1rem' }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <div className='csContainer' >

        <div className='changeHeader' >
          <h5 style={{ fontWeight: "bolder" }} >Oil Change Service</h5>
          <div style={{ display: "flex" }} >
            <div >
              <Button onClick={() => setNewCarShow(true)} >Add New Car</Button>
              <span>
                <FormControl
                  style={{
                    width: '300px',
                    float: 'right',
                    backgroundColor: '#f4f6fd',
                    paddingLeft: '35px',
                    border: 'none',
                    borderRadius: '0px',
                  }}
                  onChange={e => {
                    let searchInput = e.target.value.toLowerCase();
                    if (searchInput.length > 0) {
                      setRows(rows.filter(r => (r.make.slice(0, searchInput.length).toLowerCase() === searchInput) || (r.model.slice(0, searchInput.length).toLowerCase() === searchInput)))
                    } else {
                      setRows(serviceData.Servicecars)
                    }
                  }}
                  type="text"
                  placeholder='Search ...'
                />
              </span>
              <span>
                <AiOutlineSearch

                  style={{
                    float: 'right',
                    position: 'relative',
                    left: '28px',
                    top: '10px',
                    color: 'grey',
                  }}
                />
              </span>

            </div>
            <Button style={{ borderRadius: "2px" }} >Search</Button>
          </div>
        </div>
        {
          rows.map((s, i) => {
            return <>
              <section key={i}>

                <div className='service' >
                  <div className="service-head">
                    <p>{s.make}</p>
                    <p>{s.model}</p>
                    <p>{s.from}-{s.to}</p>
                  </div>
                  <div className="service-body">
                    <h6>Parts</h6>
                    <div className="lists">
                      {
                        carParts(i).map((part, index) => {
                          return <>
                            <div key={index} >
                              <p>{part.part_number}</p>
                              <p>x</p>
                            </div>
                          </>
                        })
                      }

                    </div>
                  </div>
                  <div className="service-footer">
                    <div className='info' >
                      <p>Audi <span> ${s.partsCost}</span></p>
                      <p>Labor Cost    <span>${s.labourCost}</span></p>
                      <p>Discount   <span>${s.discount}</span></p>
                    </div>
                    <div className='total' >
                      <p>Total Estimate Cost   <span>${s.estimate}</span></p>
                    </div>
                  </div>
                  <div className="actionButtons">
                    <div>
                      <AiFillEdit onClick={() => {
                        setShow(true);
                        setSendParts(s.parts)
                        setSelectedId(s.id)
                        setSelectedCarIndex(i)
                      }} style={{ color: "blue", fontSize: "20px", cursor: "pointer" }} />

                    </div>
                    <div>
                      <AiFillDelete onClick={() => deleteCar(s.id)} style={{ color: "red", fontSize: "20px", cursor: "pointer" }} />
                    </div>
                  </div>
                </div>
              </section>

            </>
          })
        }
      </div>




    </>
  )
}

Service.getInitialProps = async ({ query: { id } }) => {
  var myHeaders = new Headers();
  myHeaders.append("id", id);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };



  const serviceRes = await fetch("https://treasure-island-server.herokuapp.com/services/getServiceById", requestOptions);
  const getParts = await fetch("https://treasure-island-server.herokuapp.com/parts/getParts", requestOptions);
  const serviceData = await serviceRes.json();
  const parts = await getParts.json();

  return { serviceData, parts, id }
}

export default Service;
