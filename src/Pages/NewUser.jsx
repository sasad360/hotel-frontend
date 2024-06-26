import React from "react";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {InfinitySpin} from 'react-loader-spinner';
import Loader from 'react-loader-spinner';



const NewUser = () => {
    const [sideModel, setSideModel] = useState(false);
    const [isloading, setIsloading] = useState(false);

    const [datalist, setDataList] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('manager'); // Default role

    // Define state variables for editing user information
    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [editConfirmPassword, setEditConfirmPassword] = useState('');
    const [editRole, setEditRole] = useState('');
    const allowedRoles = ['manager', 'cash-counter'];

    const handleAddUser = () => {
        let errorMessage = '';
    
        // Validate form fields
        if (!name) {
            errorMessage += "Name is required.\n";
        }
        if (!email) {
            errorMessage += "Email is required.\n";
        }
        if (!password) {
            errorMessage += "Password is required.\n";
        }
        if (password !== confirmPassword) {
            errorMessage += "Passwords do not match.\n";
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
    
        const payload = {
            name: name,
            email: email,
            password: password,
            roles: [role] // Assuming role is a single role ID or name
        };
    
        // Send API request to create user
        axiosClient.post('/users', payload)
            .then((response) => {
                // Handle success
                toast.success("User created successfully.", {
                    position: "top-right",
                    autoClose: 2000,
                    theme: "colored",
                });
                // Clear form fields after successful user creation
                resetValues();
                getdata();
            })
            .catch((error) => {
                // Handle API error
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
                    console.error("Error creating user:", error);
                    toast.error("An error occurred while creating user.", {
                        position: "top-right",
                        autoClose: 2500,
                        theme: "colored",
                    });
                }
            });
    };

    const resetValues = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('manager');
        // Reset edit states if needed
        setEditId('');
        setEditName('');
        setEditEmail('');
        setEditPassword('');
        setEditConfirmPassword('');
        setEditRole('');
    };
     

    const getdata = () => {
        setIsloading(true);
        axiosClient.get("users")
            .then((response) => {
            setIsloading(false);
            setDataList(response.data);
            console.log(response.data)
        })
        .catch((err) => {
            console.log(err);
        });
    };


    

    useEffect(() => {
        getdata();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
        ];
        const dateParts = dateString.slice(0, 10).split('-'); // Split the date string into an array [yyyy, mm, dd]
        const year = dateParts[0];
        const monthIndex = parseInt(dateParts[1], 10) - 1; // Convert month to zero-based index
        const day = dateParts[2];
        const monthName = monthNames[monthIndex]; // Get the month name

        return `${day} ${monthName} ${year}`; // Format the date as dd Month yyyy
    }

    
    // Function to open the side model for editing a user
    const updateUser = (user) => {
        // Populate the state variables with the values of the user being edited
        setEditId(user.id);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditPassword(''); // You may choose to clear password fields here
        setEditConfirmPassword('');
        // Check if user has roles
        if (user.roles && user.roles.length > 0) {
            // Set the role name from the first role in the roles array
            setEditRole(user.roles[0].name);
        } else {
            // Set default value if user has no roles
            setEditRole('');
        }
        setSideModel(true);
    }

    const handleUpdate = () => {
        setSideModel(false);
      
        let payload = {
          name: editName,
          email: editEmail,
          password: editPassword,
          roles: [role] // Assuming role is the selected role ID
        };
      
        axiosClient.put(`/users/${editId}`, payload)
          .then((response) => {
            toast.success(`${name} Updated Successfully`, {
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
            resetValues();
          })
          .catch((err) => {
            console.log(err);
            let errorMessage = '';
            if (err.response && err.response.data && err.response.data.errors) {
              const errors = err.response.data.errors;
              for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                  errorMessage += errors[key].join('\n') + '\n';
                }
              }
            } else if (err.response && err.response.data && err.response.data.message) {
              errorMessage = err.response.data.message;
            } else {
              errorMessage = "An error occurred while updating.";
            }
            toast.error(errorMessage, {
              position: "top-right",
              autoClose: 1500,
              theme: "colored",
            });
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
                axiosClient.delete(`users/${item.id}`)
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


  return (
    <div className="container">
      {/* <!-------------main body----------------> */}
      <main>
        <h1>List of Acitve User's</h1>

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
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Role Display</th>
                      <th>Created AT</th>
                      <th>Updated AT</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datalist.map((item, nu) => (
                      <tr key={item.id}>
                        <td className="primary">{nu + 1}</td>
                        <td className="primary">{item.name}</td>
                        <td className="info">{item.email}</td>
                        <td className="info">
                          {item.roles.length > 0 ? item.roles[0].name : "N/A"}
                        </td>
                        <td className="info">
                          {item.roles.length > 0
                            ? item.roles[0].display_name
                            : "N/A"}
                        </td>
                        <td className="info">
                          {item.created_at?.slice(0, 10)}
                        </td>
                        <td className="info">
                          {item.updated_at?.slice(0, 10)}
                        </td>
                        <td className="flex">
                          <a
                            className="primary"
                            onClick={(e) => {
                              e.preventDefault();
                              updateUser(item);
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
                <td colSpan="8">No records found</td>
              )}
            </>
          )}
        </div>

      </main>

      <div class="right">
        <main className="form" style={{ marginTop: "5.6rem" }}>
          <h2 style={{ margin: "5px" }}>Create New User</h2>
          <div className="entry-one">
            <p>Name:</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p>Email:</p>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p>Password:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p>Confirm Password:</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="manager">Manager</option>
              <option value="cash-counter">Cashier</option>
            </select>
          </div>
          <button className="save" onClick={handleAddUser}>
            Add New User
          </button>
        </main>
      </div>

      {sideModel && (
            <div className={`model-side ${sideModel ? "model-side-show" : ""}`}>
                <div className="model-side-closebtn" onClick={() => { setSideModel(false); resetValues();}}>
                    <span className="material-symbols-outlined rotate-icon">close</span>
                </div>
                <div className="form">
                    <h2>Update User</h2>
                    <div className="entry-one">
                        <label>Name</label>
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />

                        <label>Email</label>
                        <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />

                        <label>Password</label>
                        <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} required />

                        <label>Confirm Password</label>
                        <input type="password" value={editConfirmPassword} onChange={(e) => setEditConfirmPassword(e.target.value)} required />

                        <label>Role</label>
                        <select onChange={(e) => setRole(e.target.value)}>
                            <option value="">Select Role</option>
                            {allowedRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>

                    </div>
                    <button className="save" onClick={handleUpdate}>Update</button>
                </div>
            </div>
        )}


    </div>
  );
}

export default NewUser