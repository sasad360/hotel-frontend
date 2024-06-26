import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify"
import { InfinitySpin } from "react-loader-spinner";

const ServiceToCheckIn = () => {
    const [updateId, setUpdateId] = useState();
    const [sideModel, setSideModel] = useState(false)
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [isloading, setIsloading] = useState(true);
    const [showSC, setShowSC] = useState(false);

    const [selectedUpdatedDay, setSelectedUpdatedDay] = useState();
    const [selectedUpdatedTime, setSelectedUpdatedTime] = useState();
    const [selectedUpdatedMenuItem, setSelectedUpdatedMenuItem] = useState();
    const [block, setBlock] = useState();
    const [room, setRoom] = useState();
    const [service, setService] = useState();
    const [serviceCharges, setServiceCharges] = useState();
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [uom, setUOM] = useState();
    const [name, setName] = useState();
    const [datalist, setDatalist] = useState([]);
    const [headlist, setHeadlist] = useState([]);
    const [searchID, setSearchID] = useState('');
    const [serviceChargeList, setServiceChargeList] = useState([]);

    const [selectedBooking, setSelectedBooking] = useState([]);
    // const [searchedRoomNo, setSearchRoomNo] = useState('null');

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState('');


    const handleSubmit = (item) => {
        const booking = datalist.find(item => item.id === parseInt(searchID));
        if(booking){
            setSelectedBooking(booking);
            console.log(selectedBooking, 'booking list')
        }
        setShowSC(false);
        
        let errorMessage = '';
    
        // Validate date
        if (!searchID) {
            errorMessage += "Booking ID required.\n";
        }
    
        // Create payload object with expense data
        const payload = {
            booking_id: searchID,
        };
    
        // Send POST request to backend to add expense
        axiosClient.post(`service-to-checkins/${searchID}`, payload)
            .then((response) => {
                setServiceChargeList(response.data);
                setSearchID();
                setShowSC(true);
                toast.success(`Record founded successfully.`, {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
    
                // Clear form fields after successful submission

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.errors) {
                    const errors = error.response.data.errors;
                    let errorMessage = '';
                    errors.forEach((err) => {
                        errorMessage += err + '\n';
                    });
                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        theme: "colored",
                    });
                } else {
                    console.error("Error adding expense:", error);
                    toast.error("An unknown error occurred", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                    });
                }
            });
            
    };
    
    const AddService = (item) => {
        setSideModel(true)
        setUpdateId(item.id);
        setName(item.customer.name);
        setRoom(item.room.room_number);
        setDescription(item.description);
        setAmount(item.price);
        setUOM(item.unit_of_measurement);
        setQuantity(item.quantity);
    }
    const handleService = (data) => {
        setSideModel(false)

        const payload = {
            booking_id: updateId,
            service_name:service,
            service_charge:serviceCharges,
            service_date:selectedDay,
        };
        
        
        axiosClient.post(`service-to-checkins`, payload)
            .then((response) => {
                toast.success(`Menu Item Updated Sucessfully`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setUpdateId();
                setService();
                setServiceCharges();
                setSelectedDay();
            })
            .catch((err) => {
                console.log(err)
                var firstErrorMessage = '';
                if (err.response.data.error && Object.keys(err.response.data.error).length != 0) {
                    var errors = err.response.data.error
                    const errorMessages = Object.values(errors); // Get an array of all error messages
                    firstErrorMessage = errorMessages.shift(); // Get the first error message
                    toast.error(firstErrorMessage[0], {
                        position: "top-right",
                        autoClose: 1500,
                        theme: "colored",
                    });
                } else {
                    // console.log('firstErrorMessage',firstErrorMessage[0])
                    toast.error(err.response.data.message, {
                        position: "top-right",
                        autoClose: 1500,
                        theme: "colored",
                    });
                }
            });

    }
    const deleteItem = (item) => {
        Swal.fire({
            title: "please confirm?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axiosClient.delete(`weekly-menu/${item.id}`)
                    .then((response) => {
                        toast.success(response.data.message, {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                        getdata();
                    })
                    .catch((error) => {
                        toast.error("record not found", {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    });
            };
        })
    }

    const getdata = () => {
        axiosClient.get("booking")
            .then((response) => {
                setDatalist(response.data.bookings);
                setIsloading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getexpensedata = () => {
        axiosClient.get("menuitems")
            .then((response) => {
                setMenuItems(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getdata();
        getexpensedata();
    }, []);




    return (
        <div className="container">
            <main>
                <h1>Service To Check-In</h1>
                <div className="recent-orders">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Booking ID</th>
                                <th>Customer</th>
                                <th>Room No.</th>
                                <th>Booked Date</th>
                                <th>Service</th>
                            </tr>
                        </thead>
                        {datalist.length > 0 ? (
                            <tbody>
                                {datalist.map((items, index) => (
                                    <tr key={items.id}>
                                        <td className="primary">{index + 1}</td>
                                        <td className="info">{items.id}</td> {/* Name of the customer */}
                                        <td className="info">{items.customer.name}</td> {/* Name of the customer */}
                                        <td className="info">{items.room.room_number}</td> {/* Room number */}
                                        <td className="info">{items.arrival_date}</td> {/* items date */}
                                        {/* <td className="info">{items.menu_item.description}</td>  */}
                                        {/* <td className="info">{items.created_at.slice(0, 10)}</td> 
                                        <td className="info">{items.updated_at.slice(0, 10)}</td>  */}
                                        <td className="flex">
                                            <a className="primary" onClick={(e) => { e.preventDefault(); AddService(items); }}>Add Service</a>
                                            {/* <a className="warning" onClick={(e) => { e.preventDefault(); deleteItem(items); }}>Delete</a> */}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                {isloading ? <td colSpan="7">
                                    <InfinitySpin
                                        visible={true}
                                        width="200"
                                        color="#4fa94d"
                                        ariaLabel="infinity-spin-loading"
                                    />
                                    </td>:
                                    <td colSpan="7">No records found</td>
                                }
                                </tr>
                            </tbody>
                        )}

                    </table>
                </div>
            </main>
            <main>
                <div className="" style={{ margin: '5.6rem 0 0 0', display: 'flex', justifyContent: 'center' }}>
                    <div className="form">
                        <h2>View Charges</h2>
                        <div className="entry-block">

                            <label>Booking ID</label>
                            <input onChange={(e)=>setSearchID(e.target.value)} placeholder="Enter customer to search"/>

                        </div>
                        <button className="save" onClick={handleSubmit}>Search Cutomer</button>
                    </div>
                </div>
                    
                    
                
                {showSC && (
                    <div className="form mt-2">
                        <div className="entry-show">
                            <p>Customer:</p>
                            <h5>{selectedBooking.customer && selectedBooking.customer.name}</h5>
                            <p>Room:</p>
                            <h5>{selectedBooking.room && selectedBooking.room.room_number}</h5>
                            {serviceChargeList.map((item)=>(
                                <>
                                    <h5>{item.service_name}</h5>
                                    <h5>{item.service_charge}</h5>
                                </>
                            ))
                            }
                        </div>
                    </div>
                )}
                        
                    
            </main>
            {sideModel &&

                <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
                    <div className="model-side-closebtn" onClick={() => setSideModel(false)}>
                        <span className="material-symbols-outlined rotate-icon">close</span>
                    </div>
                    <div className="form">
                        <h2>Add Service</h2>
                        <div className="entry-one">
                            <label>Customer</label>
                            <input type="text" value={name} disabled />
                            <label>Room</label>
                            <input type="text" value={room} disabled />
                            <label>Service Title</label>
                            <input type="text" value={service} onChange={(e) => setService(e.target.value)} required />
                            <label>Charges</label>
                            <input type="number" value={serviceCharges} onChange={(e) => setServiceCharges(e.target.value)} required />
                            <label>Date</label>
                            <input type="date" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} required />                  
                        </div>
                        <button className="save" onClick={handleService}>Add Charges</button>
                    </div>
                </div>
            }
        </div>
    );
};

export default ServiceToCheckIn