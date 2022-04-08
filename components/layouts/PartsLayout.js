import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Table, Modal, Button, Form, Spinner, FormControl } from 'react-bootstrap'
import { AiFillDelete, AiFillEdit, AiFillEye ,AiOutlineSearch, AiFillEyeInvisible } from "react-icons/ai";
import axios from 'axios'
import Cookies from 'js-cookie'
import NumberFormat from "react-number-format";
import { useRouter } from 'next/router'

const PartsLayout = ({parts}) => {
    
    const [partList, setPartList] = useState([]);

    useEffect(() => {
        console.log(parts);
        setPartList(parts);
    }, [])

    const[id, setId] = useState('');
    const[partNumber, setPartNumber] = useState('');
    const[partName, setPartName] = useState('');
    const[brandName, setBrandName] = useState('');
    const[qty, setQty] = useState(0);
    const[cost, setCost] = useState(0);
    const[description, setDescription] = useState('');

    const [partNoWarn, setPartNoWarn] = useState(false);
    const [load, setLoad] = useState(false);

    const [deleteView, setDeleteView] = useState(false);
    const [edit, setEdit] = useState(false);

    const clearFields = () => {
        setPartNumber('');setPartName(''); setBrandName(''); setQty(0); setCost(0); setDescription('');
    }
    const addAgent = (e) => {
        e.preventDefault();
        setLoad(true);
        let warn = false;
        partList.forEach((z, index)=>{
            if(z.part_number.toLowerCase()==partNumber.toLowerCase()){
                setPartNoWarn(true);
                warn=true;
                setLoad(false);
            }
        })
        if(warn==false){
            axios.post(process.env.NEXT_PUBLIC_TI_ADD_PART,{
                partNumber:partNumber,
                partName:partName,
                brandName:brandName,
                qty:qty,
                cost:cost,
                description:description,
                addedBy:Cookies.get('loginId')
            }).then((x)=>{
                console.log(x.data)
                if(!x.data==''){
                    let tempState = [...partList];
                    tempState.push(x.data);
                    setPartList(tempState);
                    handleClose()
                }
                setLoad(false);
            })
        }
    }
    const editPart = (e) => {
        e.preventDefault();
        setLoad(true);
        let warn = false;
        partList.forEach((z, index)=>{
            if(z.id!=id && z.part_number==partNumber){
                setPartNoWarn(true);
                warn=true;
                setLoad(false);
            }
        })
        if(warn==false){
            axios.put(process.env.NEXT_PUBLIC_TI_EDIT_PARTS,{
                id:id,
                partNumber:partNumber,
                partName:partName,
                brandName:brandName,
                qty:qty,
                cost:cost,
                description:description,
                updatedBy:Cookies.get('loginId')
            }).then((x)=>{
                setLoad(false);
                if(x.data[0]=='1'){
                    let tempState = [...partList];
                    tempState.forEach((y, index)=>{
                        if(y.id==id){
                            y.part_number=partNumber;
                            y.part_name=partName;
                            y.brand_name=brandName;
                            y.qty=qty;
                            y.cost=cost;
                            y.description=description;
                            y.updatedBy=Cookies.get('loginId');
                        }
                    })
                    setPartList(tempState);
                    handleClose();
                }
            })
        }
    }
    const deletePart = () => {
        setLoad(true);
        axios.post(process.env.NEXT_PUBLIC_TI_DELETE_PARTS,{id:id}).then((x)=>{
            if(x.data[0]=='1'){
                let tempState = [...partList];
                tempState = tempState.filter((z)=>{
                    if(z.id!=id){
                        return x
                    }
                })
                setDeleteView(false);
                setLoad(false);
                setPartList(tempState);
            }
        })
    }
    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false); clearFields(); setEdit(false); setPartNoWarn(false);};
    const handleShow = () => {setShow(true)};

    const editFields = (val) => {
        setEdit(true); setId(val.id); setPartNumber(val.part_number); setPartName(val.part_name); setCost(val.cost);
        setBrandName(val.brand_name); setQty(val.qty); setDescription(val.description); setShow(true);
    }
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState((partList.length/10));
    const [startIndex, setStartIndex] = useState(0)

    const [increment, setIncrement] = useState(false);

    useEffect(() => {
        setTotalPages(partList.length/10);
    }, [partList])
    
    useEffect(() => {
        console.log(startIndex)
        if(page===1){
            setStartIndex(0);
        }else if(page>1){
            increment==true?setStartIndex(startIndex+10):setStartIndex(startIndex-10)
        }
    }, [page])
  return (
    <div className='mechanic-styles'>
    <Row>
    <Col><span style={{color:'grey'}}> Parts </span><button className='global-btn mx-2' onClick={handleShow}> Add new</button></Col>
    </Row>
    <Container className='box mt-3 p-3'>
    <div style={{minHeight:'450px'}}>
    <Table responsive="sm">
    <thead>
      <tr>
        <th>Part No.</th>
        <th>Part Name</th>
        <th>Brand Name</th>
        <th>Quantity</th>
        <th>Cost</th>
        <th>Description</th>
        <th>Modify</th>
      </tr>
    </thead>
    <tbody>
        {
            partList.slice(startIndex, startIndex+10).map((part, index)=>{
                return(
                    <tr key={index} className='rows'>
                        <td>{part.part_number}</td>
                        <td>{part.part_name}</td>
                        <td>{part.brand_name}</td>
                        <td>{part.qty}</td>
                        <td>{part.cost} $</td>
                        <td>{part.description}</td>
                        <td>
                            <AiFillEdit className='yellow icon-trans' onClick={()=>{editFields(part);}} />
                            <AiFillDelete className='red icon-trans' onClick={()=>{setId(part.id); setDeleteView(true)}}/>
                        </td>
                    </tr>
                )
            })
        }
    </tbody>
  </Table>
    </div>
  <div>
  <span>
      <button className='paginate-btn' 
          onClick={()=>{
              if(page>1){
                  setIncrement(false);
                  setPage(page-1);
              }
          }}
      >{"<"} PREV</button>
  </span>
  <span> | {page}  | </span>
  <span><button className='paginate-btn' onClick={()=>{
      setIncrement(false);
      if(page<totalPages){
          setIncrement(true);
          setPage(page+1);
      }
  }}> NEXT {">"}</button> </span>
  </div>
    </Container>
    <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
        <Modal.Title>{edit?"Edit Part":"Add New Part"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={edit?editPart:addAgent}>
        <Row>
            <Col>
                <Form.Group className="mb-3" >
                    <Form.Label>Part No.</Form.Label>
                    <input 
                        type="text" placeholder="Part No..." required value={partNumber} onChange={(e)=>setPartNumber(e.target.value)} 
                        style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                    />
                    {partNoWarn==true && <Form.Text style={{color:'crimson'}}> Part No. Not Unique  </Form.Text>}
                </Form.Group>
            </Col>
            <Col>
                <Form.Group className="mb-3" >
                    <Form.Label>Part Name</Form.Label>
                    <input 
                        style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                        type="text" placeholder="Part Name..." required value={partName} onChange={(e)=>setPartName(e.target.value)}
                    />
                </Form.Group>                
            </Col>
        </Row>      
        <Row>
            <Col>
                <Form.Group className="mb-3">
                    <Form.Label>Brand Name</Form.Label>
                    <input
                    style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                    type="text" required placeholder="Brand..." value={brandName} onChange={(e)=>setBrandName(e.target.value)} />
                </Form.Group>
            </Col>
            <Col>
                <Form.Group className="mb-3" >
                    <Form.Label>Quantity</Form.Label>
                    <input
                    style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                    type="number" required placeholder="Quantity..." value={qty} onChange={(e)=>setQty(e.target.value)} />
                </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
            <Form.Group className="mb-3" >
                <Form.Label>Cost</Form.Label>
                <input
                style={{border:'1px solid silver', borderRadius:'5px', width:"100%", height:'39px', paddingLeft:'15px'}}
                type="number" required placeholder="Cost..." value={cost} onChange={(e)=>setCost(e.target.value)} />
            </Form.Group>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Group className="mb-3" controlId="Address">
                    <Form.Label>Description</Form.Label>
                    <textarea 
                    style={{border:'1px solid silver', borderRadius:'5px', width:"100%", paddingLeft:'15px'}}
                    rows="3" placeholder="Description..." required value={description} onChange={(e)=>setDescription(e.target.value)}/>
                </Form.Group>
            </Col>
        </Row>
            <Button variant="primary" type="submit">
                {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:'Save'}
            </Button>
        </Form>
        </Modal.Body>
    </Modal>
    <Modal show={deleteView} onHide={()=>setDeleteView(false)} >
        <Modal.Header closeButton>
        <Modal.Title>Delete Mechanic</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Are You Sure You Want To Delete?
            </Modal.Body>
        <Modal.Footer>
            <Button variant='danger' onClick={deletePart}>
                {load==true?<Spinner className='mx-4' as="span" animation="border" size="sm" role="status" aria-hidden="true"/>:'Confirm'}
            </Button>
        </Modal.Footer>
    </Modal>
    </div>
  )
}

export default PartsLayout