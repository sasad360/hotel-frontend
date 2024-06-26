import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify"

const ExpenseHead = () => {
    const [updateId, setUpdateId] = useState();
    const [sideModel, setSideModel] = useState(false)

    const [roomNumber, setRoomNumber] = useState();
    const [block, setBlock] = useState();
    const [floor, setFloor] = useState();
    const [type, setType] = useState();
    const [product_name, setProduct_name] = useState();
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [datalist, setDatalist] = useState([]);

    const hanldeSubmit = () => {

        let errorMessage = '';

        // Check each required field
        if (!roomNumber) {
            errorMessage += "head is required.\n";
        }

        // If any required field is missing, show error message
        if (errorMessage) {
            toast.error(errorMessage.trim(), { // trim() removes trailing whitespace
                position: "top-right",
                autoClose: 2500,
                theme: "colored",
            });
            return;
        }

        let payload = {
            name: roomNumber,
            description: block,

        };
        axiosClient.post("expensehead", payload)
            .then((response) => {
                toast.success(`${roomNumber} Added Sucessfully`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                // Clear fields after successful submission
                setRoomNumber(''); // Clear roomNumber state
                setBlock(''); // Clear block state
                setFloor(''); // Clear floor state
                setType(''); // Clear type state
                getdata();
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
    };

    const updateCity = (item) => {
        setSideModel(true)
        setUpdateId(item.id)
        setProduct_name(item.name);
        setQuantity(item.description);
    }
    const handleUpdate = (data) => {
        setSideModel(false)

        let payload = {
            name: product_name,
            description: quantity,
        };
        axiosClient.put(`expensehead/${updateId}`, payload)
            .then((response) => {
                toast.success(`${product_name} Updated Sucessfully`, {
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
                setProduct_name('');
                setQuantity('');
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
                axiosClient.delete(`expensehead/${item.id}`)
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

    //receive data
    const getdata = () => {
        axiosClient
            .get("expensehead")
            .then((response) => {
                setDatalist(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const hanldeEdit = (data) => {
        alert(data);
    };
    useEffect(() => {
        getdata();
    }, []);




    return (
        <div className="container">
            <main>
                <h1>Expense Head</h1>
                <div className="recent-orders">
                    <table>
                        <thead>
                            <tr>
                                <th>Sr.</th>
                                <th>Heade</th>
                                <th>Description</th>
                                <th>Created AT</th>
                                <th>Updated AT</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {datalist.length > 0 ? (
                            <tbody>
                                {datalist.map((item, nu) => (
                                    <tr key={item.id}>
                                        <td className="primary">{nu + 1}</td>
                                        <td className="primary">{item.name}</td>
                                        <td className="info">{item.description}</td>
                                        <td className="info">{item.created_at?.slice(0, 10)}</td>
                                        <td className="info">{item.updated_at?.slice(0, 10)}</td>
                                        <td className="flex">
                                            <a className="primary" onClick={(e) => { e.preventDefault(); updateCity(item); }}>Edit</a>
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
                        <h2>Add Expense Head</h2>
                        <div className="entry-block">
                            <label>Expense Head</label>
                            <input type="text" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />

                            <label>Description</label>
                            <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} />

                        </div>
                        <button className="save" onClick={hanldeSubmit}>Add Expense Head</button>
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
                        <div className="entry-block">
                            <label>Item</label>
                            <input type="text" value={product_name} onChange={(e) => setProduct_name(e.target.value)} required />

                            <label>Quantity</label>
                            <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                        </div>
                        <button className="save" onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            }
        </div>
    );
};

export default ExpenseHead
