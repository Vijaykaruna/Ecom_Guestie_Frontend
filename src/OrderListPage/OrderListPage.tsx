import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { IoCheckmarkSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";

const OrderListPage: React.FC = () => {
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
const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
   axios.get("http://localhost:5000/OrderFoodList",{
    withCredentials: true,
   }).then(res => {
    setOrderList(res.data);
   }).catch((err) => {console.log(err)})
   },[]);

function showFoods(_id: string){
  axios.get(`http://localhost:5000/showOrderFoods`, {
    params: { _id },
    withCredentials: true,
  }).then(res => {
    setShowFood(res.data);
  }).catch((err) => console.log(err));
  handleShow();
};

function UpdateDelivery(_id: string) {
  axios.patch("http://localhost:5000/updateStatus",
    { status: "Delivered" },
    {
      withCredentials: true,
      params: { _id }
    }
  )
  .then(() => {
    setOrderList(prev =>
      prev.map(order =>
        order._id === _id ? { ...order, status: "Delivered" } : order
      )
    );
  })
  .catch((err) => {
    console.error("Failed to update stay status", err);
    alert("Failed to update stay status");
  });
}

function UpdateRejected(_id: string) {
  axios.patch("http://localhost:5000/updateStatus",
    { status: "Rejected" },
    {
      withCredentials: true,
      params: { _id }
    }
  )
  .then(() => {
    setOrderList(prev =>
      prev.map(order =>
        order._id === _id ? { ...order, status: "Rejected" } : order
      )
    );
  })
  .catch((err) => {
    console.error("Failed to update stay status", err);
    alert("Failed to update stay status");
  });
}

  return (
    <div className="container-fluid rounded-4 my-3 mx-4 px-lg-5 px-1 py-2 col-12 bg-light mx-auto shadow-lg">
      <p className="h5 my-5">Order List:</p>
      <Modal 
        show={show} 
        onHide={handleClose} 
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
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="table-responsive">
      <table className="table table-striped table-bordered align-middle">
        <thead className="border">
          <tr className="text-center">
            <th scope="col">Name</th>
            <th scope="col">Room No</th>
            <th scope="col">Date</th>
            <th scope="col">Mobile</th>
            <th scope="col">Foods</th>
            <th scope="col">Status</th>
            <th scope="col">Guest Id</th>
          </tr>
        </thead>
        {OrderList.length === 0 ? (
           <tbody>
            <tr>
              <td colSpan={8} className="text-center text-secondary py-4">
                "No order"
              </td>
            </tr>
          </tbody>
        ) : (
        <tbody className="table-group-divider">
         { OrderList.map((list, index) => (
          <tr key={index} className="text-center">
          <td>{list.name}</td>
          <td>{list.roomNumber}</td>
          <td>{list.date}</td>
          <td>{list.mobile}</td>
          <td>
            <button className="btn btn-sm btn-primary" onClick={() => showFoods(list._id)}>
              Show
            </button>
          </td>
          <td>
            {list.status === "Delivered" || list.status === "Rejected" ? (
              list.status === "Delivered" ? (
                  <div className="p-1 bg-success border text-light text-center rounded-2">
                    {list.status}
                  </div>
              ) : (
                 <div className="p-1 bg-danger border text-light text-center rounded-2">
                   {list.status}
                  </div>
              )
            ) : (
              <>
                <p className="text-danger text-center">{`"${list.status}"`}</p>
                <div className="d-flex justify-content-evenly">
                  <button
                    onClick={() => UpdateDelivery(list._id!)}
                    className="ms-1 btn btn-sm btn-success"
                  >
                    <IoCheckmarkSharp />
                  </button>
                  <button
                    onClick={() => UpdateRejected(list._id!)}
                    className="ms-1 btn btn-sm btn-danger"
                  >
                    <FaXmark />
                  </button>
                </div>
              </>
            )}
          </td>
          <td>{"..." + list.guestId.slice(-5)}</td>
         </tr>
         ))
         }
        </tbody>
      )}
      </table>
     </div>
      <p className='text-center text-secondary my-1'>"<IoCheckmarkSharp />" - Delivered || "<FaXmark />" - Rejected</p>
    </div>
  );
};

export default OrderListPage;
