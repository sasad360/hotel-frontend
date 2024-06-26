import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {InfinitySpin} from 'react-loader-spinner';
import Loader from 'react-loader-spinner';

const Expense = () => {
    const [updateId, setUpdateId] = useState();
    const [sideModel, setSideModel] = useState(false);
    const [isloading, setIsloading] = useState(false);

    const [date, setDate] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [expenseHeadId, setExpenseHeadId] = useState('');

    const [roomNumber, setRoomNumber] = useState();
    const [block, setBlock] = useState();
    const [floor, setFloor] = useState();
    const [type, setType] = useState();
    const [product_name, setProduct_name] = useState();
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [datalist, setDatalist] = useState([]);
    const [headlist, setHeadlist] = useState([]);
    const [updatedDate, setUpdatedDate] = useState([]);
    const [updatedTitle, setUpdatedTitle] = useState([]);
    const [updatedDescription, setUpdateDescription] = useState([]);
    const [updatedAmount, setUpdatedAmount] = useState([]);
    const [updatedExpenseHeadId, setUpdatedExpenseHeadId] = useState([]);


    const hanldeSubmit = () => {
        let errorMessage = '';
    
        // Validate date
        if (!date) {
            errorMessage += "Date is required.\n";
        }
    
        // Validate title
        if (!title) {
            errorMessage += "Title is required.\n";
        }
    
        // Validate amount
        if (!amount || isNaN(amount) || amount <= 0) {
            errorMessage += "Valid amount is required.\n";
        }
    
        // Validate expense head
        if (!expenseHeadId) {
            errorMessage += "Expense Head is required.\n";
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
            date: date,
            title: title,
            description: description,
            amount: amount,
            expense_head_id: expenseHeadId,
        };
    
        // Send POST request to backend to add expense
        axiosClient.post("expenses", payload)
            .then((response) => {
                // Handle success
                toast.success("Expense added successfully.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
    
                // Clear form fields after successful submission
                getdata();
                setDate('');
                setTitle('');
                setDescription('');
                setAmount('');
                setExpenseHeadId('');

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
        setUpdateId(item.id)
        setUpdatedTitle(item.title);
        setUpdateDescription(item.description);
        setUpdatedAmount(item.amount);
        setUpdatedDate(item.date);

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
                axiosClient.delete(`expenses/${item.id}`)
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
        axiosClient.get("expenses")
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
          <h1>Expense List</h1>
          <div className="recent-orders">
            {isloading ? (
              <table>
                <tr colSpan="4">
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="#4fa94d"
                        ariaLabel="infinity-spin-loading"
                    />
                </tr>
              </table>
            ) : (
              <>
                {datalist.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Sr.</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Head</th>
                        <th>Date</th>
                        <th>Created AT</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datalist.map((item, nu) => (
                        <tr key={item.id}>
                          <td className="primary">{nu + 1}</td>
                          <td className="primary">{item.title}</td>
                          <td className="info">{item.description}</td>
                          <td className="info">{item.amount}</td>
                          <td className="info">{item.head_name}</td>
                          <td className="info">{item.date}</td>
                          <td className="info">
                            {item.created_at?.slice(0, 10)}
                          </td>
                          <td className="flex">
                            <a
                              className="primary"
                              onClick={(e) => {
                                e.preventDefault();
                                updateCity(item);
                              }}
                            >
                              Edit
                            </a>
                            <a
                              className="warning"
                              onClick={(e) => {
                                e.preventDefault();
                                deleteCity(item);
                              }}
                            >
                              Delete
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>No records found</div>
                )}
              </>
            )}
          </div>
        </main>
        <main>
          <div
            className=""
            style={{
              margin: "5.6rem 0 0 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="form">
              <h2>Add Expense</h2>
              <div className="entry-block">
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />

                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <label>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <label>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />

                <label>Expense Head</label>
                <select
                  value={expenseHeadId}
                  onChange={(e) => setExpenseHeadId(e.target.value)}
                  required
                >
                  <option value="">Choose an Option</option>
                  {headlist.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="save" onClick={hanldeSubmit}>
                Add Expense
              </button>
            </div>
          </div>
        </main>
        {sideModel && (
          <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
            <div
              className="model-side-closebtn"
              onClick={() => setSideModel(false)}
            >
              <span className="material-symbols-outlined rotate-icon">
                close
              </span>
            </div>
            <div className="form">
              <h2>Update Expense</h2>
              <div className="entry-block">
                <label>Date</label>
                <input
                  type="date"
                  value={updatedDate}
                  onChange={(e) => setUpdatedDate(e.target.value)}
                  required
                />

                <label>Title</label>
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  required
                />

                <label>Description</label>
                <textarea
                  type="text"
                  value={updatedDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                />

                <label>Amount</label>
                <input
                  type="number"
                  value={updatedAmount}
                  onChange={(e) => setUpdatedAmount(e.target.value)}
                  required
                />

                <label>Expense Head</label>
                <select
                  value={updatedExpenseHeadId}
                  onChange={(e) => setUpdatedExpenseHeadId(e.target.value)}
                  required
                >
                  <option value="">Choose an Option</option>
                  {headlist.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <button className="save" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        )}
      </div>
    );
};

export default Expense