import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify"

const WeeklyMenu = () => {
    const [updateId, setUpdateId] = useState();
    const [sideModel, setSideModel] = useState(false)
    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [expenseHeadId, setExpenseHeadId] = useState('');

    const [selectedUpdatedDay, setSelectedUpdatedDay] = useState();
    const [selectedUpdatedTime, setSelectedUpdatedTime] = useState();
    const [selectedUpdatedMenuItem, setSelectedUpdatedMenuItem] = useState();
    const [block, setBlock] = useState();
    const [floor, setFloor] = useState();
    const [type, setType] = useState();
    const [product_name, setProduct_name] = useState();
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [uom, setUOM] = useState();
    const [name, setName] = useState();
    const [datalist, setDatalist] = useState([]);
    const [headlist, setHeadlist] = useState([]);

    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState('');

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleMenuItemChange = (e) => {
        setSelectedMenuItem(e.target.value);
    };

    const handleSubmit = () => {
        let errorMessage = '';
    
        // Validate date
        if (!selectedDay) {
            errorMessage += "Date is required.\n";
        }
    
        // Validate title
        if (!selectedTime) {
            errorMessage += "Menu Time required.\n";
        }

        if (!selectedMenuItem) {
            errorMessage += "Menu Item required.\n";
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
            id: name,
            day: selectedDay,
            time: selectedTime,
            menu_item_id: selectedMenuItem,
        };
    
        // Send POST request to backend to add expense
        axiosClient.post("weekly-menus", payload)
            .then((response) => {
                // Handle success
                toast.success(`MenuItem added successfully.`, {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
    
                // Clear form fields after successful submission
                getdata();
                setName('');
                setAmount('');
                setDescription('');
                setQuantity('');
                setUOM('');

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
    
    const updateCity = (item) => {
        setSideModel(true)
        setUpdateId(item.id);
        setName(item.name);
        setDescription(item.description);
        setAmount(item.price);
        setUOM(item.unit_of_measurement)
        setQuantity(item.quantity);
    }
    const handleUpdate = (data) => {
        setSideModel(false)

        const payload = {
            id: selectedUpdatedMenuItem,
            day: selectedUpdatedDay,
            time: selectedUpdatedTime,
            menu_item_id: selectedUpdatedMenuItem,
        };
        
        axiosClient.put(`weekly-menus/${selectedUpdatedMenuItem}`, payload)
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
                getdata();
                setName('');
                setAmount('');
                setDescription('');
                setQuantity('');
                setUOM('');
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
        axiosClient.get("weekly-menus")
            .then((response) => {
                setDatalist(response.data);
                console.log(datalist)
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
                <h1>Menu Items</h1>
                <div className="recent-orders">
                    <table>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                <th>Day</th>
                                <th>Time</th>
                                <th>Menu Item</th>
                                <th>Quantity</th>
                                <th>Created AT</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        {datalist.length > 0 ? (
                            <tbody>
                                {datalist.map((item, nu) => (
                                    <tr key={item.id}>
                                        <td className="primary">{nu + 1}</td>
                                        <td className="primary">{item.day}</td>
                                        <td className="info">{item.time}</td>
                                        <td className="info">{item.menu_item.name}</td>
                                        <td className="info">{item.menu_item.description}</td>
                                        <td className="info">{item.created_at?.slice(0, 10)}</td>
                                        <td className="flex">
                                            <a className="primary" onClick={(e) => { e.preventDefault(); updateCity(item); }}>Edit</a>
                                            <a className="warning" onClick={(e) => { e.preventDefault(); deleteItem(item); }}>Delete</a>
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
                        <h2>Add New Item</h2>
                        <div className="entry-one">
                            <label>GUIDE</label>
                            <input placeholder="'Monday', 'Breakfast', 'DISH'" disabled></input>

                            <label>Day</label>
                            <select value={selectedDay} onChange={handleDayChange}>
                                <option value="">Select Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>

                            <label>Time</label>
                            <select value={selectedTime} onChange={handleTimeChange}>
                                <option value="">Select Time</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                            </select>

                            <label>Food Item</label>
                            <select value={selectedMenuItem} onChange={handleMenuItemChange}>
                                <option value="">Select Food Item</option>
                                {menuItems.map(item => (
                                    <option key={item.id} value={item.id}>{item.id} {item.name}</option>
                                ))}
                            </select>
                        </div>
                        <button className="save" onClick={handleSubmit}>Add Item</button>
                    </div>
                </div>
            </main>
            {sideModel &&

                <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
                    <div className="model-side-closebtn" onClick={() => setSideModel(false)}>
                        <span className="material-symbols-outlined rotate-icon">close</span>
                    </div>
                    <div className="form">
                        <h2>Update Item</h2>
                        <div className="entry-one">
                            <label>GUIDE</label>
                            <input placeholder="'Monday', 'Breakfast', 'DISH'" disabled></input>

                            <label>Day</label>
                            <select value={selectedUpdatedDay} onChange={handleDayChange}>
                                <option value="">Select Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>

                            <label>Time</label>
                            <select value={selectedUpdatedTime} onChange={handleTimeChange}>
                                <option value="">Select Time</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                            </select>

                            <label>Food Item</label>
                            <select value={selectedUpdatedMenuItem} onChange={handleMenuItemChange}>
                                <option value="">Select Food Item</option>
                                {menuItems.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <button className="save" onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            }
        </div>
    );
};

export default WeeklyMenu