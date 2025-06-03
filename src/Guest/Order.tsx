import logo from "../assets/logo.png";
import Dosa from "../assets/dosa.png";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";

const useQuery = () => new URLSearchParams(useLocation().search);

const Order = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const mobileNo = query.get("mobile");
  const guestId = query.get("guestId");

   type foodItems = {
    id: string;
    title: string;
    category: string;
    price: number;
    _id: string;
    quantity: number;
    mobile: string;
    roomNumber: number;
    guestId: string;
  };

  const[orderFoods, setOrderFoods] = useState<foodItems[]>([]);
  const[total, setTotal] = useState<number>(0);
  const [show, setShow] = useState(false);
  const[name, setName] = useState<string>("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

useEffect(() => {
  if (!mobileNo || !guestId) return;

  axios.get("http://localhost:5000/guestName", {
    params: { mobile: mobileNo },
    withCredentials: true,
  })
  .then(res => {
    setName(res.data.name);
  })
  .catch((err) => {
  if (err.response?.status === 404) {
    setName("Guest Not Found");
  } else if (err.response?.status === 401) {
    setName("Unauthorized");
  }
  console.log(err);
});

}, [mobileNo, guestId]);

  useEffect(() => {
  if (!mobileNo) return;

  axios.get("http://localhost:5000/SelectedFoods", {
      params: { mobile: mobileNo },
      withCredentials: true,
    })
    .then((res) => {
      const data: foodItems[] = res.data; 
      setOrderFoods(data);
      const totalAmount = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(totalAmount);    
     })
    .catch((err) => console.log(err));
}, [mobileNo]);

function GoBack(){
axios.delete("http://localhost:5000/ClearFoods", {
  data: { guestId },
  withCredentials: true,
})
.then(res => {
  console.log(res);
  navigate("/guest");
})
.catch(err => console.log(err));
}

function OrderFoods() {
  const now = new Date();
  const formattedDateTime = now.toLocaleString();

  const payload = {
    mobile: mobileNo,
    name: name,
    guestId: guestId,
    roomNumber: orderFoods[0]?.roomNumber || 0,
    amount: total,
    date: formattedDateTime,
    foods: orderFoods.map(item => ({
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    })),
  };

  axios.post("http://localhost:5000/AddOrderFoods", payload, { withCredentials: true })
    .then(res => {
      console.log("Order success:", res.data);
      return axios.delete("http://localhost:5000/ClearFoods", {
        data: { guestId },
        withCredentials: true,
      });
    })
    .then(res => {
      console.log("Cleared foods:", res.data);
      navigate(`/orderlist?guestId=${guestId}`);
    })
    .catch(err => console.error("Order failed:", err));
  }

    return(
   <div className="container">
       <div className="border-secondary border-1 border-bottom px-4">
            <a href="#profile"><img src={logo} alt="logo" className="img-fluid" /></a>
        </div>
        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Conformation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="fw-bold text-center border bg-body-secondary ">{`Total Amount: Rs.${total}`}</p>
          <p className="text-center font-monospace">"You can pay the amount when you check out; it will be added to your room bill."</p>
          <p className="text-center text-danger fst-italic">Thank you for ordering!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={OrderFoods}>Order</Button>
        </Modal.Footer>
      </Modal>
        <div className="container-fluid">
           <div className="d-flex justify-content-between align-items-center border-bottom">
              <p className="p-2 mt-3 text-decoration-underline fw-bold"><span>Total Amount:</span>{` Rs ${total}`}</p>   
              <button className="btn btn-outline-danger" onClick={GoBack}>Back</button>
           </div>
           <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="border text-center">
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>  
                    <th scope="col">Quantity</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider text-center">
                  {orderFoods.map((item) =>(
                   <tr key={item._id}>
                    <td><img src={Dosa} alt="food image" className="img-fluid" /></td>
                    <td>{item.title}</td>
                    <td>{`Rs.${item.price}`}</td>
                    <td>{item.quantity}</td>
                    <td>{item.quantity * item.price}</td>
                   </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 position-absolute bottom-0 start-50 translate-middle-x">
              <button className="btn btn-danger px-5" onClick={handleShow}>Order</button>
            </div>
        </div>
   </div>
    );
};
export default Order;