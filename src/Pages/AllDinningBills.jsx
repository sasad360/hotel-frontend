import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify"
import { InfinitySpin } from "react-loader-spinner";

const AllDinningBills = () => {
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
    const [selectedBill, setSelectedBill] = useState(null);


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
        axiosClient.get("bills")
            .then((response) => {
                setDatalist(response.data.bills);
                console.log('datalist',datalist)
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

    const handleViewDetails = (bill) => {
        setSelectedBill(bill);
        setSideModel(true);
    };

    const handleDelete = (bill) => {
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
                axiosClient.delete(`bills/${bill}`)
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
            }
        });
    };

    useEffect(() => {
        getdata();
        getexpensedata();
    }, []);




    return (
        <div className="containerfull">
            <main>
                <h1>All Bills</h1>
                <div className="recent-orders">
                    <table>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                <th>Bill ID</th>
                                <th>Customer</th>
                                <th>Bill Date</th>
                                <th>Total Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {isloading ? (
                            <tbody>
                                <tr>
                                    <td colSpan="6">Loading...</td>
                                </tr>
                            </tbody>
                        ) : datalist.length > 0 ? (
                            <tbody>
                                {datalist.map((bill, index) => (
                                    <tr key={bill.id}>
                                        <td className="primary">{index + 1}</td>
                                        <td className="info">{bill.id}</td>
                                        <td className="info">{bill.customer_name || bill.walk_in_customer_name || 'Walk-in'}</td>
                                        <td className="info">{bill.bill_date}</td>
                                        <td className="info"><b>{bill.total_amount}</b></td>
                                        <td className="flex">
                                            <a className="primary" onClick={(e) => { e.preventDefault(); handleViewDetails(bill); }}>View Details</a>
                                            <a className="warning" onClick={(e) => { e.preventDefault(); handleDelete(bill.id); }}>Delete</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="6">No records found</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </main>
            <main>
                    
                    
                
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
            {sideModel && selectedBill && (
                <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
                    <div className="model-side-closebtn" onClick={() => setSideModel(false)}>
                        <span className="material-symbols-outlined rotate-icon">close</span>
                    </div>
                    <div className="form">
                        <h2>Bill Details</h2>
                        <div className="entry-one">
                            <label>Customer</label>
                            <input type="text" value={selectedBill.customer_name || selectedBill.walk_in_customer_name || 'Walk-In Customer'} disabled />
                            <label>Bill Date</label>
                            <input type="text" value={selectedBill.bill_date} disabled />
                            <label>Total Amount</label>
                            <input type="text" value={selectedBill.total_amount} disabled />

                        </div>
                        <div className="entry-block">
                            <h2>Items</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                        <th>Unit Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBill.items.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.unit_price}</td>
                                            <td>{item.subtotal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AllDinningBills