import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import axios from "axios";

const useQuery = () => new URLSearchParams(useLocation().search);

const OrderDetails = () => {

  const navigate = useNavigate();
  const query = useQuery();
  const guestId = query.get("guestId");

  type food = {
    title: string;
    price: number;
    quantity: number;
  }

   type foodItems = {
    mobile: string;
    name: string;
    status: string;
    roomNumber: number;
    guestId: string;
    amount: number;
    date: string;
    foods:food[];
  };

   const [orderFoods,setOrderFoods] = useState<foodItems[]>([]);
   const [comments, setComments] = useState<string>('');
   const [showA, setShowA] = useState(false);
   const toggleShowA = () => setShowA(!showA);

   useEffect(() => {
   axios.get("http://localhost:5000/OrderFoods",{
    params:{guestId},
    withCredentials: true,
   }).then(res => {
    setOrderFoods(res.data);
   }).catch((err) => {console.log(err)})
   },[])
  function handleBack(){
    navigate('/guest')
  }
  const now = new Date();
  const formattedDateTime = now.toLocaleString();
  const AddComments = () => {
    axios.post("http://localhost:5000/AddReview", 
       {  guestId,
          comments,
          name: orderFoods[0].name,
          date: formattedDateTime,
          roomNumber: orderFoods[0].roomNumber,
          types: "Review",
         },
      {withCredentials: true}
    ).then((res) => {
      console.log(res.data.message);
      toggleShowA();
      setComments('');
    }).catch((err) => {
      console.log(err);
    })
  }
    return(
     <div className="container">
       <div className="border-secondary border-1 border-bottom px-4">
         <a href="#profile"><img src={logo} alt="logo" className="img-fluid" /></a>
        </div>
      <Col md={6} className="mb-2 mx-auto">
        <Toast show={showA} bg={"success"} onClose={toggleShowA} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>Review added Successfully</Toast.Body>
        </Toast>
      </Col>
        <div className="container-fluid">
          <p className="fw-bold">Order Details:</p>
           <div className="table-responsive my-4 border">
              <table className="table table-striped table-bordered align-middle">
                <thead className="border text-center">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>  
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider text-center">
                    {orderFoods.map((order, orderIndex) =>
                      order.foods.map((item, index) => (
                        <tr key={`${orderIndex}-${index}`}>
                          <td>{item.title}</td>
                          <td>{`Rs. ${item.price}`}</td>
                          <td>{item.quantity}</td>
                          <td>{`Rs. ${(item.quantity * item.price).toFixed(2)}`}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
              </table>
            </div>
        </div>
          <p className="text-center font-monospace text-secondary">"If you have any doubt, Please contact management"</p>
          <p className="text-center font-monospace text-secondary">"Contact Number : 98765 43210"</p>
           <div className="my-2 d-flex justify-content-center">
             <button className="btn btn-danger px-5" onClick={handleBack}>Foods Page</button>
          </div>
          <div>
            <form onSubmit={(e) => {
              e.preventDefault();
              AddComments();
            }}>
              <FloatingLabel controlId="floatingTextarea2" label="Comments">
                <Form.Control
                  as="textarea"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Leave a comment here"
                  style={{ height: '100px' }}
                  className="bg-secondary border border-dark bg-opacity-25"
                />
              </FloatingLabel>
              <button className="btn btn-sm btn-primary float-end m-1" type="submit">Submit</button>
            </form>
          </div>
     </div>
    )
}
export default OrderDetails;