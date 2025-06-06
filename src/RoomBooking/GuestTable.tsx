import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

interface Guest {
  _id?: string;
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
};

interface GuestTableProps {
  guests: Guest[];
  onStayUpdate: () => void;
}

const GuestTable: React.FC<GuestTableProps> = ({ guests, onStayUpdate }) => {

  const handleStayUpdate = async (guest: Guest, newStay: "Yes" | "No") => {
    if (!guest._id) return;

    try {
      await axios.patch(`http://localhost:5000/updateStay/${guest._id}`, {
        stay: newStay,
      });
      onStayUpdate();
    } catch (err) {
      console.error("Failed to update stay status", err);
      alert("Failed to update stay status");
    }
  };

  if (guests.length === 0) {
    return <p className="text-secondary text-center">No guest bookings yet.</p>;
  }

  const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped align-middle">
        <thead className='border'>
          <tr className='text-center'>
            <th>Name</th>
            <th>Mobile</th>
            <th>Room</th>
            <th>Guests</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Stay</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {guests.map((guest, index) => (
            <tr key={index} className='text-center'>
              <td>{guest.name}</td>
              <td>{guest.mobile}</td>
              <td>{guest.roomNumber}</td>
              <td>{guest.guests}</td>
              <td>{formatDate(guest.checkIn)}</td>
              <td>{formatDate(guest.checkOut)}</td>
              <td>
                <div className="d-flex gap-2 justify-content-center">
                  {guest.stay === "Yes" ? (
                    <Button
                      variant="success"
                      onClick={() => handleStayUpdate(guest, "No")}
                    >
                      Yes
                    </Button>
                  ) : (
                    <Button variant="danger" disabled>
                      No
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className='text-center text-secondary'>If click the "Yes" button, to change the stay status to "No".</p>
    </div>
  );
};

export default GuestTable;
