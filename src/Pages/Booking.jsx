import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {InfinitySpin} from 'react-loader-spinner';
import Loader from 'react-loader-spinner';



const Booking = () => {
    const [updateId, setUpdateId] = useState();
    const [sideModel, setSideModel] = useState(false);
    const [isloading, setIsloading] = useState(false);
    const [datalist, setDatalist] = useState([]);

    const [bookingCustomer, setBookingCustomer] = useState([]);

    const [customerSearchID, setCustomerSearchID] = useState();

    const[roomlist, setRoomlist] =useState([]);

    const [arrivalDate, setArrivalDate] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [perDateRent, setPerDateRent] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [status, setStatus] = useState('');
    const [roomOptions, setRoomOptions] = useState([]);
    

    const getStatusTooltip = (status) => {
        switch (status) {
            case 'available':
                return 'Available';
            case 'booked':
                return 'Booked';
            case 'maintenance':
                return 'Under Maintenance';
            default:
                return '';
        }
    };

    const getdata = () => {
        setIsloading(true);
        axiosClient.get("rooms")
            .then((response) => {
            setIsloading(false);
            setRoomlist(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const handleSubmit = () => {

        let errorMessage = '';

        // Validate arrival date and time
        if (!arrivalDate) {
            errorMessage += "Arrival Date is required.\n";
        }
    
        if (!arrivalTime) {
            errorMessage += "Arrival Time is required.\n";
        }
    
        // Validate customer ID
        if (!bookingCustomer.id) {
            errorMessage += "Customer SearchID is required.\n";
        }
    
        // Validate selected room
        if (!selectedRoom) {
            errorMessage += "Room is required.\n";
        }
    
        // If any validation fails, show error message and return
        if (errorMessage) {
            toast.error(errorMessage.trim(), {
                position: "top-right",
                autoClose: 2500,
                theme: "colored",
            });
            return;
        }

        const formData = {
            // id: bookingCustomer.id, // If you have a booking ID, include it here
            customer_id: bookingCustomer.id,
            room_id: selectedRoom,
            arrival_date: arrivalDate,
            arrival_time: arrivalTime,
            departure_date: departureDate,
            departure_time: departureTime,
            rate: perDateRent,
            status,
        };
        console.log('submitted', formData)

        axiosClient.post('booking', formData)
            .then((response) => {
                // Handle success
                toast.success("Booking done, successfully.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
    
                // Clear form fields after successful submission
                formData('');

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.errors) {
                    const errors = error.response.data.errors;
                    let errorMessage = '';
                    for (const key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorMessage += errors[key].join('\n') + '\n';
                        }
                    }
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        theme: "colored",
                    });
                } else {
                    console.error("Error adding expense:", error);
                    toast.error("Booking Failed. Please try again later.", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                    });
                }
            });
        setIsloading(false);
    }

    const getcustomer = () => {

        let errorMessage = '';
    
   
        // Validate expense head
        if (!customerSearchID) {
            errorMessage += "customer SearchID is required.\n";
        }
    
        // If any validation fails, show error message and return
        if (errorMessage) {
            toast.error(errorMessage.trim(), {
                position: "top-right",
                autoClose: 2500,
                theme: "colored",
            });
            return;
        }
        setIsloading(true);
        let payload={
            SearchID: customerSearchID,
        }
        // Send POST request to backend to add expense
        axiosClient.post(`customer/bookingcustomer/${customerSearchID}`, payload)
            .then((response) => {
                // Handle success
                toast.success("customer found successfully.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
    
                // Clear form fields after successful submission
                setBookingCustomer(response.data);
                console.log(bookingCustomer)
                setCustomerSearchID('');

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.errors) {
                    const errors = error.response.data.errors;
                    let errorMessage = '';
                    for (const key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorMessage += errors[key].join('\n') + '\n';
                        }
                    }
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        theme: "colored",
                    });
                } else {
                    console.error("Error adding expense:", error);
                    toast.error("Failed to get customer. Please try again later.", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                    });
                }
            });
        setIsloading(false);
    }
    

    useEffect(() => {
        getdata();
    }, []);



  return (
      <div className='container'>
          
      {/* <!-------------main body----------------> */}
      <main>

          <h1>Room Booking</h1>
          {isloading ? <td colSpan="7">
            <InfinitySpin
                visible={true}
                width="200"
                color="#4fa94d"
                ariaLabel="infinity-spin-loading"
            />
            </td>:<></>}
            {/* <div class="recent-orders form">
                <div class="entry-from">
                    <div class="entry-four">
                        <h4>Plot No.</h4>
                        <p>details will go here</p>
                        <h4>Client ID</h4>
                        <p>details will go here</p>
                    </div>

                    <div class="entry-four">
                        <h4>Client Name</h4>
                        <p>details will go here</p>
                        <h4>Sur Name</h4>
                        <p>details will go here</p>
                    </div>
                </div>
            </div> */}
            <div class="recent-orders form">
                <div class="entry-four">
                    <label htmlFor="arrivalDate">Arrival Date</label>
                    <input type="date" id="arrivalDate" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} />

                    <label htmlFor="arrivalTime">Arrival Time</label>
                    <input type="time" id="arrivalTime" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />

                    <label htmlFor="departureDate">Departure Date</label>
                    <input type="date" id="departureDate" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />

                    <label htmlFor="departureTime">Departure Time</label>
                    <input type="time" id="departureTime" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />

                    <label htmlFor="perDateRent">Per Date Rent</label>
                    <input type="text" id="perDateRent" value={perDateRent} onChange={(e) => setPerDateRent(e.target.value)} />

                    <label htmlFor="room">Room</label>
                    <select id="room" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                        <option value="">Choose a Room</option>
                        {roomlist.filter(room => room.status === 'available').map(room => (
                            <option key={room.room_number} value={room.id}>{room.room_number}, {room.type}</option>
                        ))}
                    </select>

                    <label htmlFor="status">Status *</label>
                    {/* <input type="text" id="status" value={status} onChange={(e) => setStatus(e.target.value)} /> */}
                    <select name="" value={status} id="status" onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Choose a Status</option>
                        <option value="reserved">Reserved</option>
                        <option value="booked">Booked</option>
                    </select>

                    {/* <button onClick={handleSubmit}>Submit</button> */}
                </div>
                
              </div>
              <button class="save" onClick={handleSubmit}>Book Now</button>

      </main>
                  
        <div class="right">
            <main class="form" style={{marginTop:'5.6rem'}}>
                <h2 style={{margin:'5px'}}>Customer</h2>
                <div class="entry-one">
                        <p>Any ID</p>
                        <input type="text" placeholder="Enter any, ID, NIC, Passport, Contact" value={customerSearchID} onChange={(e) => setCustomerSearchID(e.target.value)} required/>
                </div>
                <button class="save" style={{margin: '5px auto'}} onClick={getcustomer}>Get info</button>

                <div class="entry-one">
                        <h5>Name</h5>
                        <p>{bookingCustomer.name}</p>
                        <h5>Contact</h5>
                        <p>{bookingCustomer.contact_number}</p>
                        <h5>NIC</h5>
                        <p>{bookingCustomer.cnic_number}</p>
                        <h5>Address</h5>
                        <p>{bookingCustomer.complete_address}</p>

                </div>
            </main>
            <main class="form">

                <h2>Room Status</h2>
                <div className="updates room_list_dashboard mb-1">
                    {roomlist.map((room, index) => (
                        <div className={`room ${room.status}`} key={index} title={getStatusTooltip(room.status)}>
                            {room.room_number}
                        </div>
                    ))}
                </div>
            </main>
            <button class="save" style={{margin: '5px auto'}}>New Customer</button>

        </div>
    </div>
  )
}

export default Booking