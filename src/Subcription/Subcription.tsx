import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Button } from 'react-bootstrap';

const Subscription = () => {
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

  const [profileDetails, setProfileDetails] = useState<Profile[]>([]);
  const[email, setEmail] = useState<string>();
  const[prime, setPrime] = useState<boolean>(false);
  const[changeId, setChangeId] = useState<string>('');

  const [conformation, setConformation] = useState(false);
  const handleClose = () => setConformation(false);
  function handleShow(id: string) {
    setConformation(true);
    setChangeId(id);
  } 

  useEffect(() => {
    axios
      .get("http://localhost:5000/SubcripedUser")
      .then((res) => {
        setProfileDetails(res.data);
      })
      .catch((e) => {
        console.error("Error fetching subscribed users:", e);
      });
  }, []);

   useEffect(() => {
    axios
    .get("http://localhost:5000/UserDetails", {withCredentials: true})
    .then(res => {
      setPrime(res.data.subscripe);
    }).catch((err) => {
      console.log(err);
    })
  },[]);

  useEffect(() => {
    axios
    .get("http://localhost:5000/profile", {withCredentials: true})
    .then(res => {
      setEmail(res.data.email);
    }).catch((err) => {
      console.log(err);
    })
  },[]);
 const fetchUser = () => {
  axios
      .get("http://localhost:5000/SubcripedUser")
      .then((res) => {
        setProfileDetails(res.data);
      })
      .catch((e) => {
        console.error("Error fetching subscribed users:", e);
      });
 };

  function ActiveSubscripe() {
  axios.post("http://localhost:5000/ActiveSubscripe", {
    id: changeId,
  })
  .then(res => {
    console.log(res.data.message);
    setChangeId('');
    fetchUser;
    handleClose();
  })
  .catch(err => {
    console.log(err.message);
  });
};

  return (
    <div className="container-fluid rounded-4 my-1 mx-4 px-lg-5 px-1 py-2 col-12 bg-light mx-auto shadow-lg">
      <p className="h5 my-3">Subscription</p>
      {email === "iknotdigitalsolution@gmail.com" ? (
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="border">
            <tr className="text-center">
              <th scope="col">User</th>
              <th scope="col">Email</th>
              <th scope="col">Mobile</th>
              <th scope="col">Rooms</th>
              <th scope="col">Subscription</th>
              <th scope="col">Hotel</th>
              <th scope="col">Address</th>
            </tr>
          </thead>
          <Modal
            show={conformation}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
          >
              <Modal.Header closeButton>
              <Modal.Title>Conformation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="fw-bold text-center border bg-body-secondary ">Subscription</p>
              <p className="text-center font-monospace">"Once the payment is successfully completed, update the subscription status accordingly."</p>
              <p className="text-center text-danger fst-italic">Thank you for Conforming!</p>
              <p>{changeId}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={ActiveSubscripe}>Activate</Button>
            </Modal.Footer>
          </Modal>
          <tbody>
            {profileDetails.map((profile) => (
              <tr key={profile.id} className="text-center">
                <td>{profile.user}</td>
                <td>{profile.email}</td>
                <td>{profile.mobile}</td>
                <td>{profile.rooms}</td>
                <td>
                  {/* {profile.subscripe === true ? (
                  <button className="btn btn-success" disabled>Active</button>
                  ) : (
                  <button className="btn btn-danger" onClick={() => handleShow(profile.id)}>Inactive</button>
                  )} */}
                  {profile.email === "iknotdigitalsolution@gmail.com" ? (
                    <button className="btn btn-warning text-light" disabled>Admin</button>
                  ) : ( profile.subscripe === true ? (
                    <button className="btn btn-success" disabled>Active</button>
                  ) : (
                    <button className="btn btn-danger" onClick={() => handleShow(profile.id)}>Inactive</button>
                  ))}
                </td>
                <td>{profile.hotel}</td>
                <td>{profile.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className='text-center text-secondary'>If click the "Inactive" button, to change the subscribe status to "Active".</p>
      </div>
      
      ):(
       <div>
        {prime === false ? (
         <p className="text-center text-danger fs-5 fw-bold"><mark className="bg-warning">" Your account subscription has expired. Please renew to continue enjoying our services. "</mark></p>
        ) : (
          <p className="text-center text-danger fs-5 fw-bold"><mark className="bg-success">" Your account has been successfully subscribed. You can now enjoy all our services and features. "</mark></p>
        )}
       </div>
      )}
    </div>
  );
};

export default Subscription;
