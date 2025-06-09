import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const InvoicePage: React.FC = () => {
  type Food = {
    title: string;
    price: number;
    quantity: number;
  };

  type OrderLists = {
    guestId: string;
    status: string;
    amount: number;
    date: string;
    foods: Food[];
    _id: string;
  };

  type GuestDetails = {
    _id: string;
    name: string;
    mobile: string;
    email?: string;
    roomNumber: number;
    guests: number;
    checkIn: string;
    checkOut: string;
    stay: string;
    amount: number;
    payment: string;
  };

  const [guestDetail, setGuestDetail] = useState<GuestDetails[]>([]);
  const [guestOrdersMap, setGuestOrdersMap] = useState<{ [key: string]: number }>({});
  const [orders, setOrders] = useState<OrderLists[]>([]);
  const [showOrder, setShowOrder] = useState<boolean>(false);
  const [paymentShow, setPaymentShow] = useState<boolean>(false);
  const [alertShow, setAlertShow] = useState<GuestDetails>();

  const handleCloseOrder = () => setShowOrder(false);
  const handleShowOrder = () => setShowOrder(true);

  const handleClosePayment = () => setPaymentShow(false);
  const handleShowPayment = () => setPaymentShow(true);

  useEffect(() => {
    axios.get<GuestDetails[]>("http://localhost:5000/guests", { withCredentials: true })
      .then(res => {
        setGuestDetail(res.data);
        const guestIds = res.data.map((guest: GuestDetails) => guest._id);

        return Promise.all(
          guestIds.map((id: string) =>
            axios.get<OrderLists[]>(`http://localhost:5000/orders/guest/${id}`, { withCredentials: true })
              .then(res => ({ guestId: id, orders: res.data }))
              .catch(() => ({ guestId: id, orders: [] }))
          )
        );
      })
      .then(orderResults => {
        const orderMap: { [key: string]: number } = {};
        const allOrders: OrderLists[] = [];

        orderResults.forEach(({ guestId, orders }) => {
          orderMap[guestId] = orders.length;
          allOrders.push(...orders);
        });
        setGuestOrdersMap(orderMap);
      })
      .catch(err => console.error("Error fetching guest/orders", err));
  }, []);

  useEffect(() => {
  axios.put("http://localhost:5000/sync/guest-amounts", {}, { withCredentials: true })
    .then(res => {
      console.log(res.data.message);
      return axios.get<GuestDetails[]>("http://localhost:5000/guests", { withCredentials: true });
    })
    .then(res => {
      setGuestDetail(res.data);
    })
    .catch(err => console.error("Sync failed", err));
}, []);

 function ShowOrders(_id: string) {
  axios.get("http://localhost:5000/OrderFoodListDelivered", {
      params: { _id },
      withCredentials: true,
    })
    .then((res) => {
      setOrders(res.data);
      handleShowOrder();
    })
    .catch((err) => {
      console.log(err);
    });
}
 function alertPayment(_id: string){
  axios.get("http://localhost:5000/PaymentAlert", {
      params: { _id },
      withCredentials: true,
    })
    .then((res) => {
      setAlertShow(res.data);
      //console.log(res.data);
      handleShowPayment();
    })
    .catch((err) => {
      console.log(err);
    });
 }
 function PaymentStatus(_id: string) {
 axios.patch("http://localhost:5000/PaymentStatus", null, {
  params: { _id },
  withCredentials: true,
})
  .then((res) => {
    console.log(res.data.message);
    handleClosePayment();
    return axios.get<GuestDetails[]>("http://localhost:5000/guests", { withCredentials: true });
  })
  .then(res => setGuestDetail(res.data))
  .catch((err) => {
    console.log(err);
  });
}

  return (
    <div className="container-fluid rounded-4 my-3 px-lg-5 px-1 py-2 col-12 bg-light mx-auto mx-4 shadow-lg">
      <h5 className="my-4">Invoice:</h5>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="border text-center">
            <tr>
              <th>Guest Name</th>
              <th>Room No</th>
              <th>Mobile</th>
              <th>Total Orders</th>
              <th>View Orders</th>
              <th>Total Amount</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {guestDetail.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-secondary py-4">
                  No Guest Ordered
                </td>
              </tr>
            ) : (
              guestDetail.map((guest, index) => (
                <tr key={index} className="text-center">
                  <td>{guest.name}</td>
                  <td>{guest.roomNumber}</td>
                  <td>{guest.mobile}</td>
                  <td>{guestOrdersMap[guest._id] || 0}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => ShowOrders(guest._id)} >View</button>
                  </td>
                  <td>₹{guest.amount.toFixed(2)}</td>
                  <td>
                    {guest.payment === "Pending" ? (
                      <button className="btn btn-sm btn-danger" onClick={() => alertPayment(guest._id)}>Pending</button>
                    ) : (
                      <button className="btn btn-sm btn-success" disabled>Paid</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Modal show={showOrder} onHide={handleCloseOrder}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <div className="table-responsive border">
          <table className="table table-striped table-bordered align-middle">
         <thead className="border">
          <tr className="text-center">
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
         <tbody className="table-group-divider">
          {orders.map((order, orderIndex) =>
          order.foods.map((item, index) => (
           <tr key={`${orderIndex}-${index}`} className="text-center">
             <td>{item.title}</td>
             <td>{order.date}</td>
             <td>{item.quantity}</td>
             <td>{`Rs. ${item.price}`}</td>
             <td>{`Rs. ${item.price * item.quantity}`}</td>
           </tr>
          ))
        )}
         </tbody>
        </table>
      </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseOrder}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={paymentShow} onHide={handleClosePayment}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Confirmation Alert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alertShow ? (
            <>
              <p><span className="fw-bold">Guest Name:</span> {alertShow.name}</p>
              <p><span className="fw-bold">Mobile Number:</span> {alertShow.mobile}</p>
              <p><span className="fw-bold">Room Number:</span> {alertShow.roomNumber}</p>
              <hr />
              <p><span className="fw-bold">💰 Total Amount to be Paid:</span> ₹{alertShow.amount.toFixed(2)}</p>
    
            <Button variant="success" onClick={() => PaymentStatus(alertShow._id)}>
              Mark as Paid
            </Button>
            </>
          ) : (
            <p>Loading guest details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePayment}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
         <p className='text-center text-secondary'>If click the "Pending" button, to change the Payment status to "Paid".</p>
    </div>
  );
};

export default InvoicePage;
