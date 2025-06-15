import React, { useState, useEffect } from 'react';
import TotalRooms from "../assets/totalRooms.png";
import TotalSales from "../assets/totalSale.png";
import TotalOrders from "../assets/totalOrder.png";
import { CiEdit } from "react-icons/ci";
import { Modal, Button, Form, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import Toast from 'react-bootstrap/Toast';

interface DashboardCard {
  title: string;
  img: string;
  values: string;
  label: string;
  color: "success" | "danger";
}
 
const Dashboard: React.FC = () => { 

  type food = {
      title: string;
      price: number;
      quantity: number;
    };
     type OrderLists = {
      id: string;
      name: string;
      mobile: string;
      roomNumber: number;
      guestId: string;
      amount: number;
      date: string;
      status: string;
      _id: string;
      foods:food[];
    }; 
  const [OrderList, setOrderList] = useState<OrderLists[]>([]);
  const [ShowFood, setShowFood] = useState<OrderLists[]>([]);

  const FoodsClose = () => setFoods(false);
  const FoodsShow = () => setFoods(true);
  
  const [show, setShow] = useState(false);
  const[foods, setFoods] = useState(false);
  const [rooms, setRooms] = useState<number>(10);
  const [roomsInput, setRoomsInput] = useState<number>(10);
  const handleClose = () =>{ setErr(""); setShow(false); };
  const handleShow = () => setShow(true);
  const[countOrder, setCountOrder] = useState(0);
  const [amount, setAmount] = useState(0);
  const[err, setErr] = useState<string>('');
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);

  useEffect(() => {
  axios.get("http://localhost:5000/UserDetails", { withCredentials: true })
    .then(res => {
      setRooms(res.data.rooms);
      setRoomsInput(res.data.rooms);
      const primeStatus = res.data.subscripe;
      if(primeStatus === false){
         axios.post("http://localhost:5000/UnSubscriped", {}, { withCredentials: true })
          .then(res => {
            console.log(res.data.message);
            setRooms(10);
            setRoomsInput(10);
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    })
    .catch(e => {
      console.log(e);
    });
}, []);

 useEffect(() => {
  axios.get("http://localhost:5000/TotalAmount", { withCredentials: true })
    .then(res => {
      const orders = res.data.orders;
      const total = orders.reduce((sum: number, order: any) => {
        return sum + order.amount;
      }, 0);
      setAmount(total);
    })
    .catch(err => console.log(err));
}, []);

    useEffect(() => {
      axios.get("http://localhost:5000/CountOrderFoodList", {withCredentials: true})
          .then(res => {
            setCountOrder(res.data);
          })
          .catch(err => console.log(err));
    },[]);

    useEffect(() => {
     axios.get("http://localhost:5000/OrderFoodListPending",{
      withCredentials: true,
     }).then(res => {
        setOrderList(res.data);
     }).catch((err) => {console.log(err)})
     },[]);

const SaveRooms = () => {
  axios
    .patch("http://localhost:5000/SetRooms", { roomsInput }, { withCredentials: true })
    .then((res) => {
      console.log(res.data.message);
      setRooms(roomsInput);
      handleClose();
    })
    .catch((e) => {
     // console.log(e);
      setErr(e.response?.data?.message || "Failed to update rooms");
      toggleShowA();
    });
};

  function showFoods(_id: string){
    axios.get(`http://localhost:5000/showOrderFoods`, {
      params: { _id },
      withCredentials: true,
    }).then(res => {
      setShowFood(res.data);
    }).catch((err) => console.log(err));
    FoodsShow();
  };
  const dashTable: DashboardCard[] = [
    { title: "Total Rooms", img: TotalRooms, values: `${rooms}`, label: "Only 5 Rooms available", color: "success" },
    { title: "Total Orders", img: TotalOrders, values: `${countOrder}`, label: "1.5% Up from past week", color: "success" },
    { title: "Total Sales", img: TotalSales, values: `₹${amount}`, label: "4.3% Down from yesterday", color: "danger" },
  ];

  return (
    <div className="container-fluid">
      {/* Dashboard Cards */}
      <button className="btn btn-outline-light btn-sm border-0 float-end shadow-lg mx-2" onClick={handleShow}><CiEdit className="fs-3 text-danger"/></button>
      <div className="d-flex justify-content-around flex-column flex-lg-row gap-3 gap-lg-0 my-2">
        {dashTable.map(({ title, img, values, label, color }, index) => (
          <div key={index} className="rounded-4 col-lg-3 py-2 bg-light shadow-lg">
            <div className="d-flex justify-content-around align-items-center">
              <p className="fs-5 text-secondary">{title}</p>
              <img src={img} alt={`${title} icon`} className="img-fluid" />
            </div>
            <p className="fs-2 fw-bold text-center">{values}</p>
            <p className={`text-center pt-3 text-${color}`}>{label}</p>
          </div>
        ))}
      </div>
      
        <ToastContainer position="top-center" className="p-3">
          <Toast show={showA} onClose={toggleShowA} bg='danger' delay={3000} autohide>
            <Toast.Body className="text-light">
              {err}
            </Toast.Body>
          </Toast>
        </ToastContainer>

          <Modal show={show} onHide={handleClose} centered >
            <Modal.Header closeButton>
              <Modal.Title>Total Rooms</Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center'>
              <Form.Group className="mb-2">
                <Form.Label>Enter the total number of Rooms</Form.Label>
                <Form.Control 
                  type="number" 
                  name="rooms" 
                  value={roomsInput} 
                  onChange={(e) => setRoomsInput(Number(e.target.value))}
                />
              </Form.Group>
              <strong className='text-danger'>{err}</strong>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                variant="primary" 
                onClick={SaveRooms}
                disabled={rooms <= 0}
                >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

             <Modal 
              show={foods} 
              onHide={FoodsClose} 
              centered
              >
              <Modal.Header closeButton>
                <Modal.Title>Ordered Food list's:</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="table-responsive border">
                <table className="table table-striped table-bordered align-middle">
               <thead className="border">
                <tr className="text-center">
                  <th scope="col">Name</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
               <tbody className="table-group-divider">
                {ShowFood.map((order, orderIndex) =>
                order.foods.map((item, index) => (
                 <tr key={`${orderIndex}-${index}`} className="text-center">
                   <td>{item.title}</td>
                   <td>{item.quantity}</td>
                   <td>{`Rs. ${item.price}`}</td>
                 </tr>
                ))
              )}
               </tbody>
              </table>
            </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={FoodsClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

      {/* Order Details Table */}
      <div className="rounded-4 my-5 mx-4 px-lg-5 px-1 py-2 col-12 bg-light mx-auto shadow-lg">
        <p className="h5 my-4">Order Details:</p>
        <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="border">
            <tr className='text-center'>
              <th scope="col">Room No</th>
              <th scope="col">Date - Time</th>
              <th scope="col">Mobile no</th>
              <th scope="col">Foods</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
            {OrderList.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={8} className="text-center text-secondary py-4">
                    "No orders are Pending"
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
              {OrderList.map((order, index) => 
              (
                <tr key={index} className="text-center">
                 <td>{order.roomNumber}</td>
                 <td>{order.date}</td>
                 <td>{order.mobile}</td>
                 <td>
                  <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => showFoods(order._id)}
                  >
                  Show
                  </button>
                </td>
                <td>
                  <div className="p-1 bg-danger border text-light rounded-2">
                    {order.status}
                  </div>
                </td>
                </tr>
               )
              )}
              </tbody>
            )}
        </table>
       </div>
      </div>
    </div>
  );
};

export default Dashboard;
