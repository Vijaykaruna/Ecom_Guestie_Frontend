import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface Guest {
  id: any;
  name: string;
  mobile: string;
  email: string;
  roomNumber: number;
  guests: number;
  checkIn: string;
  checkOut: string;
  stay: string;
  payment: string;
  amount: number;
}

const GuestFormModal: React.FC<{
  show: boolean;
  onHide: () => void;
  onSubmit: (guest: Guest) => void;
}> = ({ show, onHide, onSubmit }) => {

  const [formData, setFormData] = useState<Guest>({
    id: '',
    name: '',
    mobile: '',
    email: '',
    roomNumber: 0,
    guests: 1,
    checkIn: '',
    checkOut: '',
    stay: "Yes",
    payment: "Pending",
    amount: 0,
  });

  const [totalRooms, setTotalRooms] = useState<number>(10);

  useEffect(() => {
    axios.get("http://localhost:5000/Rooms", { withCredentials: true })
  .then(res => {
    setTotalRooms(res.data.data);
    //console.log("Rooms: ", res.data.data);
  }).catch(err => {
    console.log(err);
  });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'guests' ? +value : value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !/^\d{10}$/.test(formData.mobile)) {
      alert("Please enter a valid name and 10-digit mobile number.");
      return;
    }

    const guestData = { ...formData };

    axios.post("http://localhost:5000/addGuest", guestData, { withCredentials: true })
      .then((res) => {
        onSubmit(guestData);
        setFormData({
          id: '',
          name: '',
          mobile: '',
          email: '',
          roomNumber: 0,
          guests: 1,
          checkIn: '',
          checkOut: '',
          stay: "Yes",
          payment: "Pending",
          amount: 0,
        });
        console.log(res.data);
        
      })
      .catch((err) => {
        console.error("Failed to add guest:", err);
        alert("Error: " + (err.response?.data?.message || "Could not add guest."));
      });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Guest Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Mobile</Form.Label>
            <Form.Control name="mobile" value={formData.mobile} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Room Number</Form.Label>
            <Form.Select
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            >
              <option className='text-secondary' value={0}>Select Room</option>
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
            <Form.Label>Guests</Form.Label>
            <Form.Control type="number" name="guests" min={1} value={formData.guests} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Check-in</Form.Label>
            <Form.Control type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Check-out</Form.Label>
            <Form.Control type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Add Booking</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GuestFormModal;
