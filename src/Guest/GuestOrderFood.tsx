import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import trolly from "../assets/trolley.png";
import Dosa from "../assets/dosa.png";
import Form from 'react-bootstrap/Form';
import axios from "axios";
import Toast from 'react-bootstrap/Toast';
import { ToastContainer } from "react-bootstrap";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import {useNavigate} from "react-router-dom";
import { MdReportProblem } from "react-icons/md";

const GuestOrderFood: React.FC = () => {
  const navigate = useNavigate();
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

  const[breakFastFoods, setBreakFastFoods] = useState<foodItems[]>([]);
  const[dinnerFoods, setDinnerFoods] = useState<foodItems[]>([]);
  const[lunchFoods, setLunchFoods] = useState<foodItems[]>([]);
  const[refreshmentFoods, setRefreshmentFoods] = useState<foodItems[]>([]);
  const[selectedCategory, setSelectedCategory] = useState("breakfast");
  const[roomNumber, SetRoomNumber] = useState(0);
  const[mobile, setMobile] = useState("");
  const[cart, setCart] = useState<foodItems[]>([]);
  const[count, setCount] = useState(0); 
  const[verify, setVerify] = useState<boolean>(false);
  const[errVerify, setErrVerify] = useState<string>('');
  const[guestId, setGuestId] = useState<string>('guest');
  const isRoomSelected = () => roomNumber !== 0;

  const [showA, setShowA] = useState(true);
  const toggleShowA = () => setShowA(!showA);
  const [show, setShow] = useState(false);


  const handleClose = () => {
    setMobile("");
    setShow(false)
    setVerify(false);
    setErrVerify('');
  };
  const handleShow = () => {
     if (roomNumber === 0) {
        toggleShowA();
        return;
     }
       setShow(true);
  }
const VerifyGuest = () => {
  axios.post("http://localhost:5000/verifyGuest", {
    mobile,
    roomNumber,
  }, {
    withCredentials: true, 
  })
  .then((res) => {
    if (res.data.success) {
      console.log("Guest verified");
      setVerify(true);
      setGuestId(res.data.guestId)
    } else {
      console.log("Guest not verified");
      setErrVerify("Not matched guest details");
      setVerify(false);
    }
  })
  .catch((err) => {
    console.error("Verification error:", err);
    setVerify(false);
  });
};

const AddFoodsItems = (item: foodItems) => {
  if (!isRoomSelected()) {
  toggleShowA();
  return;
}

  const existingItem = cart.find((i) => i._id === item._id);
  let updatedCart: foodItems[] = [];

  if (existingItem) {
    updatedCart = cart.map((i) =>
      i._id === item._id
        ? { ...i, quantity: i.quantity + 1 }
        : i
    );
  } else {
    updatedCart = [...cart, { ...item, quantity: 1 }];
  }

  setCart(updatedCart);
  setCount(updatedCart.reduce((acc, curr) => acc + curr.quantity, 0));
};

const increaseQuantity = (item: foodItems) => {
  setCart(prevCart => {
    const existing = prevCart.find(cartItem => cartItem._id === item._id);
    if (existing) {
      return prevCart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: (cartItem.quantity as number) + 1 }
          : cartItem
      );
    } else {
      return [...prevCart, { ...item, quantity: 1 }];
    }
  });
};

const decreaseQuantity = (item: foodItems) => {
  setCart(prevCart => {
    const existing = prevCart.find(cartItem => cartItem._id === item._id);
    if (!existing) return prevCart;

    if ((existing.quantity as number) <= 1) {
      return prevCart.filter(cartItem => cartItem._id !== item._id);
    }

    return prevCart.map(cartItem =>
      cartItem._id === item._id
        ? { ...cartItem, quantity: (cartItem.quantity as number) - 1 }
        : cartItem
    );
  });
};

function GotoCartPage() {
  const payload = {
    roomNumber: roomNumber,
    mobile: mobile,
    guestId: guestId,
    cart: cart.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      price: item.price,
      quantity: item.quantity ?? 1,
    })),
  };

  axios.post("http://localhost:5000/addSelectedFoods", payload)
    .then((res) => {
      console.log("Server Response:", res.data);
      setCart([]);
      setCount(0);
      navigate(`/order?mobile=${mobile}&guestId=${guestId}`);
    })
    .catch((err) => {
      console.error("Failed to submit cart:", err);
    });
}

  useEffect(() => {
  const endpoints = [
    { key: "breakfast", url: "/listBreakfast", setter: setBreakFastFoods },
    { key: "lunch", url: "/listLunch", setter: setLunchFoods },
    { key: "dinner", url: "/listDinner", setter: setDinnerFoods },
    { key: "refreshment", url: "/listRefreshment", setter: setRefreshmentFoods }
  ];

  endpoints.forEach(({ url, setter }) => {
    axios.get(`http://localhost:5000${url}`, { withCredentials: true })
      .then((res) => setter(res.data))
      .catch((err) => console.error(`Error loading ${url}:`, err));
  });
}, []);
//  For complaits
  const [showReport, setShowReport] = useState<boolean>(false);

  const handleCloseReport = () => setShowReport(false);
  const handleShowReport = () => setShowReport(true);
  const [repoterRoom, setReporterRoom] = useState<number>(0);
  const [report, setReport] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('');

  const now = new Date();
  const formattedDateTime = now.toLocaleString();

    const AddReport = () => {
      axios.post("http://localhost:5000/AddReport", 
         {  guestId,
            comments: report,
            name: reporterName,
            date: formattedDateTime,
            roomNumber: repoterRoom,
            types: "Complait"
           },
        {withCredentials: true}
      ).then((res) => {
        console.log(res.data.message);
        setReport('');
        setReporterName('');
        setReporterRoom(0);
        handleCloseReport();
      }).catch((err) => {
        console.log(err);
      })
    };
    const [totalRooms, setTotalRooms] = useState<number>(10);
    
      useEffect(() => {
        axios.get("http://localhost:5000/Rooms", { withCredentials: true })
      .then(res => {
        setTotalRooms(res.data.data);
      }).catch(err => {
        console.log(err);
      });
      }, []);
    return(
      <div className="container">
        <div className="d-flex justify-content-between align-items-center border-secondary border-1 border-bottom px-4">
            <a href="#profile"><img src={logo} alt="logo" className="img-fluid" /></a>
              <div className="d-flex justify-content-between align-items-center gap-2">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                  <Tooltip>
                    <strong>Report</strong>
                  </Tooltip>}
                  >
                  <button className="btn btn-danger" onClick={handleShowReport}><MdReportProblem className="fs-5"/></button>
                </OverlayTrigger>
                 <div className="border border-secondary rounded-3 p-1">
                  <img src={trolly} alt="cart" /> 
                  {count > 0 ? (
                    <span id="orderId" className="badge text-bg-danger ms-2">{count}</span>
                  ):(
                    <span></span>
                  )}
                 </div>
              </div>

        </div>
        <div className="container-fluid bg-secondary bg-opacity-10 text-center shadow-lg">
        <div className="d-flex justify-content-between">
          <div className="col-lg-3 col-5 py-3">
          <Form.Select
            aria-label="Select food category"
            className="ps-4 border border-1 border-dark"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="breakfast">BreakFast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="refreshment">Refreshment</option>
          </Form.Select>
          </div>
          <div className="d-flex align-items-center gap-3">
                <p className="pt-3 fw-bold">RoomNo:</p>
             <Form.Select
              aria-label="Default select example"
              className="ps-4 border border-1 border-dark"
              value={roomNumber}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                SetRoomNumber(Number(e.target.value));
                setCart([]);
                setCount(0);
              }}
            >
              <option className="text-secondary" value={0}>Select Room</option>
              {Array.from({ length: totalRooms }, (_, i) => {
                const roomNumber = 100 + i;
                return (
                  <option key={roomNumber} value={roomNumber}>
                    {roomNumber}
                  </option>
                );
              })}
              </Form.Select>
            </div>
      </div>
      <ToastContainer position="middle-center" >
          <Toast show={showA} onClose={() => setShowA(false)} bg={"danger"} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Warning</strong>
          </Toast.Header>
          <Toast.Body className="fw-bold text-light">First select the Room no</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={show} onHide={handleClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <p className="ms-5">Enter Registered Mobile Number</p>
          <div className="d-flex justify-content-around align-items-center">
             <FloatingLabel controlId="floatingmobileNO" label="Mobile Number" className="col-8">
              <Form.Control type="tel" className="border-primary" placeholder="Enter your mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} required/>
            </FloatingLabel>
            {verify === false ? (
            <Button 
            className="btn btn-danger btn-sm" 
            onClick={VerifyGuest}
            disabled={!/^\d{10}$/.test(mobile)}
          >
            Check
          </Button>):(
          <IoCheckmarkCircleOutline className="text-success fs-1" />
          )}
          </div>
          {verify === false && (
            <p className="text-danger text-center">{errVerify}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={GotoCartPage} disabled={!verify || cart.length === 0}>
            Goto Cart
          </Button>
        </Modal.Footer>
      </Modal>

       <Modal show={showReport} onHide={handleCloseReport}>
        <Modal.Header closeButton>
          <Modal.Title>Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Room Number</Form.Label>
            <Form.Select name="roomNumber" value={repoterRoom} onChange={(e) => setReporterRoom(Number(e.target.value))} required>
              <option className="text-secondary" value={0}>Select Room</option>
              {Array.from({ length: totalRooms }, (_, i) => {
                const roomNumber = 100 + i;
                return (
                  <option key={roomNumber} value={roomNumber}>
                    {roomNumber}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={reporterName} onChange={(e) => setReporterName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Describe the Complaint</Form.Label>
             <FloatingLabel
              controlId="floatingTextarea"
              label="Comments"
              className="mb-3"
             >
            <Form.Control as="textarea" placeholder="Leave a comment here" value={report} onChange={(e) => setReport(e.target.value)} required/>
            </FloatingLabel>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={AddReport}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="tab-content text-dark mt-3" style={{height:"500px"}} >
        
        {selectedCategory === "breakfast" && (
          <div>
            <p className="text-decoration-underline h3 my-3">Breakfast Items</p>
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="border">
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th> 
                    <th scope="col">Quantity</th> 
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {breakFastFoods.map((item) => (
                  <tr key={item._id}>
                    <td><img src={Dosa} alt="food image" className="img-fluid" /></td>
                    <td>{item.title}</td>
                    <td>{`Rs.${item.price}`}</td>
                    <td className="d-flex gap-2 align-items-center justify-content-center py-4">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => decreaseQuantity(item)}
                        disabled={!cart.find(cartItem => cartItem._id === item._id)}
                      >
                        -
                      </button>
                      <span>{cart.find(cartItem => cartItem._id === item._id)?.quantity ?? 0}</span>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => increaseQuantity(item)}
                        disabled={!cart.find(cartItem => cartItem._id === item._id)}
                      >
                        +
                      </button>
                    </td>
                    <td>
                      {cart.find(cartItem => cartItem._id === item._id) ? (
                      <button className="btn btn-success btn-sm" disabled>
                            Added
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm px-3"
                            onClick={() => AddFoodsItems(item)}
                          >
                            Add
                          </button>
                        )}
                    </td>
                  </tr>
                ))} 
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedCategory === "lunch" && (
          <div>
            <p className="text-decoration-underline h3 my-3">Lunch Items</p>
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="border">
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th> 
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                {lunchFoods.map((item) => (
                    <tr key={item._id}>
                    <td><img src={Dosa} alt="food image" className="img-fluid" /></td>
                    <td>{item.title}</td>
                    <td>{`Rs.${item.price}`}</td>
                    <td className="d-flex gap-2 align-items-center justify-content-center py-4">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => decreaseQuantity(item)}
                        disabled={!cart.find(cartItem => cartItem._id === item._id)}
                      >
                        -
                      </button>
                      <span>{cart.find(cartItem => cartItem._id === item._id)?.quantity ?? 0}</span>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => increaseQuantity(item)}
                        disabled={!cart.find(cartItem => cartItem._id === item._id)}
                      >
                        +
                      </button>
                    </td>
                    <td>
                      {cart.find(cartItem => cartItem._id === item._id) ? (
                      <button className="btn btn-success btn-sm" disabled>
                            Added
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm px-3"
                            onClick={() => AddFoodsItems(item)}
                          >
                            Add
                          </button>
                        )}
                    </td>
                  </tr>
                  ))} 
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedCategory === "dinner" && (
          <div>
            <p className="text-decoration-underline h3 my-3">Dinner Items</p>
           <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="border">
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                {dinnerFoods.map((item) => (
                     <tr key={item._id}>
                    <td><img src={Dosa} alt="food image" className="img-fluid" /></td>
                    <td>{item.title}</td>
                    <td>{`Rs.${item.price}`}</td>
                     <td className="d-flex gap-2 align-items-center justify-content-center py-4">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => decreaseQuantity(item)}
                        disabled={!cart.find(cartItem => cartItem._id === item._id)}
                      >
                        -
                      </button>
                      <span>{cart.find(cartItem => cartItem._id === item._id)?.quantity ?? 0}</span>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => increaseQuantity(item)}
                        disabled={!cart.find(cartItem => cartItem._id === item._id)}
                      >
                        +
                      </button>
                    </td>
                    <td>
                      {cart.find(cartItem => cartItem._id === item._id) ? (
                      <button className="btn btn-success btn-sm" disabled>
                            Added
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm px-3"
                            onClick={() => AddFoodsItems(item)}
                          >
                            Add
                          </button>
                        )}
                    </td>
                  </tr>
                  ))} 
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedCategory === "refreshment" && (
          <div>
            <p className="text-decoration-underline h3 my-3">Refreshment Items</p>
           <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle">
                <thead className="border">
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                {refreshmentFoods.map((item) => (
                    <tr key={item._id}>
                    <td><img src={Dosa} alt="food image" className="img-fluid" /></td>
                    <td>{item.title}</td>
                    <td>{`Rs.${item.price}`}</td>
                     <td className="d-flex gap-2 align-items-center justify-content-center py-4">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => decreaseQuantity(item)}
                        disabled={!cart.find(cartItem => cartItem._id === item._id)}
                      >
                        -
                      </button>
                      <span>{cart.find(cartItem => cartItem._id === item._id)?.quantity ?? 0}</span>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => increaseQuantity(item)}
                        disabled={!cart.find(cartItem => cartItem._id === item._id)}
                      >
                        +
                      </button>
                    </td>
                    <td>
                      {cart.find(cartItem => cartItem._id === item._id) ? (
                      <button className="btn btn-success btn-sm" disabled>
                            Added
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm px-3"
                            onClick={() => AddFoodsItems(item)}
                          >
                            Add
                          </button>
                        )}
                    </td>
                  </tr>
                  ))} 
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
        <div className="p-3 position-absolute bottom-0 start-50 translate-middle-x">
          <button className="btn btn-danger px-5 shadow-lg" onClick={handleShow}>Goto Cart</button>
        </div>
        </div>
      </div>
)}

export default GuestOrderFood;