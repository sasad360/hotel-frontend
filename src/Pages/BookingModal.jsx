// BookingModal.js
import React, { useState } from 'react';

const BookingModal = ({ room, onClose }) => {
    const [name, setName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [cnicNumber, setCnicNumber] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [placeOfIssue, setPlaceOfIssue] = useState('');
    const [dateOfIssue, setDateOfIssue] = useState('');
    const [completeAddress, setCompleteAddress] = useState('');
    const [bookingStatus, setBookingStatus] = useState('inquiry');
    const [arrivalDate, setArrivalDate] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [perDateRent, setPerDateRent] = useState('');
    const [advance, setAdvance] = useState('');

    const handleBooking = async () => {
        const customerPayload = {
            name,
            father_name: fatherName,
            cnic_number: cnicNumber,
            contact_number: contactNumber,
            passport_number: passportNumber,
            place_of_issue: placeOfIssue,
            date_of_issue: dateOfIssue,
            complete_address: completeAddress,
            status: bookingStatus
        };

        const bookingPayload = {
            room_id: room.id,
            arrival_date: arrivalDate,
            arrival_time: arrivalTime,
            departure_date: departureDate,
            departure_time: departureTime,
            rate: perDateRent,
            status: bookingStatus,
            advance: advance
        };

        try {
            const customerResponse = await fetch('/api/customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerPayload)
            });

            const customerData = await customerResponse.json();

            if (customerResponse.ok) {
                const bookingResponse = await fetch('/api/booking', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ...bookingPayload,
                        customer_id: customerData.id
                    })
                });

                if (bookingResponse.ok) {
                    onClose();
                } else {
                    console.error('Booking failed');
                }
            } else {
                console.error('Customer creation failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    if (!room) {
        return null;
        
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2>Book Room {room.room_number}</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleBooking(); }}>
                    <div className="form-row">
                        <label>Name:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Father's Name:</label>
                        <input 
                            type="text" 
                            value={fatherName} 
                            onChange={(e) => setFatherName(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>CNIC Number:</label>
                        <input 
                            type="text" 
                            value={cnicNumber} 
                            onChange={(e) => setCnicNumber(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Contact Number:</label>
                        <input 
                            type="text" 
                            value={contactNumber} 
                            onChange={(e) => setContactNumber(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Passport Number:</label>
                        <input 
                            type="text" 
                            value={passportNumber} 
                            onChange={(e) => setPassportNumber(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Place of Issue:</label>
                        <input 
                            type="text" 
                            value={placeOfIssue} 
                            onChange={(e) => setPlaceOfIssue(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Date of Issue:</label>
                        <input 
                            type="date" 
                            value={dateOfIssue} 
                            onChange={(e) => setDateOfIssue(e.target.value)} 
                        />
                    </div>
                    <div className="form-row full-width">
                        <label>Complete Address:</label>
                        <textarea 
                            placeholder='Enter Complete Adderss...'
                            type="text" 
                            value={completeAddress} 
                            onChange={(e) => setCompleteAddress(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Arrival Date:</label>
                        <input 
                            type="date" 
                            value={arrivalDate} 
                            onChange={(e) => setArrivalDate(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Arrival Time:</label>
                        <input 
                            type="time" 
                            value={arrivalTime} 
                            onChange={(e) => setArrivalTime(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Departure Date:</label>
                        <input 
                            type="date" 
                            value={departureDate} 
                            onChange={(e) => setDepartureDate(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Departure Time:</label>
                        <input 
                            type="time" 
                            value={departureTime} 
                            onChange={(e) => setDepartureTime(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Per Date Rent:</label>
                        <input 
                            type="text" 
                            value={perDateRent} 
                            onChange={(e) => setPerDateRent(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Advance:</label>
                        <input 
                            type="text" 
                            value={advance} 
                            onChange={(e) => setAdvance(e.target.value)} 
                        />
                    </div>
                    <div className="form-row">
                        <label>Booking Status:</label>
                        <select 
                            value={bookingStatus} 
                            onChange={(e) => setBookingStatus(e.target.value)}
                        >
                            <option value="inquiry">Inquiry</option>
                            <option value="booked">Booked</option>
                        </select>
                    </div>
                    <div className="button-group">
                        <button type="submit">Book Room</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
