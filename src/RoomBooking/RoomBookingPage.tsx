import React, { useState, useEffect } from 'react';
import GuestTable from './GuestTable';
import GuestFormModal from "./GuestFormModal";
import Button from 'react-bootstrap/Button';
import axios from 'axios';

interface Guest {
  name: string;
  mobile: string;
  email: string;
  roomNumber: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  stay: string;
  amount: number;
  payment: string;
}

const RoomBookingPage: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchGuests = () => {
    axios.get("http://localhost:5000/guests", {withCredentials: true})
      .then(res => setGuests(res.data))
      .catch(err => console.error("Failed to fetch guests", err));
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const addGuest = (_guest: Guest) => {
    fetchGuests();
    setShowModal(false);
  };

  return (
    <div className="container-fluid">
      <div className='rounded-4 my-3 px-lg-5 px-1 py-2 col-12 bg-light shadow-lg'>
        

        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="h5 my-4">Guest Details</p>
          <Button onClick={() => setShowModal(true)}>+ Add Guest</Button>
        </div>

        <GuestTable guests={guests} onStayUpdate={fetchGuests} />
        <GuestFormModal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          onSubmit={addGuest} 
        />
      </div>
    </div>
  );
};

export default RoomBookingPage;
