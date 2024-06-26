import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {InfinitySpin} from 'react-loader-spinner';
import Loader from 'react-loader-spinner';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const CustomerList = () => {
    const [updateId, setUpdateId] = useState();
    const [sideModel, setSideModel] = useState(false);
    const [isloading, setIsloading] = useState(false);

    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [expenseHeadId, setExpenseHeadId] = useState('');
    const [name, setName] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [cnicNumber, setCnicNumber] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [placeOfIssue, setPlaceOfIssue] = useState('');
    const [dateOfIssue, setDateOfIssue] = useState('');
    const [completeAddress, setCompleteAddress] = useState('');
    const [bookingstatus, setBookingStatus] = useState('');

    
    const [product_name, setProduct_name] = useState();
    const [quantity, setQuantity] = useState();
    const [datalist, setDatalist] = useState([]);
    const [headlist, setHeadlist] = useState([]);

    const clearDataValues = () =>{
        setName('');
        setFatherName('');
        setCnicNumber('');
        setContactNumber('');
        setPassportNumber('');
        setDateOfIssue('');
        setCompleteAddress('');
        setPlaceOfIssue('');
        setBookingStatus('');
    }

    const hanldeSubmit = () => {
        let errorMessage = '';
    
        // Validate date
        if (!name) {
            errorMessage += "name is required.\n";
        }
    
        // Validate title
        if (!fatherName) {
            errorMessage += "father is required.\n";
        }
    
        // Validate expense head
        if (!contactNumber) {
            errorMessage += "contact Head is required.\n";
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
    
        // Create payload object with expense data
        const payload = {
            name: name,
            father_name: fatherName,
            cnic_number: cnicNumber,
            contact_number:contactNumber,
            passport_number: passportNumber,
            place_of_issue:placeOfIssue,
            date_of_issue: dateOfIssue,
            complete_address: completeAddress,
            status: bookingstatus,
        };
    
        // Send POST request to backend to add expense
        axiosClient.post("customer", payload)
            .then((response) => {
                // Handle success
                toast.success("Expense added successfully.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });

                getdata();
                // Clear form fields after successful submission
                clearDataValues();

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
                    toast.error("Failed to add expense. Please try again later.", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                    });
                }
            });
    };
    
    const updateData = (item) => {
        setSideModel(true)
        setUpdateId(item.id)
        setName(item.name);
        setFatherName(item.father_name);
        setCnicNumber(item.cnic_number);
        setContactNumber(item.contact_number);
        setPassportNumber(item.passport_number);
        setPlaceOfIssue(item.place_of_issue);
        setDateOfIssue(item.date_of_issue);
        setCompleteAddress(item.complete_address);
        setBookingStatus(item.status);
    }
    const handleUpdate = (data) => {
        setSideModel(false)

        let payload = {
            name: name,
            father_name: fatherName,
            cnic_number: cnicNumber,
            contact_number:contactNumber,
            passport_number: passportNumber,
            place_of_issue:placeOfIssue,
            date_of_issue: dateOfIssue,
            complete_address: completeAddress,
            status: bookingstatus,
        };
        axiosClient.put(`customer/${updateId}`, payload)
            .then((response) => {
                toast.success(`${name} Updated Sucessfully`, {
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
                clearDataValues();
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
    const deleteCity = (item) => {
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
                axiosClient.delete(`customer/${item.id}`)
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
        setIsloading(true);
        axiosClient.get("customer")
            .then((response) => {
                setDatalist(response.data);
                setIsloading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    
    const getexpensedata = () => {
        axiosClient.get("expensehead")
            .then((response) => {
                setHeadlist(response.data);
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
                <h1>Customer List</h1>      
                <div className="recent-orders">
                    <table>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                <th>Name</th>
                                <th>Father</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th>Created AT</th>
                                <th>Updated AT</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        {isloading ? <td colSpan="7"><InfinitySpin
                                            visible={true}
                                            width="200"
                                            color="#4fa94d"
                                            ariaLabel="infinity-spin-loading"
                                        />
                        </td>:<></>}
                        {datalist.length > 0 ? (
                            <tbody>
                                {datalist.map((item, nu) => (
                                    <tr key={item.id}>
                                        <td className="primary">{nu + 1}</td>
                                        <td className="primary">{item.name}</td>
                                        <td className="info">{item.father_name}</td>
                                        <td className="info">{item.contact_number}</td>
                                        {/* <td className="info">{item.complete_address}</td> */}
                                        <td className="info">{item.status}</td>
                                        <td className="info">{item.created_at?.slice(0, 10)}</td>
                                        <td className="info">{item.updated_at?.slice(0, 10)}</td>
                                        <td className="flex">
                                            <a className="primary" onClick={(e) => { e.preventDefault(); updateData(item); }}>Edit</a>
                                            <a className="warning" onClick={(e) => { e.preventDefault(); deleteCity(item); }}>Delete</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan="7">No records found</td>
                                </tr>
                            </tbody>
                        )}

                    </table>
                </div>
            </main>
            <main>
                <div className="" style={{ margin: '5.6rem 0 0 0', display: 'flex', justifyContent: 'center' }}>
                <div className="form">
                    <h2>New Customer</h2>
                    <div className="entry-one">
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                        <label>Father Name</label>
                        <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required />

                        <label>NIC</label>
                        <input type="text" value={cnicNumber} onChange={(e) => setCnicNumber(e.target.value)} />

                        <label>Contact</label>
                        <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />

                        <label>Passport No.</label>
                        <input type="text" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} />

                        <label>Place of Issue</label>
                        <input type="text" value={placeOfIssue} onChange={(e) => setPlaceOfIssue(e.target.value)} />

                        <label>Date of Issue</label>
                        <input type="date" value={dateOfIssue} onChange={(e) => setDateOfIssue(e.target.value)} />

                        <label>Complete Address</label>
                        <textarea value={completeAddress} onChange={(e) => setCompleteAddress(e.target.value)} required />

                        <label>Status</label>
                        <select onChange={(e) => setBookingStatus(e.target.value)}>
                            <option value="">Select Value</option>
                            <option value="inquiry">Inquiry</option>
                            <option value="booked">Booked</option>
                            <option value="checkedout">Checked Out</option>
                        </select>
                    </div>

                    <button className="save" onClick={hanldeSubmit}>Add Customer</button>
                </div>
                </div>
            </main>
            {sideModel &&

                <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
                    <div className="model-side-closebtn" onClick={() => { setSideModel(false); clearDataValues(); }}>
                        <span className="material-symbols-outlined rotate-icon">close</span>
                    </div>
                    <div className="form">
                        <h2>Update Item</h2>
                        <div className="entry-one">
                            <label>Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                            <label>Father Name</label>
                            <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required />

                            <label>NIC</label>
                            <input type="text" value={cnicNumber} onChange={(e) => setCnicNumber(e.target.value)} />

                            <label>Contact</label>
                            <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />

                            <label>Passport No.</label>
                            <input type="text" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} />

                            <label>Place of Issue</label>
                            <input type="text" value={placeOfIssue} onChange={(e) => setPlaceOfIssue(e.target.value)} />

                            <label>Date of Issue</label>
                            <input type="date" value={dateOfIssue} onChange={(e) => setDateOfIssue(e.target.value)} />

                            <label>Complete Address</label>
                            <textarea value={completeAddress} onChange={(e) => setCompleteAddress(e.target.value)} required />

                            <label>Status</label>
                            <select onChange={(e) => setBookingStatus(e.target.value)}>
                                <option value="">Select Value</option>
                                <option value="inquiry">Inquiry</option>
                                <option value="booked">Booked</option>
                                <option value="checkedout">Checked Out</option>
                            </select>
                        </div>
                        
                        <button className="save" onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            }
        </div>
    );
};

export default CustomerList