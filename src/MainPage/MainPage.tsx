import { useEffect, useState } from "react";
import logo from '../assets/logo.png';
//import user from '../assets/user.png';
import bell from '../assets/bell.png';
import dash from '../assets/dashboard-icon.png';
import foods from "../assets/foods-icon.png";
import heart from "../assets/wishlist.png";
import money from "../assets/money-icon.png";
import order from "../assets/orderList-icon.png";
import rooms from "../assets/bed.png";
import Container from 'react-bootstrap/Container';
import FoodsPage from "../FoodsPage/FoodsPage";
import Dashboard from "../Dashboard/Dashboard";
import OrderListPage from "../OrderListPage/OrderListPage";
import InvoicePage from "../InvoicePage/InvoicePage";
import ReviewPage from "../ReviewPage/ReviewPage";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { Modal, Button, Form } from 'react-bootstrap';
import RoomBookingPage from "../RoomBooking/RoomBookingPage";
import G_Letter from "../assets/gold.png";
import Subscription from "../Subcription/Subcription";
//import { TbHexagonLetterG } from "react-icons/tb";

const MainPage: React.FC = () => {

  type Profile = {
   id: string;
   user: string;
   email: string;
   mobile: string;
   hotel: string;
   rooms: number;
   address: string;
   subscripe: boolean;
  };
    const [profileDetails, setProfileDetails] = useState<Profile | null>(null);
    const navigate = useNavigate();
    const[userName, setUserName] = useState('');
    const[mail, setMail] = useState('');
    const[mobile, setMobile] = useState('');
    const[hotelName, setHotelName] = useState('');
    const[address, setAddress] = useState('');
   
    useEffect(() => {
      axios.get('http://localhost:5000/profile', {withCredentials: true})
      .then( res => {
        setUserName(res.data.name);
        setMail(res.data.email)
      })
    },[]);

     const initial = userName ? userName.charAt(0).toUpperCase() : '?';
     useEffect(() => {
      axios.get("http://localhost:5000/UserDetails", {withCredentials: true})
      .then(res => {
       // console.log(res.data);
        setProfileDetails(res.data);
      })
      .catch(e => {
        console.log(e);
      })
     },[]);

    function Logout() {
      axios.post('http://localhost:5000/logout', {withCredentials: true})
      .then(res => {
        console.log(res);
        setUserName('');
        setMail('')
        setMobile('');
        setHotelName('');
        setAddress('');
        navigate("/login")
      })
    }
    
     const [activeLink, setActiveLink] = useState('#dashboard');
      const menuItems = [
        { href: '#dashboard', img: dash, label: 'Dashboard' },
        { href: '#foods', img: foods, label: 'Foods' },
        { href: '#review', img: heart, label: 'Reviews' },
        { href: '#orderList', img: order, label: 'Order Lists' },
        { href: '#invoice', img: money, label: 'Invoice' },
        { href: '#roombook', img: rooms, label: 'Rooms' },
        { href: '#subcription', img: G_Letter, label: 'Subcription' },
      ];

      const handleClick = (href : string) => {
        setActiveLink(href); 
      };

      const [notify, setNotify] = useState(false);
      const CloseNotification = () => setNotify(false);
      const ShowNotification = () => setNotify(true);

      const [showProfile, setShowProfile] = useState(false);
      const handleCloseProfile = () => setShowProfile(false);
      const handleShowProfile = () => setShowProfile(true);
      const[isPrime, setIsPrime] = useState<boolean>(false);

      function GotoGuest(){
        navigate('/guest')
      };

      const [showEdit, setShowEdit] = useState(false);
      const handleCloseEdit = () =>{
        setShowEdit(false);
        setMobile('');
        setHotelName('');
        setAddress('');
      } 
      const handleShowEdit = () => setShowEdit(true);

      useEffect(() => {
        axios.get("http://localhost:5000/UserDetails", { withCredentials: true })
              .then(res => {
                setIsPrime(res.data.subscripe);
              });
      })
     
      const SaveProfile = () => {
        axios.post(
          "http://localhost:5000/ProfileDetails",
          {
            userName,
            mail,
            mobile,
            hotelName,
            address,
            subscripe: false,
          },
          { withCredentials: true }
        )
          .then((res) => {
            console.log(res.data.message);
            setMobile('');
            setHotelName('');
            setAddress('');
            handleCloseEdit();
            axios.get("http://localhost:5000/UserDetails", { withCredentials: true })
              .then(res => {
                setProfileDetails(res.data);
                setIsPrime(res.data.subscripe);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      };


    return(
     <Container fluid>
    <nav className="d-flex justify-content-between border-bottom">
      <img src={logo} alt="logo" className="img-fluid" />
      <div className="d-flex me-lg-5 my-3 gap-lg-5 gap-4 align-items-center">
        <button className="btn btn-outline-danger btn-sm" onClick={GotoGuest}>guest</button>
        <a onClick={ShowNotification} href="#"><img src={bell} alt="bell icon" className="img-fluid p-2" /></a>
        <a href="#profile" onClick={handleShowProfile} className="text-decoration-none text-dark">
          {/* <img src={user} alt="user" className="img-fluid mx-1 border border-4 rounded-pill" /> */}
          {isPrime === true ? (
            <div
               className="bg-danger d-flex justify-content-center align-items-center text-light fw-bold fs-3 text-uppercase rounded-pill border-warning user-select-none position-relative top-25 start-50 border border-3 translate-middle-x shadow-lg"
                style={{
                  width: 50,
                  height: 50,
                }}
              >
                {initial}
          </div>
          ):(
            <div
               className="bg-danger d-flex justify-content-center align-items-center text-light fw-bold fs-3 text-uppercase rounded-pill border-secondary user-select-none position-relative top-25 start-50 border border-3 translate-middle-x shadow-lg"
                style={{
                  width: 50,
                  height: 50,
                }}
              >
                {initial}
            </div>
          )}
        </a>
      </div>
    </nav>
    
    <div className="row flex-nowrap sticky-top">
      <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-body-tertiary">
        <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 min-vh-100">
          <div className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start row gx-1 gy-2">
            {menuItems.map(({ href, img, label }) => (
              <a
                key={href}
                href={href}
                className={`nav-link align-middle px-lg-4 px-0 rounded-2 shadow-sm main-item ${
                  activeLink === href ? 'active' : ''
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(href);
                }}
              >
                <img
                  src={img}
                  alt={`${label.toLowerCase()} icon`}
                  className="img-fluid border-1 border-lg-0 p-lg-1 p-2 rounded-2"
                />
                <span className="ms-1 d-none d-sm-inline">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="col-10 py-3 bg-secondary bg-opacity-10">
          {activeLink === '#dashboard' && <Dashboard />}
          {activeLink === '#foods' && <FoodsPage />}
          {activeLink === '#review' && <ReviewPage/>}
          {activeLink === '#orderList' && <OrderListPage />}
          {activeLink === '#invoice' && <InvoicePage />}
          {activeLink === '#roombook' && <RoomBookingPage/> }
          {activeLink === '#subcription' && <Subscription/> }

          <Modal show={notify} onHide={CloseNotification}>
           <Modal.Header closeButton>
           <Modal.Title>Notification</Modal.Title>
           </Modal.Header>
           <Modal.Body>No message</Modal.Body>
          </Modal>

          <Modal
            show={showEdit}
            onHide={handleCloseEdit}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control name="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Hotel Name</Form.Label>
                  <Form.Control name="Hotel Name" value={hotelName} onChange={e => setHotelName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control name="Address" value={address} onChange={e => setAddress(e.target.value)} required/>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={SaveProfile}>Save</Button>
            </Modal.Footer>
          </Modal>

          <Offcanvas show={showProfile} onHide={handleCloseProfile} placement="end">
            <Offcanvas.Header className="border-bottom" closeButton>
             <Offcanvas.Title>Profile</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <button className="btn btn-outline-light btn-sm float-end shadow-lg mx-2" onClick={handleShowEdit}><CiEdit className="fs-5 text-primary"/></button>
               <div
               className="bg-primary d-flex justify-content-center align-items-center text-light fw-bold fs-1 text-uppercase rounded-pill user-select-none position-relative top-25 start-50 translate-middle-x shadow-lg"
                style={{
                  width: 80,
                  height: 80,
                }}
              >
                {initial}
              </div>
               {profileDetails ? (
                <div key={profileDetails.id}>
                  <p>Name: {profileDetails.user}</p>
                  <p>Email: {profileDetails.email}</p>
                  <p>Mobile: {profileDetails.mobile}</p>
                  <p>Hotel Name: {profileDetails.hotel}</p>
                  <p>Address: {profileDetails.address}</p>
                </div>
              ) : (
                <div className="text-center text-secondary my-4">
                  <p>"No details available."</p>
                  <p className="text-muted">Please click the edit button to fill the details.</p>                </div>
              )}
              <button className="btn btn-danger rounded-1 position-absolute bottom-0 start-50 translate-middle-x my-3" onClick={Logout}>Log Out</button>
            </Offcanvas.Body>
          </Offcanvas>

      </div>
    </div>
  </Container>
    );
}
export default MainPage;